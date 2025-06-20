# backend/apps/wishlist/serializers.py
from rest_framework import serializers
from .models import WishlistItem
from apps.products.serializers import ProductListSerializer

class WishlistItemSerializer(serializers.ModelSerializer):
    # Use ProductListSerializer to show nested product details
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'created_at']

class WishlistCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for adding an item to the wishlist.
    Only needs the product_id.
    """
    class Meta:
        model = WishlistItem
        fields = ['product']