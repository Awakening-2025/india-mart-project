# apps/orders/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CartItemViewSet, OrderViewSet

# Hum yahan Cart ke liye alag se endpoint nahi bana rahe hain kyunki
# cart user se juda hota hai aur hum items ke through usse manage kar sakte hain.
# Ek custom endpoint '/cart/' banaya ja sakta hai agar zaroorat ho.

router = DefaultRouter()
# 'cart-items' ko 'cart/items/' mein badalna zyada intuitive hai.
router.register(r'cart/items', CartItemViewSet, basename='cartitem')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
]

# Generated URLs will be like:
# /cart/items/
# /cart/items/{id}/
# /orders/
# /orders/{id}/