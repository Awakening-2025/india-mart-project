# ecommerce_api/permissions.py

from rest_framework.permissions import BasePermission, SAFE_METHODS
from .roles import Role
from apps.users.models import User

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
    Assumes the model instance has a `user` or `seller` attribute,
    OR the object itself is a User instance.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in SAFE_METHODS:
            return True

        # --- THE FIX IS HERE ---
        # If the object being checked is a User object,
        # check if it's the same as the user making the request.
        if isinstance(obj, User):
            return obj == request.user

        # Existing checks for other models like Product, Review, Order etc.
        if hasattr(obj, 'seller'):
            return obj.seller == request.user
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        return False
