from django.db import models
from decimal import Decimal

class DailySalesSnapshot(models.Model):
    """
    Cached aggregated daily sales metric snapshot.
    Used for fast historical reporting and charting.
    """
    date = models.DateField(unique=True, db_index=True)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    total_orders = models.PositiveIntegerField(default=0)
    total_items_sold = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Daily Sales Snapshot'
        verbose_name_plural = 'Daily Sales Snapshots'
        ordering = ['-date']

    def __str__(self):
        return f"{self.date}: ${self.total_revenue} ({self.total_orders} orders)"
