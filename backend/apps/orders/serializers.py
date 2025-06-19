# apps/orders/serializers.py
from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem
from apps.products.serializers import ProductListSerializer # Product ki info dikhane ke liye

class CartItemSerializer(serializers.ModelSerializer):
    # Cart mein jo product hai uski details
    product = ProductListSerializer(read_only=True)
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    # Cart ke andar saare items
    items = CartItemSerializer(many=True, read_only=True)
    user_id = serializers.UUIDField(source='user.id', read_only=True) # User ID dikhane ke liye

    class Meta:
        model = Cart
        fields = ['id', 'user_id', 'items', 'created_at']


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price_at_purchase']
        
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_id = serializers.UUIDField(source='user.id', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user_id', 'items', 'total_amount', 'status', 'created_at']