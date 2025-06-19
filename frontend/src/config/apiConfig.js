// src/config/apiConfig.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
    // --- Authentication Endpoints ---
    AUTH: {
        SIGNUP: `${API_BASE_URL}/auth/signup/`,
        LOGIN: `${API_BASE_URL}/auth/login/`,
        LOGOUT: `${API_BASE_URL}/auth/logout/`,
        GET_USER_PROFILE: (userId) => `${API_BASE_URL}/auth/${userId}/`,
    },

    // --- Shop/Product Endpoints ---
    SHOP: {
        GET_CATEGORIES: `${API_BASE_URL}/shop/categories/`,
        GET_PRODUCTS: `${API_BASE_URL}/shop/products/`,
        CREATE_PRODUCT: `${API_BASE_URL}/shop/products/`,
        GET_PRODUCT_DETAIL: (productId) => `${API_BASE_URL}/shop/products/${productId}/`,
        UPDATE_PRODUCT: (productId) => `${API_BASE_URL}/shop/products/${productId}/`,
        DELETE_PRODUCT: (productId) => `${API_BASE_URL}/shop/products/${productId}/`,
        GET_MY_PRODUCTS: `${API_BASE_URL}/shop/products/my-products/`,
    },

    // --- SALES (CART & ORDER) ENDPOINTS (THIS WAS MISSING/INCOMPLETE) ---
    SALES: {
        // Cart Endpoints
        GET_CART: `${API_BASE_URL}/sales/cart/`,
        ADD_TO_CART: `${API_BASE_URL}/sales/cart/add-item/`,
        UPDATE_CART_ITEM: (itemId) => `${API_BASE_URL}/sales/cart/update-item/${itemId}/`,
        REMOVE_FROM_CART: (itemId) => `${API_BASE_URL}/sales/cart/remove-item/${itemId}/`,

        // Order Endpoints
        GET_ORDERS: `${API_BASE_URL}/sales/orders/`,
        CREATE_ORDER: `${API_BASE_URL}/sales/orders/`,
        GET_ORDER_DETAIL: (orderId) => `${API_BASE_URL}/sales/orders/${orderId}/`,
    },
};