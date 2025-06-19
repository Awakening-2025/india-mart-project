# ecommerce_api/roles.py
class Role:
    BUYER = 'buyer'
    SELLER = 'seller'

    CHOICES = (
        (BUYER, 'Buyer'),
        (SELLER, 'Seller'),
    )