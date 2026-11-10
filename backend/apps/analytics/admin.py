from django.contrib import admin
from .models import DailySalesSnapshot

@admin.register(DailySalesSnapshot)
class DailySalesSnapshotAdmin(admin.ModelAdmin):
    list_display = ('date', 'total_revenue', 'total_orders', 'total_items_sold', 'created_at')
    list_filter = ('date',)
    ordering = ('-date',)
