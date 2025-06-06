from django.contrib import admin
from .models import Order

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('custom_id', 'user', 'product', 'quantity', 'status', 'ordered_at', 'created_by')
