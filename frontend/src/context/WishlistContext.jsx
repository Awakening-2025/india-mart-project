// src/context/WishlistContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { wishlistService } from '../services/apiService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    const fetchWishlist = useCallback(async () => {
        if (!isAuthenticated) {
            setWishlistItems([]);
            return;
        }
        setLoading(true);
        try {
            const response = await wishlistService.getWishlist();
            setWishlistItems(response.data.results || response.data);
        } catch (error) {
            console.error("Failed to fetch wishlist", error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const addToWishlist = async (productId) => {
        try {
            await wishlistService.addToWishlist(productId);
            fetchWishlist(); // Refresh list
        } catch (error) {
            console.error("Failed to add to wishlist", error);
        }
    };

    const removeFromWishlist = async (itemId) => {
        try {
            await wishlistService.removeFromWishlist(itemId);
            fetchWishlist(); // Refresh list
        } catch (error) {
            console.error("Failed to remove from wishlist", error);
        }
    };

    const isProductInWishlist = (productId) => {
        return wishlistItems.some(item => item.product.id === productId);
    };

    const getItemIdByProductId = (productId) => {
        const item = wishlistItems.find(item => item.product.id === productId);
        return item ? item.id : null;
    }

    const value = {
        wishlistItems,
        loading,
        addToWishlist,
        removeFromWishlist,
        isProductInWishlist,
        getItemIdByProductId,
    };

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};