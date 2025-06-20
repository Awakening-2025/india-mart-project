# ecommerce_api/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# API URL patterns
# Hum saare API endpoints ko /api/v1/ prefix ke neeche rakhenge.
api_urlpatterns = [
    # Authentication related URLs (login, signup, etc.)
    # URL: /api/v1/auth/...
    path('auth/', include('apps.users.urls')),

    # Product and category related URLs
    # URL: /api/v1/shop/...
    path('shop/', include('apps.products.urls')),

    # Order and cart related URLs
    # URL: /api/v1/sales/...
    path('sales/', include('apps.orders.urls')),
    path('seller/', include('apps.seller.urls')),
    path('wishlist/', include('apps.wishlist.urls')),
]

# Main URL patterns for the whole project
urlpatterns = [
    # Django Admin Panel
    path('admin/', admin.site.urls),

    # All API endpoints will be under /api/v1/
    path('api/v1/', include(api_urlpatterns)),

    # Add other top-level URLs here if needed
]

# Ye development ke time media files (jaise product images) ko serve karne ke liye zaroori hai.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)