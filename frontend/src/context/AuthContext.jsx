// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('accessToken'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // App load hone par check karein ki user pehle se logged in hai ya nahi
        const storedUser = localStorage.getItem('user');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, [token]);



    const updateUserContext = (newUserData) => {
        setUser(newUserData);
        localStorage.setItem('user', JSON.stringify(newUserData));
    };


    const login = async (credentials) => {
        const response = await authService.login(credentials);
        const { access, refresh, user: userData } = response.data;

        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        localStorage.setItem('user', JSON.stringify(userData));

        setToken(access);
        setUser(userData);
    };

    const signup = async (userData) => {
        const response = await authService.signup(userData);
        const { access, refresh, data: newUserData } = response.data;

        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        localStorage.setItem('user', JSON.stringify(newUserData));

        setToken(access);
        setUser(newUserData);
    };

    const logout = () => {
        // Backend se logout karne ki koshish karein (optional but good practice)
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            authService.logout(refreshToken).catch(err => console.error("Logout failed on server", err));
        }

        // Clear local storage and state
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
    };

    const value = {
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        signup,
        logout,
        updateUserContext,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};