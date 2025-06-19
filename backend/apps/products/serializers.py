# apps/products/serializers.py

from rest_framework import serializers
from .models import Category, Product, Review
from apps.users.serializers import UserSerializer  # Assuming this path is correct

# ===============================================
#  CATEGORY AND REVIEW SERIALIZERS (READ-ONLY)
# ===============================================

class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for the Category model. Used for read operations.
    """
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent']

class ReviewSerializer(serializers.ModelSerializer):
    """
    Serializer for the Review model. Used for read operations.
    Includes nested user information.
    """
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'comment', 'created_at']


# ===============================================
#  PRODUCT SERIALIZERS
# ===============================================

# ----------------- 1. FOR WRITING DATA (CREATE/UPDATE) -----------------
class ProductWriteSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating products.
    Accepts a simple Primary Key (ID) for the category field,
    which is ideal for handling form-data or JSON submissions.
    """
    # This field expects the UUID of an existing Category.
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())

    class Meta:
        model = Product
        # These are the fields the frontend will send when creating/updating a product.
        fields = [
            'name', 
            'description', 
            'price', 
            'sale_price', 
            'category', 
            'stock', 
            'image', 
            'is_active'
        ]


# ----------------- 2. FOR READING DATA (LIST/RETRIEVE) -----------------

class ProductListSerializer(serializers.ModelSerializer):
    """
    A compact serializer for listing multiple products.
    Shows nested category info and calculated properties for performance.
    """
    category = CategorySerializer(read_only=True)
    # These are read-only properties from the Product model.
    average_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    discount_percent = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 
            'name', 
            'price', 
            'stock',
            'sale_price',
            'discount_percent',
            'image', 
            'category', 
            'average_rating', 
            'review_count'
        ]

class ProductDetailSerializer(serializers.ModelSerializer):
    """
    A detailed serializer for retrieving a single product.
    Provides full nested information for related models like category, seller, and reviews.
    """
    # Override fields to use nested serializers for rich, readable output.
    category = CategorySerializer(read_only=True)
    seller = UserSerializer(read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)

    # Include calculated properties from the model.
    average_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    discount_percent = serializers.IntegerField(read_only=True)

    class Meta:
        model = Product
        # All fields from the model are included for a detailed view.
        fields = [
            'id', 
            'name', 
            'description', 
            'price', 
            'sale_price',
            'discount_percent',
            'image', 
            'stock', 
            'is_active', 
            'category', 
            'seller', 
            'average_rating', 
            'review_count',
            'reviews',
            'created_at',
            'updated_at'
        ]