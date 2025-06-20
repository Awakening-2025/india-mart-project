# backend/apps/wishlist/models.py
from django.db import models
from apps.common.models import BaseModel
from django.conf import settings
from apps.products.models import Product

class WishlistItem(BaseModel):
    """
    Represents a single product in a user's wishlist.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wishlist_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='wishlisted_by')

    class Meta:
        # A user can only have a specific product in their wishlist once.
        unique_together = ('user', 'product')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.product.name} in {self.user.username}'s wishlist"