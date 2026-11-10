from django.http import JsonResponse

def api_root(request):
    """
    Root entry point providing API overview and navigation links.
    """
    return JsonResponse({
        'project': 'AURA Minimalist Living API',
        'status': 'operational',
        'version': '1.0.0',
        'documentation': 'Full-stack RESTful e-commerce API backend',
        'quick_links': {
            'django_admin': request.build_absolute_uri('/django-admin/'),
            'auth': request.build_absolute_uri('/api/auth/'),
            'products': request.build_absolute_uri('/api/products/'),
            'cart': request.build_absolute_uri('/api/cart/'),
            'orders': request.build_absolute_uri('/api/orders/'),
            'payments': request.build_absolute_uri('/api/payments/'),
            'store_settings': request.build_absolute_uri('/api/settings/'),
            'inventory': request.build_absolute_uri('/api/inventory/'),
            'analytics': request.build_absolute_uri('/api/admin-dashboard/'),
        }
    })
