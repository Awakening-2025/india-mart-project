from rolepermissions.roles import AbstractUserRole
from .utils.permissions_enum import *

class Supplier(AbstractUserRole):
    available_permissions = {
        **supplier_default_permission
    }

class Buyer(AbstractUserRole):
    available_permissions = {
        **buyer_default_permission
    }