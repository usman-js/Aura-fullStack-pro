from django.contrib import admin
from .models import Inventory, InventoryTransaction

class InventoryTransactionInline(admin.TabularInline):
    model = InventoryTransaction
    extra = 0
    readonly_fields = ('quantity_delta', 'balance_after', 'reason', 'reference_id', 'created_by', 'created_at')
    can_delete = False

@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ('variant', 'quantity', 'low_stock_threshold', 'is_in_stock', 'is_low_stock', 'updated_at')
    list_filter = ('low_stock_threshold',)
    search_fields = ('variant__sku', 'variant__title', 'variant__product__title')
    inlines = [InventoryTransactionInline]

@admin.register(InventoryTransaction)
class InventoryTransactionAdmin(admin.ModelAdmin):
    list_display = ('inventory', 'quantity_delta', 'balance_after', 'reason', 'reference_id', 'created_by', 'created_at')
    list_filter = ('reason', 'created_at')
    search_fields = ('inventory__variant__sku', 'reference_id', 'notes')
    readonly_fields = ('inventory', 'quantity_delta', 'balance_after', 'reason', 'reference_id', 'notes', 'created_by', 'created_at')
