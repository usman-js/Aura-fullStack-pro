from django.contrib import admin
from .models import StoreSetting

@admin.register(StoreSetting)
class StoreSettingAdmin(admin.ModelAdmin):
    list_display = ('store_name', 'currency', 'flat_shipping_rate', 'free_shipping_threshold', 'tax_rate_percent', 'updated_at')

    def has_add_permission(self, request):
        # Disallow creating multiple settings rows if one already exists
        return not StoreSetting.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
