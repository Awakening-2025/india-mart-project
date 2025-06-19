# backend/apps/products/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Category, Product, Review
from .serializers import (
    CategorySerializer, 
    ProductListSerializer, 
    ProductDetailSerializer, 
    ProductWriteSerializer,
    ReviewSerializer
)
from ecommerce_api.permissions import IsSeller, IsOwnerOrReadOnly, IsBuyer # Assuming this path is correct

# ===============================================
#  CATEGORY VIEWSET
# ===============================================
class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for categories.
    - Anyone can view.
    - Only Admins (or authenticated staff) can create/edit.
    """
    queryset = Category.objects.all() # Show all categories for selection
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# ===============================================
#  PRODUCT VIEWSET (UPDATED)
# ===============================================
class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint for products.
    Manages different serializers and permissions based on the request action.
    """
    queryset = Product.objects.filter(is_active=True).select_related('category', 'seller')
    filterset_fields = {
        'category__name': ['exact'],
        'price': ['gte', 'lte']  
    }
    search_fields = ['name', 'description', 'category__name']

    def get_serializer_class(self):
        """
        Dynamically chooses the serializer class based on the action.
        """
        if self.action in ['create', 'update', 'partial_update']:
            return ProductWriteSerializer
        # The 'my_products' action will also use the compact list view.
        elif self.action in ['list', 'my_products']:
            return ProductListSerializer
        return ProductDetailSerializer # Default for 'retrieve'

    def get_permissions(self):
        """
        Assigns permissions based on the action.
        """
        if self.action == 'create':
            self.permission_classes = [permissions.IsAuthenticated, IsSeller]
        elif self.action in ['update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
        # Custom permission for the 'my_products' action.
        elif self.action == 'my_products':
            self.permission_classes = [permissions.IsAuthenticated, IsSeller]
        else: # 'list', 'retrieve'
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()

    def perform_create(self, serializer):
        """
        Automatically set the 'seller' field to the currently logged-in user.
        """
        serializer.save(seller=self.request.user,is_active=True,created_by=self.request.user,updated_by=self.request.user)


    def perform_update(self, serializer):
        """
        Automatically set the 'updated_by' field to the currently logged-in user.
        """
        serializer.save(updated_by=self.request.user)


    # --- NEW CUSTOM ACTION for /my-products/ ---
    @action(detail=False, methods=['GET'], url_path='my-products')
    def my_products(self, request):
        """
        Returns a list of products that belong to the currently authenticated seller.
        This endpoint is protected and only accessible by users with the 'seller' role.
        """
        # Filter the queryset to only include products by the current user.
        # Unlike the main queryset, this one includes inactive products as well,
        # so the seller can see and manage all their listings.
        seller_products = Product.objects.filter(seller=request.user).order_by('-created_at')
        
        # We need to handle pagination to avoid sending huge amounts of data.
        page = self.paginate_queryset(seller_products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        # If pagination is not configured, serialize the entire queryset.
        serializer = self.get_serializer(seller_products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ===============================================
#  REVIEW VIEWSET (Nested under Products)
# ===============================================
class ReviewViewSet(viewsets.ModelViewSet):
    """
    API endpoint for product reviews.
    This is a nested resource under a product.
    """
    serializer_class = ReviewSerializer

    def get_permissions(self):
        """
        - Create: Only Buyers.
        - Update/Delete: Only the owner of the review.
        - List/Retrieve: Anyone.
        """
        if self.action == 'create':
            self.permission_classes = [permissions.IsAuthenticated, IsBuyer]
        elif self.action in ['update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
        else:
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()

    def get_queryset(self):
        """
        This view is nested, so it only shows reviews for the specific
        product identified in the URL.
        """
        product_pk = self.kwargs.get('product_pk')
        if product_pk:
            return Review.objects.filter(product_id=product_pk)
        return Review.objects.none() # Return empty if no product_pk

    def perform_create(self, serializer):
        """
        Automatically associate the review with the product from the URL
        and the currently logged-in user.
        """
        product_pk = self.kwargs.get('product_pk')
        product = Product.objects.get(pk=product_pk)
        serializer.save(user=self.request.user, product=product)