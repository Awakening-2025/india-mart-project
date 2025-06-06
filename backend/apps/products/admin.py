from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('custom_id', 'name', 'price', 'stock', 'created_at', 'created_by')
