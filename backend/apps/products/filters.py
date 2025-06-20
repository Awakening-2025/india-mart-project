# backend/apps/products/filters.py

from django_filters.rest_framework import FilterSet, CharFilter, NumberFilter
from .models import Product

class ProductFilter(FilterSet):
    # Search by category name (exact match)
    category_name = CharFilter(field_name='category__name', lookup_expr='iexact')
    
    # Price range filters
    min_price = NumberFilter(field_name="price", lookup_expr='gte') # gte = greater than or equal to
    max_price = NumberFilter(field_name="price", lookup_expr='lte') # lte = less than or equal to

    class Meta:
        model = Product
        # Yahan wo fields hain jin par hum exact match filter chahte hain
        fields = ['category_name', 'min_price', 'max_price']