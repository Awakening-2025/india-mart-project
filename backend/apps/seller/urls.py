# backend/apps/seller/urls.py
from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import SellerDashboardStatsAPIView,SellerOrderViewSet 

router = DefaultRouter()
router.register(r'orders', SellerOrderViewSet, basename='seller-order')

urlpatterns = [
    path('dashboard-stats/', SellerDashboardStatsAPIView.as_view(), name='seller-dashboard-stats'),
     path('', include(router.urls)),
]