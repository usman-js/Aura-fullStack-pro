from decimal import Decimal
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.accounts.models import User, UserRole, CustomerProfile, Address
from apps.products.models import Category, Product, ProductVariant
from apps.inventory.models import Inventory, InventoryTransaction, InventoryTransactionReason
from apps.store_settings.models import StoreSetting

class Command(BaseCommand):
    help = 'Seeds initial store settings, admin user, categories, products, variants, and stock levels.'

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Beginning e-commerce database seeding..."))

        # 1. Store Settings
        settings = StoreSetting.get_settings()
        settings.store_name = "AURA Minimalist Living"
        settings.tagline = "Curated Objects for Calm Living"
        settings.support_email = "concierge@aurastore.com"
        settings.support_phone = "+1 (800) 555-0199"
        settings.flat_shipping_rate = Decimal('15.00')
        settings.free_shipping_threshold = Decimal('150.00')
        settings.tax_rate_percent = Decimal('8.50')
        settings.save()
        self.stdout.write(self.style.SUCCESS("✓ Store settings configured."))

        # 2. Admin User
        admin_email = "admin@aurastore.com"
        admin_user, created = User.objects.get_or_create(
            email=admin_email,
            defaults={
                'first_name': 'Eleanor',
                'last_name': 'Vance',
                'role': UserRole.ADMIN,
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin_user.set_password("AdminPass123!")
            admin_user.save()
            self.stdout.write(self.style.SUCCESS(f"✓ Admin account created: {admin_email} / AdminPass123!"))
        else:
            self.stdout.write(self.style.NOTICE(f"ℹ Admin account already exists: {admin_email}"))

        # 3. Customer User
        customer_email = "customer@example.com"
        customer_user, cust_created = User.objects.get_or_create(
            email=customer_email,
            defaults={
                'first_name': 'Sophia',
                'last_name': 'Sterling',
                'role': UserRole.CUSTOMER,
            }
        )
        if cust_created:
            customer_user.set_password("CustomerPass123!")
            customer_user.save()
            CustomerProfile.objects.create(
                user=customer_user,
                phone_number="+1 (415) 555-0142",
                marketing_opt_in=True
            )
            Address.objects.create(
                user=customer_user,
                full_name="Sophia Sterling",
                phone_number="+1 (415) 555-0142",
                street_address_1="450 Sutter St, Suite 800",
                city="San Francisco",
                state_province="CA",
                postal_code="94108",
                country="United States",
                is_default=True
            )
            self.stdout.write(self.style.SUCCESS(f"✓ Customer account created: {customer_email} / CustomerPass123!"))

        # 4. Categories
        categories_data = [
            ("Furniture", "furniture", "Architectural seating, tables, and storage with timeless silhouettes.", 1),
            ("Lighting", "lighting", "Sculptural luminaires and ambient illumination crafted from cast brass and matte glass.", 2),
            ("Ceramics & Tableware", "ceramics", "Hand-thrown stoneware, reactive glazes, and minimalist dining essentials.", 3),
            ("Home Textiles", "textiles", "Pure Belgian linen, bouclé throws, and natural organic wool accoutrements.", 4),
        ]
        cat_map = {}
        for name, slug, desc, order in categories_data:
            cat, _ = Category.objects.get_or_create(
                slug=slug,
                defaults={'name': name, 'description': desc, 'display_order': order, 'is_active': True}
            )
            cat_map[slug] = cat
        self.stdout.write(self.style.SUCCESS("✓ Catalog categories created."))

        # 5. Products & Variants & Inventory
        products_data = [
            {
                "title": "Komorebi Lounge Chair",
                "category": cat_map["furniture"],
                "short_description": "Solid white oak frame with hand-loomed natural bouclé upholstery.",
                "description": "Inspired by Kyoto mid-century modernism, the Komorebi Lounge Chair balances generous ergonomics with a clean architectural profile. Each frame is shaped from sustainably harvested American white oak and finished with an ultra-matte protective oil.",
                "base_price": Decimal("890.00"),
                "sale_price": None,
                "is_featured": True,
                "variants": [
                    {"sku": "KMR-OAK-NAT", "title": "White Oak / Natural Bouclé", "color": "Natural", "size": "Standard", "add": Decimal("0.00"), "stock": 18},
                    {"sku": "KMR-WAL-CHAR", "title": "Smoked Walnut / Charcoal Wool", "color": "Charcoal", "size": "Standard", "add": Decimal("120.00"), "stock": 8},
                ]
            },
            {
                "title": "Forma Sculptural Pendant Lamp",
                "category": cat_map["lighting"],
                "short_description": "Hand-blown frosted opaline glass suspended from solid brushed brass.",
                "description": "The Forma Pendant casts a warm, museum-quality ambient glow. Designed as a singular focal statement or grouped over dining islands and reception spaces.",
                "base_price": Decimal("340.00"),
                "sale_price": Decimal("295.00"),
                "is_featured": True,
                "variants": [
                    {"sku": "FRM-PND-BRS", "title": "Brushed Brass / 30cm", "color": "Brass", "size": "30cm", "add": Decimal("0.00"), "stock": 24},
                    {"sku": "FRM-PND-BLK", "title": "Matte Anodized Black / 30cm", "color": "Matte Black", "size": "30cm", "add": Decimal("0.00"), "stock": 15},
                    {"sku": "FRM-PND-BRS-LG", "title": "Brushed Brass / 45cm", "color": "Brass", "size": "45cm", "add": Decimal("90.00"), "stock": 6},
                ]
            },
            {
                "title": "Sabi Hand-Thrown Stoneware Vase",
                "category": cat_map["ceramics"],
                "short_description": "Matte speckled stoneware with hand-formed asymmetrical silhouette.",
                "description": "Each Sabi vase is wheel-thrown in small batches by master ceramicists. Features a raw unglazed exterior contrasted with a waterproof glazed interior.",
                "base_price": Decimal("110.00"),
                "sale_price": None,
                "is_featured": True,
                "variants": [
                    {"sku": "SAB-VAS-CHALK", "title": "Chalk White / Medium", "color": "Chalk White", "size": "Medium", "add": Decimal("0.00"), "stock": 35},
                    {"sku": "SAB-VAS-EARTH", "title": "Terracotta Ash / Tall", "color": "Terracotta Ash", "size": "Tall", "add": Decimal("25.00"), "stock": 4}, # low stock test
                ]
            },
            {
                "title": "Heritage Belgian Linen Duvet Set",
                "category": cat_map["textiles"],
                "short_description": "Stonewashed European flax linen with tailored double-stitch edging.",
                "description": "Woven from 100% certified organic Belgian flax. Pre-washed for cloud-like softness that breathes effortlessly in summer and insulates in winter.",
                "base_price": Decimal("280.00"),
                "sale_price": Decimal("245.00"),
                "is_featured": True,
                "variants": [
                    {"sku": "HBL-DUV-Q-OAT", "title": "Queen / Oat Milk", "color": "Oat Milk", "size": "Queen", "add": Decimal("0.00"), "stock": 20},
                    {"sku": "HBL-DUV-K-OAT", "title": "King / Oat Milk", "color": "Oat Milk", "size": "King", "add": Decimal("40.00"), "stock": 12},
                    {"sku": "HBL-DUV-Q-SLT", "title": "Queen / Slate Olive", "color": "Slate Olive", "size": "Queen", "add": Decimal("0.00"), "stock": 0}, # Out of stock test
                ]
            },
            {
                "title": "Nara Minimalist Oak Coffee Table",
                "category": cat_map["furniture"],
                "short_description": "Low-profile coffee table with soft pill-shaped beveled perimeter.",
                "description": "A study in reductive form. Solid white oak construction with concealed mortise-and-tenon joinery designed for generations of daily ritual.",
                "base_price": Decimal("640.00"),
                "sale_price": None,
                "is_featured": False,
                "variants": [
                    {"sku": "NAR-TBL-NAT", "title": "Natural Oak / 120cm", "color": "Natural Oak", "size": "120cm", "add": Decimal("0.00"), "stock": 10},
                    {"sku": "NAR-TBL-BLK", "title": "Smoked Black Oak / 120cm", "color": "Black Oak", "size": "120cm", "add": Decimal("50.00"), "stock": 7},
                ]
            },
            {
                "title": "Aether Cast Bronze Table Lamp",
                "category": cat_map["lighting"],
                "short_description": "Machined solid bronze base with integrated tactile rotary dimmer.",
                "description": "Weighty, tactile, and understated. The Aether lamp features an integrated warm LED source that transitions smoothly from deep candlelight to reading brightness.",
                "base_price": Decimal("420.00"),
                "sale_price": None,
                "is_featured": False,
                "variants": [
                    {"sku": "AET-LMP-BRZ", "title": "Antiqued Bronze", "color": "Bronze", "size": "Compact", "add": Decimal("0.00"), "stock": 14},
                    {"sku": "AET-LMP-SLV", "title": "Brushed Nickel", "color": "Silver", "size": "Compact", "add": Decimal("0.00"), "stock": 9},
                ]
            },
        ]

        for p_info in products_data:
            product, _ = Product.objects.get_or_create(
                title=p_info["title"],
                defaults={
                    "category": p_info["category"],
                    "short_description": p_info["short_description"],
                    "description": p_info["description"],
                    "base_price": p_info["base_price"],
                    "sale_price": p_info["sale_price"],
                    "is_featured": p_info["is_featured"],
                    "is_active": True,
                }
            )
            for v_info in p_info["variants"]:
                variant, _ = ProductVariant.objects.get_or_create(
                    sku=v_info["sku"],
                    defaults={
                        "product": product,
                        "title": v_info["title"],
                        "color": v_info["color"],
                        "size": v_info["size"],
                        "additional_price": v_info["add"],
                        "is_active": True,
                    }
                )
                inventory, _ = Inventory.objects.get_or_create(
                    variant=variant,
                    defaults={
                        "quantity": v_info["stock"],
                        "low_stock_threshold": 5,
                    }
                )
                if not InventoryTransaction.objects.filter(inventory=inventory).exists():
                    InventoryTransaction.objects.create(
                        inventory=inventory,
                        quantity_delta=v_info["stock"],
                        balance_after=v_info["stock"],
                        reason=InventoryTransactionReason.RESTOCK,
                        reference_id="SEED-INIT-001",
                        notes="Initial inventory batch allocation",
                        created_by=admin_user,
                    )

        self.stdout.write(self.style.SUCCESS("✓ Products, Variants, Inventory & Transactions successfully seeded!"))
