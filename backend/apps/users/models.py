# users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.common.models import AbstractBaseModel  

class User(AbstractUser, AbstractBaseModel):
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('employee', 'Employee'),
        ('manufacturer', 'Manufacturer'),
        ('admin', 'Admin'),
    ]

    phone_number = models.CharField(max_length=15, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    email = models.EmailField(unique=True)
    address = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"
