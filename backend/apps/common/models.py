# apps/common/models.py
import uuid
from django.db import models

class BaseModel(models.Model):
    # Hum id ke liye UUID use kar sakte hain, jo auto-incrementing integer se behtar hai
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # Ye model database mein table nahi banayega, bas dusre models isko use karenge
        abstract = True