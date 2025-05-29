from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

class CustomUserAdmin(BaseUserAdmin):
    model = User
    list_display = ('username', 'email', 'role', 'is_active', 'is_staff', 'created_at', 'updated_at')
    list_filter = ('role', 'is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'phone_number', 'address')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')}),
        ('Tracking', {'fields': ('created_by', 'updated_by')}),
    )
    search_fields = ('username', 'email', 'phone_number')
    ordering = ('id',)

admin.site.register(User, CustomUserAdmin)
