# apps/users/models.py
# (No changes needed, this is perfect)

from django.contrib.auth.models import AbstractUser
from django.db import models
from ecommerce_api.roles import Role  # Make sure this import path is correct

class User(AbstractUser):
    # AbstractUser provides: username, first_name, last_name, is_staff, etc.
    
    # We are overriding the default email field to make it unique and mandatory for login
    email = models.EmailField(unique=True) 
    
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    role = models.CharField(max_length=10, choices=Role.CHOICES, default=Role.BUYER)
    address = models.CharField(max_length=255, blank=True, null=True)

    # We will use email for login, so let's set it as the USERNAME_FIELD
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username'] # 'email' and 'password' are required by default.

    def __str__(self):
        return f"{self.email} ({self.role})"