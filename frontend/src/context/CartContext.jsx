// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { cartService } from '../services/apiService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null); // Will hold the entire cart object from backend
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) {
            setCart(null); // Clear cart if user logs out
            return;
        }
        setLoading(true);
        try {
            const response = await cartService.getCart();
            setCart(response.data);
        } catch (error) {
            console.error("Failed to fetch cart", error);
            // Don't show toast on initial load failure
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    // Fetch cart when user logs in or on initial app load
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (product) => {
        if (!isAuthenticated) {
            showToast('Please log in to add items to your cart.', 'info');
            // Here you could trigger the login modal
            return;
        }
        try {
            const response = await cartService.addToCart(product.id, 1);
            setCart(response.data); // Update cart state with response from backend
            showToast(`'${product.name}' added to cart!`, 'success');
        } catch (error) {
            showToast('Could not add item to cart.', 'error');
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            await cartService.removeFromCart(itemId);
            showToast('Item removed from cart.', 'info');
            fetchCart(); // Re-fetch the cart to update the state
        } catch (error) {
            showToast('Could not remove item from cart.', 'error');
        }
    };

    const getTotalItems = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => total + item.quantity, 0);
    };

    const getCartTotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => {
            const price = parseFloat(item.product.sale_price || item.product.price);
            return total + price * item.quantity;
        }, 0);
    };

    const value = {
        cart,
        cartItems: cart?.items || [],
        loading,
        fetchCart,
        addToCart,
        removeFromCart,
        getTotalItems,
        getCartTotal,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};