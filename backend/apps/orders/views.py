# apps/orders/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Cart, CartItem, Order
from .serializers import CartSerializer, CartItemSerializer, OrderSerializer
from ecommerce_api.permissions import IsBuyer

class CartItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Cart Items.
    Users can only manage items in their own cart.
    """
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only see items in their own cart
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return CartItem.objects.filter(cart=cart)

    def perform_create(self, serializer):
        # Automatically associate cart item with the user's cart
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        serializer.save(cart=cart)


class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Orders.
    - Users can only view their own orders.
    - Buyers can create orders.
    - Orders cannot be modified or deleted by users after creation.
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsBuyer]

    http_method_names = ['get', 'post', 'head', 'options'] # Disable PUT, PATCH, DELETE

    def get_queryset(self):
        # Users can only see their own orders
        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # This is where you would put your logic to convert a cart to an order
        cart = self.request.user.cart
        # Business logic: calculate total, clear cart, etc.
        # For simplicity, we'll assume total_amount is sent from frontend.
        serializer.save(user=self.request.user)
        # Clear the cart after creating order
        cart.items.all().delete()