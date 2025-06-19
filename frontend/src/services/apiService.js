// src/services/apiService.js
import axios from 'axios';
import { API_ENDPOINTS } from '../config/apiConfig';

// Central Axios instance
const api = axios.create({
    headers: { 'Content-Type': 'application/json' },
});

// Interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- Authentication Service (UPDATED) ---
export const authService = {
    signup: (userData) => api.post(API_ENDPOINTS.AUTH.SIGNUP, userData),
    login: (credentials) => api.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
    // a-- IS LINE KO ADD KAREIN ---
    logout: (refreshToken) => api.post(API_ENDPOINTS.AUTH.LOGOUT, { refresh_token: refreshToken }),
};

// --- Product Service ---
export const productService = {
    getProducts: () => api.get(API_ENDPOINTS.SHOP.GET_PRODUCTS),
    getProductById: (productId) => api.get(API_ENDPOINTS.SHOP.GET_PRODUCT_DETAIL(productId)),
    createProduct: (productDataAsFormData) => {
        return api.post(API_ENDPOINTS.SHOP.CREATE_PRODUCT, productDataAsFormData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    getMyProducts: () => api.get(API_ENDPOINTS.SHOP.GET_MY_PRODUCTS),
    deleteProduct: (productId) => api.delete(API_ENDPOINTS.SHOP.DELETE_PRODUCT(productId)),
    updateProduct: (productId, productData) => {
        return api.patch(API_ENDPOINTS.SHOP.UPDATE_PRODUCT(productId), productData);
    }
};

// --- NEW CART SERVICE ---
export const cartService = {
    getCart: () => api.get(API_ENDPOINTS.SALES.GET_CART),
    addToCart: (productId, quantity) => api.post(API_ENDPOINTS.SALES.ADD_TO_CART, { product_id: productId, quantity }),
    removeFromCart: (itemId) => api.delete(API_ENDPOINTS.SALES.REMOVE_FROM_CART(itemId)),
    // updateCartItem function can be added here as well
};
// --- Category Service ---
export const categoryService = {
    getCategories: () => api.get(API_ENDPOINTS.SHOP.GET_CATEGORIES),
};

export const orderService = {
    // This function will trigger the checkout process on the backend
    createOrder: () => api.post(API_ENDPOINTS.SALES.CREATE_ORDER),

    // This function will fetch the user's order history
    getMyOrders: () => api.get(API_ENDPOINTS.SALES.GET_ORDERS),
};