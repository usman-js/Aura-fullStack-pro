from decimal import Decimal
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class StoreSetting(models.Model):
    """
    Global configuration for store operations, financial rates, and contact info.
    Implements a singleton pattern.
    """
    store_name = models.CharField(max_length=150, default='AURA Minimalist Living')
    tagline = models.CharField(max_length=255, default='Timeless Essentials for Modern Living')
    support_email = models.EmailField(default='support@aurastore.com')
    support_phone = models.CharField(max_length=30, default='+1 (800) 555-0199')
    store_address = models.CharField(max_length=255, default='742 Evergreen Terrace, San Francisco, CA')
    logo = models.ImageField(upload_to='store/', blank=True, null=True)

    currency = models.CharField(max_length=10, default='USD')
    currency_symbol = models.CharField(max_length=5, default='$')

    flat_shipping_rate = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('15.00'),
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    free_shipping_threshold = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('150.00'),
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    tax_rate_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('8.50'),
        validators=[MinValueValidator(Decimal('0.00')), MaxValueValidator(Decimal('100.00'))]
    )
    default_low_stock_threshold = models.PositiveIntegerField(default=5)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Store Setting'
        verbose_name_plural = 'Store Settings'

    def __str__(self):
        return f"{self.store_name} Settings"

    def save(self, *args, **kwargs):
        # Guarantee singleton row
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_settings(cls):
        settings, _ = cls.objects.get_or_create(pk=1)
        return settings
