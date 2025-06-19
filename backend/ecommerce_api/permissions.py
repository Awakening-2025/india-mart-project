# ecommerce_api/permissions.py

from rest_framework.permissions import BasePermission, SAFE_METHODS
from .roles import Role

class IsSeller(BasePermission):
    """
    Allows access only to users with the 'seller' role.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == Role.SELLER)

class IsBuyer(BasePermission):
    """
    Allows access only to users with the 'buyer' role.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == Role.BUYER)

class IsOwnerOrReadOnly(BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has a `user` or `seller` attribute.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the object.
        # Check for 'seller' attribute (for Product) or 'user' attribute (for Review, Order etc.)
        if hasattr(obj, 'seller'):
            return obj.seller == request.user
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        return False