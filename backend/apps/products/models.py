# apps/products/models.py
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.common.models import BaseModel # Hamara BaseModel import karein

class Category(BaseModel): # BaseModel se inherit karein
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    
    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name

class Product(BaseModel): # BaseModel se inherit karein
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Cross-app ForeignKey (Product app se Category app ko link karna)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    
    # Product ko User (Seller) se link karna. 'users.User' likhna zaroori hai
    seller = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='products')
    
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
        
    @property
    def discount_percent(self):
        if self.sale_price and self.price > self.sale_price:
            return int(((self.price - self.sale_price) / self.price) * 100)
        return 0

    @property
    def average_rating(self):
        # self.reviews.aggregate(models.Avg('rating'))['rating__avg'] or 0
        reviews = self.reviews.all()
        if not reviews:
            return 0
        return sum(r.rating for r in reviews) / len(reviews)
    
    @property
    def review_count(self):
        return self.reviews.count()

class Review(BaseModel): # BaseModel se inherit karein
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('product', 'user')

    def __str__(self):
        return f'{self.rating} stars for {self.product.name}'