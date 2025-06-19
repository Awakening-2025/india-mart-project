// src/context/ToastContext.js

import React, { createContext, useState, useContext, useCallback } from 'react';

// 1. Context Create
const ToastContext = createContext();

// 2. Custom Hook for easy access
export const useToast = () => {
    return useContext(ToastContext);
};

// 3. Provider Component (State manager)
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    // `showToast` function ko useCallback se wrap kiya taaki yeh baar baar re-create na ho.
    const showToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now(); // Unique ID for each toast
        setToasts(prevToasts => [...prevToasts, { id, message, type, duration }]);

        // Automatically remove the toast after its duration
        setTimeout(() => {
            setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
        }, duration);
    }, []);

    // Function to manually remove a toast
    const removeToast = (id) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    };

    const value = { showToast, toasts, removeToast };

    return (
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    );
};