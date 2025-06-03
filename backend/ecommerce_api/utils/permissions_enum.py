from ecommerce_api.utils.permissions import SupplierPermission, BuyerPermission

supplier_default_permission = {
    SupplierPermission.ADD_PRODUCT.name: True,
    SupplierPermission.EDIT_PRODUCT.name: True,
    SupplierPermission.DELETE_PRODUCT.name: True,
    SupplierPermission.CANCEL_ORDER.name: True,
    SupplierPermission.UPDATE_ORDER_STATUS.name: True,
    SupplierPermission.VIEW_CATEGORIES.name: True, 
    SupplierPermission.VIEW_INCOMING_ORDERS.name: True,
    SupplierPermission.VIEW_OWN_PRODUCTS.name: True,
}


buyer_default_permission = {     
    BuyerPermission.BROWSE_PRODUCTS.name: True,
    BuyerPermission.CANCEL_OWN_ORDER.name: True,
    BuyerPermission.PLACE_ORDER.name: True,
    BuyerPermission.UPDATE_OWN_ORDER.name: True,
    BuyerPermission.VIEW_OWN_ORDERS.name: True,
}