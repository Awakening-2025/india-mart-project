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
        // Categories
        GET_CATEGORIES: `${API_BASE_URL}/shop/categories/`,

        // Products
        GET_PRODUCTS: `${API_BASE_URL}/shop/products/`,
        CREATE_PRODUCT: `${API_BASE_URL}/shop/products/`, // Same as GET_PRODUCTS for POST
        GET_PRODUCT_DETAIL: (productId) => `${API_BASE_URL}/shop/products/${productId}/`,
        UPDATE_PRODUCT: (productId) => `${API_BASE_URL}/shop/products/${productId}/`,
        DELETE_PRODUCT: (productId) => `${API_BASE_URL}/shop/products/${productId}/`,

        // Custom endpoint for fetching only the logged-in seller's products
        GET_MY_PRODUCTS: `${API_BASE_URL}/shop/products/my-products/`, // <-- NEW
    },

    // ... other endpoints ...
};