# apps/orders/models.py
from django.db import models
from apps.common.models import BaseModel

class Cart(BaseModel):
    # OneToOneField: Har user ka ek hi cart hoga
    user = models.OneToOneField('users.User', on_delete=models.CASCADE, related_name='cart')

    def __str__(self):
        return f"Cart for {self.user.username}"

class CartItem(BaseModel):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

class Order(BaseModel):
    STATUS_CHOICES = (
        ('Pending', 'Pending'), ('Processing', 'Processing'), 
        ('Shipped', 'Shipped'), ('Delivered', 'Delivered'), ('Cancelled', 'Cancelled')
    )
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='orders')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    # Yahan aap shipping/billing address ke liye Foreign Key ya fields add kar sakte hain

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"

class OrderItem(BaseModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('products.Product', on_delete=models.PROTECT) # Product delete na ho agar order ho chuka hai
    quantity = models.PositiveIntegerField()
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in order {self.order.id}"