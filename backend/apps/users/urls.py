# apps/users/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

# DefaultRouter viewset ke liye saare zaroori URLs (list, create, retrieve, update, destroy)
# aur custom actions dono ko automatically generate kar deta hai.
router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
    # Router dwara generate kiye gaye saare URLs ko include karein.
    # Ye '/api/v1/auth/' prefix ke neeche aayenge.
    path('', include(router.urls)),
]

# Generated URLs will be like:
# /signup/
# /login/
# /logout/
# / (for listing users - admin only)
# /{user_id}/ (for retrieving/updating/deleting a user)
# /{user_id}/change-password/