from enum import Enum


class SupplierPermission(Enum):
    ADD_PRODUCT = "Can add a product"
    EDIT_PRODUCT = "Can edit own product"
    DELETE_PRODUCT = "Can delete own product"
    VIEW_OWN_PRODUCTS = "Can view own products"
    VIEW_CATEGORIES = "Can view product categories"
    VIEW_INCOMING_ORDERS = "Can view incoming orders from buyers"
    UPDATE_ORDER_STATUS = "Can update status of buyer's order (e.g., shipped)"
    CANCEL_ORDER = "Can cancel an order from buyer"


class BuyerPermission(Enum):
    BROWSE_PRODUCTS = "Can browse and view available products"
    PLACE_ORDER = "Can place a new order"
    CANCEL_OWN_ORDER = "Can cancel own order"
    UPDATE_OWN_ORDER = "Can update or modify own order details"
    VIEW_OWN_ORDERS = "Can view own order history"