from django.db import transaction
from django.db.models import F

from apps.inventory.models import (
    Inventory,
    InventoryTransaction,
    InventoryTransactionReason,
)


class InsufficientStockError(Exception):
    """Raised when there isn't enough stock to fulfil a request."""
    pass


def reserve_stock(variant_id, quantity, reference_id="", created_by=None):
    """
    Deducts stock for a variant and writes the ledger entry in one transaction.
    Locks the inventory row so two buyers can't take the last item at once.
    """
    with transaction.atomic():
        inventory = (
            Inventory.objects
            .select_for_update()
            .select_related("variant")
            .get(variant_id=variant_id)
        )

        if inventory.quantity < quantity:
            raise InsufficientStockError(
                f"Only {inventory.quantity} left for {inventory.variant.sku}"
            )

        inventory.quantity = F("quantity") - quantity
        inventory.save(update_fields=["quantity", "updated_at"])
        inventory.refresh_from_db()

        InventoryTransaction.objects.create(
            inventory=inventory,
            quantity_delta=-quantity,
            balance_after=inventory.quantity,
            reason=InventoryTransactionReason.SALE,
            reference_id=reference_id,
            created_by=created_by,
        )

        return inventory