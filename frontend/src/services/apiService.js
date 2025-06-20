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

// --- Authentication Service ---

export const authService = {
    signup: (userData) => api.post(API_ENDPOINTS.AUTH.SIGNUP, userData),
    login: (credentials) => api.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
    logout: (refreshToken) => api.post(API_ENDPOINTS.AUTH.LOGOUT, { refresh_token: refreshToken }),

    // --- NEW PROFILE FUNCTIONS ---
    getProfile: (userId) => api.get(API_ENDPOINTS.AUTH.GET_USER_PROFILE(userId)),
    // Use PATCH for partial updates, which is more efficient
    updateProfile: (userId, profileData) => api.patch(API_ENDPOINTS.AUTH.UPDATE_USER_PROFILE(userId), profileData),
    changePassword: (userId, passwordData) => api.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD(userId), passwordData),
};
// --- Product Service (UPDATED) ---
export const productService = {
    // --- THIS FUNCTION IS NOW CORRECT ---
    // It now accepts a 'params' object for filtering, searching, and sorting.
    getProducts: (params) => api.get(API_ENDPOINTS.SHOP.GET_PRODUCTS, { params }),

    getProductById: (productId) => api.get(API_ENDPOINTS.SHOP.GET_PRODUCT_DETAIL(productId)),
    createProduct: (productDataAsFormData) => {
        return api.post(API_ENDPOINTS.SHOP.CREATE_PRODUCT, productDataAsFormData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    getMyProducts: () => api.get(API_ENDPOINTS.SHOP.GET_MY_PRODUCTS),
    deleteProduct: (productId) => api.delete(API_ENDPOINTS.SHOP.DELETE_PRODUCT(productId)),
    updateProduct: (productId, productData) => {
        // Use PATCH for partial updates, especially with FormData
        return api.patch(API_ENDPOINTS.SHOP.UPDATE_PRODUCT(productId), productData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }
};

// --- Cart Service ---
export const cartService = {
    getCart: () => api.get(API_ENDPOINTS.SALES.GET_CART),
    addToCart: (productId, quantity) => api.post(API_ENDPOINTS.SALES.ADD_TO_CART, { product_id: productId, quantity }),
    removeFromCart: (itemId) => api.delete(API_ENDPOINTS.SALES.REMOVE_FROM_CART(itemId)),
};

// --- Category Service ---
export const categoryService = {
    getCategories: () => api.get(API_ENDPOINTS.SHOP.GET_CATEGORIES),
};

// --- Review Service ---
export const reviewService = {
    getReviewsForProduct: (productId) => api.get(API_ENDPOINTS.SHOP.GET_REVIEWS(productId)),
    createReview: (productId, reviewData) => api.post(API_ENDPOINTS.SHOP.CREATE_REVIEW(productId), reviewData),
};

// --- Order Service ---
export const orderService = {
    createOrder: () => api.post(API_ENDPOINTS.SALES.CREATE_ORDER),
    getMyOrders: () => api.get(API_ENDPOINTS.SALES.GET_ORDERS),
};
// --- NEW SELLER SERVICE ---
export const sellerService = {
    getDashboardStats: () => api.get(API_ENDPOINTS.SELLER.GET_DASHBOARD_STATS),
    getSellerOrders: () => api.get(API_ENDPOINTS.SELLER.GET_SELLER_ORDERS),
    updateOrderStatus: (orderId, status) => api.patch(API_ENDPOINTS.SELLER.UPDATE_ORDER_STATUS(orderId), { status }),
};


// --- NEW WISHLIST SERVICE ---
export const wishlistService = {
    getWishlist: () => api.get(API_ENDPOINTS.WISHLIST.GET_WISHLIST),
    addToWishlist: (productId) => api.post(API_ENDPOINTS.WISHLIST.ADD_TO_WISHLIST, { product: productId }),
    removeFromWishlist: (itemId) => api.delete(API_ENDPOINTS.WISHLIST.REMOVE_FROM_WISHLIST(itemId)),
};

