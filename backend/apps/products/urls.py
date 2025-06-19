# apps/products/urls.py
from django.urls import path, include
from rest_framework_nested import routers
from .views import CategoryViewSet, ProductViewSet, ReviewViewSet

# Main router for top-level resources
router = routers.DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')

# Nested router for reviews under a specific product
# URL aesa banega: /products/{product_pk}/reviews/
products_router = routers.NestedSimpleRouter(router, r'products', lookup='product')
products_router.register(r'reviews', ReviewViewSet, basename='product-reviews')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(products_router.urls)),
]

# Generated URLs will be like:
# /categories/
# /categories/{id}/
# /products/
# /products/{id}/
# /products/{product_pk}/reviews/
# /products/{product_pk}/reviews/{review_id}/