# backend/apps/orders/serializers.py

from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem
from apps.products.models import Product
from apps.products.serializers import ProductListSerializer # To show product details in cart

# ===============================================
#  CART & CART ITEM (READ) SERIALIZERS
# ===============================================

class CartItemSerializer(serializers.ModelSerializer):
    """
    Serializer for individual items within the cart.
    Shows detailed product information.
    """
    # Use ProductListSerializer to show nested product details
    product = ProductListSerializer(read_only=True)
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    """
    The main serializer for the shopping cart.
    Includes a list of all cart items.
    """
    # 'items' is the related_name from the CartItem model's ForeignKey to Cart
    items = CartItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'created_at']


# ===============================================
#  CART (WRITE) SERIALIZERS
# ===============================================

class AddCartItemSerializer(serializers.ModelSerializer):
    """
    Serializer for ADDING a new item to the cart.
    Only needs product_id and quantity.
    """
    # We accept product_id from the frontend request
    product_id = serializers.UUIDField()

    class Meta:
        model = CartItem
        fields = ['product_id', 'quantity']

    def validate_product_id(self, value):
        """
        Check if the product exists and is active.
        """
        if not Product.objects.filter(pk=value, is_active=True).exists():
            raise serializers.ValidationError("Product does not exist or is inactive.")
        return value

    def save(self, **kwargs):
        cart = self.context['cart']
        product_id = self.validated_data['product_id']
        quantity = self.validated_data['quantity']

        try:
            # If item already exists in the cart, just update the quantity
            cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
            cart_item.quantity += quantity
            # You can add logic here to check if quantity exceeds stock
            cart_item.save()
            self.instance = cart_item
        except CartItem.DoesNotExist:
            # If it's a new item, create a new CartItem instance
            self.instance = CartItem.objects.create(cart=cart, **self.validated_data)
        
        return self.instance

class UpdateCartItemSerializer(serializers.ModelSerializer):
    """
    Serializer for UPDATING the quantity of an existing item in the cart.
    """
    class Meta:
        model = CartItem
        fields = ['quantity']
        extra_kwargs = {
            'quantity': {'min_value': 1} # Quantity must be at least 1
        }


# ===============================================
#  ORDER & ORDER ITEM SERIALIZERS
# ===============================================
# (These are from our previous steps, they should already be here)

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price_at_purchase']
        
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'items', 'status', 'created_at', 'total_amount']
        read_only_fields = ['user', 'total_amount', 'status', 'created_at', 'items']