from django.db import models
from apps.common.models import AbstractBaseModel
from apps.common.utils import generate_custom_id

class Product(AbstractBaseModel):
    CUSTOM_ID_PREFIX = 'PRD'
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()

    def save(self, *args, **kwargs):
        if not self.product_id:
            self.product_id = generate_custom_id('PRD', Product)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product_id} - {self.name}"