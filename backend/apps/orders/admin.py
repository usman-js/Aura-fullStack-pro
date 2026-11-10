from django.contrib import admin
from .models import Order, OrderItem, AdminActivityLog

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product_title', 'variant_title', 'sku', 'unit_price', 'quantity', 'total_price')
    can_delete = False

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'order_number',
        'customer_email',
        'customer_name',
        'status',
        'total_amount',
        'created_at'
    )
    list_filter = ('status', 'created_at')
    search_fields = ('order_number', 'customer_email', 'customer_name', 'tracking_number')
    readonly_fields = ('id', 'order_number', 'created_at', 'updated_at')
    inlines = [OrderItemInline]

@admin.register(AdminActivityLog)
class AdminActivityLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'target_model', 'target_id', 'created_at')
    list_filter = ('action', 'target_model', 'created_at')
    search_fields = ('user__email', 'target_model', 'target_id', 'details')
    readonly_fields = ('user', 'action', 'target_model', 'target_id', 'details', 'created_at')
