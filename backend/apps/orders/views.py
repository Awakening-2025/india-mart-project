# backend/apps/orders/views.py

from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Cart, CartItem, Order, OrderItem
from .serializers import (
    CartSerializer, 
    AddCartItemSerializer, 
    UpdateCartItemSerializer,
    OrderSerializer # Make sure OrderSerializer is imported
)
from apps.products.models import Product

# ===============================================
#  CART VIEWSET
# ===============================================
class CartViewSet(viewsets.ViewSet):
    """
    A ViewSet for viewing and managing the user's shopping cart.
    Accessible at `/api/v1/sales/cart/`.
    """
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='add-item')
    def add_item(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = AddCartItemSerializer(data=request.data, context={'cart': cart})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            # Return the updated cart state
            return Response(CartSerializer(cart, context={'request': request}).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['patch'], url_path='update-item/(?P<item_pk>[^/.]+)')
    def update_item(self, request, item_pk=None):
        try:
            cart_item = CartItem.objects.get(pk=item_pk, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UpdateCartItemSerializer(cart_item, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(CartSerializer(cart_item.cart, context={'request': request}).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'], url_path='remove-item/(?P<item_pk>[^/.]+)')
    def remove_item(self, request, item_pk=None):
        try:
            cart_item = CartItem.objects.get(pk=item_pk, cart__user=request.user)
            cart_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found.'}, status=status.HTTP_404_NOT_FOUND)


# ===============================================
#  ORDER VIEWSET (THIS WAS MISSING)
# ===============================================
class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Orders.
    - Users can only view their own orders.
    - Buyers can create orders (checkout).
    - Orders cannot be modified or deleted by users after creation.
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    # We only allow GET (list, retrieve) and POST (create)
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        """
        This view should return a list of all the purchases
        for the currently authenticated user.
        """
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        """
        This is the checkout logic.
        Convert cart items to order items and clear the cart.
        """
        # This is a simplified version. A real checkout would involve
        # payment processing, address validation, etc.
        cart = Cart.objects.get(user=self.request.user)
        cart_items = cart.items.all()

        if not cart_items:
            raise serializers.ValidationError("Your cart is empty.")

        # Calculate total amount
        total_amount = sum(
            (item.product.sale_price or item.product.price) * item.quantity for item in cart_items
        )

        # Create the order
        order = serializer.save(user=self.request.user, total_amount=total_amount)

        # Create order items from cart items
        order_items_to_create = []
        for item in cart_items:
            order_items_to_create.append(
                OrderItem(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price_at_purchase=(item.product.sale_price or item.product.price)
                )
            )
            # You might want to decrease product stock here
            # item.product.stock -= item.quantity
            # item.product.save()

        OrderItem.objects.bulk_create(order_items_to_create)

        # Clear the cart
        cart.items.all().delete()