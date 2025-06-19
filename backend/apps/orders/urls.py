# backend/apps/orders/urls.py

from rest_framework.routers import DefaultRouter
from .views import CartViewSet, OrderViewSet # Import CartViewSet

router = DefaultRouter()
router.register(r'cart', CartViewSet, basename='cart') # Register cart endpoint
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = router.urls