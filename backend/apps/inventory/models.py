# apps/inventory/models.py
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

from apps.products.models import ProductVariant


class Inventory(models.Model):
    """
    Stock tracker for each product variant.
    A database-level check constraint prevents negative stock.
    """
    variant = models.OneToOneField(
        ProductVariant,
        on_delete=models.CASCADE,
        related_name='inventory'
    )
    quantity = models.IntegerField(default=0)
    low_stock_threshold = models.PositiveIntegerField(default=5)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Inventory'
        verbose_name_plural = 'Inventories'
        constraints = [
            models.CheckConstraint(
                condition=models.Q(quantity__gte=0),
                name='inventory_quantity_non_negative'
            )
        ]

    def __str__(self):
        return f"{self.variant.sku} - Stock: {self.quantity}"

    @property
    def is_in_stock(self):
        return self.quantity > 0

    @property
    def is_low_stock(self):
        return 0 < self.quantity <= self.low_stock_threshold

    @property
    def is_out_of_stock(self):
        return self.quantity == 0


class InventoryTransactionReason(models.TextChoices):
    SALE = 'SALE', _('Sale Deduction')
    RESTOCK = 'RESTOCK', _('Restock Addition')
    RETURN = 'RETURN', _('Customer Return')
    ADJUSTMENT = 'ADJUSTMENT', _('Manual Audit Adjustment')
    CANCELLATION = 'CANCELLATION', _('Order Cancellation Restock')


class InventoryTransaction(models.Model):
    """
    Immutable ledger of every stock change.
    Entries can be created but never edited or deleted.
    """
    inventory = models.ForeignKey(
        Inventory,
        on_delete=models.CASCADE,
        related_name='transactions'
    )
    quantity_delta = models.IntegerField(
        help_text="Positive for addition/restock, negative for deduction/sale"
    )
    balance_after = models.IntegerField(
        help_text="Stock balance immediately following this transaction"
    )
    reason = models.CharField(
        max_length=30,
        choices=InventoryTransactionReason.choices,
        default=InventoryTransactionReason.ADJUSTMENT
    )
    reference_id = models.CharField(
        max_length=100,
        blank=True,
        help_text="Associated Order ID or Purchase Order reference"
    )
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='inventory_transactions'
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        verbose_name = 'Inventory Transaction'
        verbose_name_plural = 'Inventory Transactions'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.inventory.variant.sku}: {self.quantity_delta:+d} ({self.get_reason_display()})"

    def save(self, *args, **kwargs):
        if self.pk is not None:
            raise ValueError("Inventory transactions are immutable.")
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValueError("Inventory transactions cannot be deleted.")