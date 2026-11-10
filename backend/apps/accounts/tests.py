from decimal import Decimal
from django.test import TestCase
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError
from apps.accounts.models import User, UserRole, Address, CustomerProfile
from apps.products.models import Category, Product, ProductVariant
from apps.inventory.models import Inventory, InventoryTransaction, InventoryTransactionReason
from apps.store_settings.models import StoreSetting

class DatabaseSchemaTestCase(TestCase):
    def setUp(self):
        # Create standard customer
        self.customer = User.objects.create_user(
            email='customer@example.com',
            password='SecureCustomerPass123!',
            first_name='Jane',
            last_name='Doe',
            role=UserRole.CUSTOMER
        )
        # Create admin user
        self.admin = User.objects.create_superuser(
            email='admin@example.com',
            password='SecureAdminPass123!',
            first_name='Admin',
            last_name='User'
        )

    def test_custom_user_creation(self):
        self.assertEqual(self.customer.email, 'customer@example.com')
        self.assertTrue(self.customer.check_password('SecureCustomerPass123!'))
        self.assertEqual(self.customer.role, UserRole.CUSTOMER)
        self.assertFalse(self.customer.is_admin)

        self.assertEqual(self.admin.role, UserRole.ADMIN)
        self.assertTrue(self.admin.is_staff)
        self.assertTrue(self.admin.is_superuser)
        self.assertTrue(self.admin.is_admin)

    def test_address_management_and_default_toggle(self):
        addr1 = Address.objects.create(
            user=self.customer,
            full_name='Jane Doe',
            phone_number='1234567890',
            street_address_1='100 Market St',
            city='San Francisco',
            state_province='CA',
            postal_code='94105',
            is_default=True
        )
        self.assertTrue(addr1.is_default)

        # Creating a second default address should automatically unset the first
        addr2 = Address.objects.create(
            user=self.customer,
            full_name='Jane Doe',
            phone_number='1234567890',
            street_address_1='200 Mission St',
            city='San Francisco',
            state_province='CA',
            postal_code='94105',
            is_default=True
        )
        addr1.refresh_from_db()
        self.assertFalse(addr1.is_default)
        self.assertTrue(addr2.is_default)

    def test_product_catalog_and_price_validation(self):
        category = Category.objects.create(name='Ceramics')
        self.assertEqual(category.slug, 'ceramics')

        product = Product.objects.create(
            category=category,
            title='Artisan Matte Teapot',
            description='Handcrafted ceramic teapot.',
            base_price=Decimal('78.00'),
            sale_price=Decimal('65.00')
        )
        self.assertEqual(product.slug, 'artisan-matte-teapot')
        self.assertEqual(product.effective_price, Decimal('65.00'))
        self.assertTrue(product.is_on_sale)

        # Invalid sale price (>= base price) should raise validation error
        invalid_product = Product(
            category=category,
            title='Invalid Pricing Teapot',
            description='Test',
            base_price=Decimal('50.00'),
            sale_price=Decimal('60.00')
        )
        with self.assertRaises(ValidationError):
            invalid_product.clean()

    def test_inventory_and_transaction_ledger(self):
        category = Category.objects.create(name='Home Decor')
        product = Product.objects.create(
            category=category,
            title='Minimalist Linen Cushion',
            description='Natural fiber cushion.',
            base_price=Decimal('45.00')
        )
        variant = ProductVariant.objects.create(
            product=product,
            sku='CUSH-LIN-SND',
            title='Sand / Standard',
            additional_price=Decimal('0.00')
        )
        inventory = Inventory.objects.create(
            variant=variant,
            quantity=25,
            low_stock_threshold=5
        )
        self.assertTrue(inventory.is_in_stock)
        self.assertFalse(inventory.is_low_stock)

        # Record restock transaction
        tx = InventoryTransaction.objects.create(
            inventory=inventory,
            quantity_delta=10,
            balance_after=35,
            reason=InventoryTransactionReason.RESTOCK,
            notes='Shipment batch 101'
        )
        self.assertEqual(tx.balance_after, 35)

    def test_store_settings_singleton(self):
        settings = StoreSetting.get_settings()
        self.assertEqual(settings.pk, 1)
        self.assertEqual(settings.currency, 'USD')

        settings.store_name = 'Updated Minimalist Studio'
        settings.save()

        refreshed = StoreSetting.get_settings()
        self.assertEqual(refreshed.store_name, 'Updated Minimalist Studio')
        self.assertEqual(StoreSetting.objects.count(), 1)
