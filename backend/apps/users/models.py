# users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.common.models import AbstractBaseModel  

class User(AbstractUser, AbstractBaseModel):
    CUSTOM_ID_PREFIX = 'USR'
    ROLE_CHOICES = [
       ('buyer', 'Buyer'),
       ('supplier', 'Supplier'),
    ]
    
    phone_number = models.CharField(max_length=15, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    email = models.EmailField(unique=True)
    address = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"
    
    def save(self, *args, **kwargs):
        if not self.custom_id:
            prefix_map = {
                'customer': 'CUS',
                'employee': 'EMP',
                'manufacturer': 'MAN',
                'admin': 'ADM',
            }
            self.CUSTOM_ID_PREFIX = prefix_map.get(self.role, 'USR')
        super().save(*args, **kwargs)
