// src/context/CartContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { useToast } from './ToastContext';

// 1. Create the context
const CartContext = createContext();

// 2. Create a custom hook for easy access
export const useCart = () => useContext(CartContext);

// 3. Create the Provider component that will manage the state
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { showToast } = useToast();

    // Function to add a product to the cart
    const addToCart = (productToAdd) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === productToAdd.id);

            if (existingItem) {
                // If item already exists, just increase its quantity
                return prevItems.map(item =>
                    item.id === productToAdd.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            // If it's a new item, add it to the cart with quantity 1
            return [...prevItems, { ...productToAdd, quantity: 1 }];
        });
        showToast(`'${productToAdd.name}' added to cart!`, 'success');
    };

    // Function to remove an item completely from the cart
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
        showToast('Item removed from cart.', 'info');
    };

    // Function to get the total number of items (for the header badge)
    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Function to calculate the total price of the cart
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.sale_price || item.price) * item.quantity, 0);
    };

    // The value that will be available to all children components
    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        getTotalItems,
        getCartTotal,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};