# apps/users/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .models import User
from .serializers import UserSerializer
from ecommerce_api.permissions import IsOwnerOrReadOnly # Ye permission humne pehle banayi thi

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        """
        Assigns permissions based on the action.
        """
        if self.action in ['signup', 'login']:
            self.permission_classes = [AllowAny]
        elif self.action in ['retrieve', 'update', 'partial_update', 'logout', 'change_password']:
            # User must be authenticated and can only modify their own profile.
            self.permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
        elif self.action == 'list':
            # Only admin users can see the list of all users.
            self.permission_classes = [IsAdminUser]
        else:
            # For any other action, user must be authenticated.
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    @action(detail=False, methods=['POST'], url_path='signup')
    def signup(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = RefreshToken.for_user(user)

        return Response({
            'message': "User created successfully. You are now logged in.",
            'data': serializer.data,
            'refresh': str(token),
            'access': str(token.access_token),
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['POST'], url_path='login')
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(email=email, password=password)

        if user is None:
            return Response({'message': "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        
        token = RefreshToken.for_user(user)
        user_data = self.get_serializer(user).data

        return Response({
            'message': "Login successful",
            'refresh': str(token),
            'access': str(token.access_token),
            'user': user_data
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['POST'], permission_classes=[IsAuthenticated], url_path='logout')
    def logout(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': "Logout successful"}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'message': "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=True, methods=['POST'], url_path='change-password')
    def change_password(self, request, pk=None):
        user = self.get_object()
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return Response({'message': "Old password is not correct"}, status=status.HTTP_400_BAD_REQUEST)
            
        user.set_password(new_password)
        user.save()
        return Response({'message': "Password changed successfully"}, status=status.HTTP_200_OK)