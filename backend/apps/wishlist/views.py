# backend/apps/wishlist/views.py
from rest_framework import viewsets, permissions, mixins
from .models import WishlistItem
from .serializers import WishlistItemSerializer, WishlistCreateSerializer

class WishlistViewSet(
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    """
    ViewSet for managing a user's wishlist.
    - list: Returns all items in the user's wishlist.
    - create: Adds a product to the user's wishlist.
    - destroy: Removes a product from the user's wishlist.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all wishlist items
        for the currently authenticated user.
        """
        return WishlistItem.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return WishlistCreateSerializer
        return WishlistItemSerializer
    
    def perform_create(self, serializer):
        # Automatically associate the wishlist item with the logged-in user.
        serializer.save(user=self.request.user)