# backend/apps/seller/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models.functions import Coalesce
from django.db.models.expressions import ExpressionWrapper 
from apps.products.models import Product
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from django.db.models import Sum, Count, F, Value, DecimalField, Q
from apps.orders.models import Order, OrderItem
from apps.orders.serializers import OrderSerializer, OrderItemSerializer # Import serializers

class SellerDashboardStatsAPIView(APIView):
    """
    Provides statistics for the logged-in seller's dashboard.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if request.user.role != 'seller':
            return Response(
                {"error": "You do not have permission to view this data."},
                status=status.HTTP_403_FORBIDDEN
            )

        seller_products = Product.objects.filter(seller=request.user)

        # 1. Total Products
        total_products = seller_products.count()

        # 2. Total Stock Value (THE FIX IS HERE)
        # We wrap the multiplication in an ExpressionWrapper and define the output_field.
        total_stock_value = seller_products.annotate(
            item_value=ExpressionWrapper(
                Coalesce(F('price'), Value(0)) * Coalesce(F('stock'), Value(0)),
                output_field=DecimalField() # <-- Tell Django the result is a Decimal
            )
        ).aggregate(
            total_value=Sum('item_value')
        )['total_value'] or 0

        # 3. Number of Active vs Inactive products
        active_products_count = seller_products.filter(is_active=True).count()
        
        # 4. Top 5 Products by Stock
        top_products_by_stock = seller_products.order_by('-stock')[:5].values('name', 'stock')

        # 5. Number of categories
        categories_count = seller_products.values('category').distinct().count()

        stats = {
            "total_products": total_products,
            "total_stock_value": round(float(total_stock_value), 2), # Convert Decimal to float for JSON
            "active_products_count": active_products_count,
            "categories_count": categories_count,
            "top_products_by_stock": list(top_products_by_stock),
        }

        return Response(stats, status=status.HTTP_200_OK)





# --- NEW VIEWSET FOR SELLER ORDER MANAGEMENT ---
class SellerOrderViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for sellers to view and manage orders containing their products.
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Return a list of orders that contain at least one product
        sold by the currently authenticated seller.
        """
        user = self.request.user
        if user.role != 'seller':
            return Order.objects.none() # Return empty queryset if not a seller

        # Find all orders that have an order_item whose product's seller is the current user.
        # `Q` objects allow for complex queries.
        # `distinct()` ensures that if an order has multiple products from the same seller,
        # it only appears once in the list.
        return Order.objects.filter(
            Q(items__product__seller=user)
        ).distinct().order_by('-created_at')

    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        """
        Allows a seller to update the status of an order.
        Expects: { "status": "Shipped" }
        """
        try:
            order = self.get_object()
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        # Validate that the new status is a valid choice
        valid_statuses = [choice[0] for choice in Order.STATUS_CHOICES]
        if not new_status or new_status not in valid_statuses:
            return Response(
                {"error": f"Invalid status. Choose from: {', '.join(valid_statuses)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = new_status
        order.save(update_fields=['status'])
        
        # Here you could trigger an email notification to the buyer.
        
        return Response(self.get_serializer(order).data, status=status.HTTP_200_OK)