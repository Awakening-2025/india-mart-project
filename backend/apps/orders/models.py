from django.db import models
from apps.common.models import AbstractBaseModel
from apps.common.utils import generate_custom_id
from apps.products.models import Product
from apps.users.models import User
class Order(AbstractBaseModel):
    order_id = models.CharField(max_length=20, unique=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    ordered_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered')
    ])

    def save(self, *args, **kwargs):
        if not self.order_id:
            self.order_id = generate_custom_id('ORD', Order)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.order_id