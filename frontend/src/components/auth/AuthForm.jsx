// src/components/auth/AuthForm.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Key, User as UserIcon, Loader2 } from 'lucide-react'; // Renamed User to UserIcon to avoid conflict
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext'; // 1. Import useAuth hook

// 2. Component ab props mein isLoginMode, onSwitchMode, aur onSuccess lega
const AuthForm = ({ isLoginMode, onSwitchMode, onSuccess }) => {
    const { showToast } = useToast();
    const { login, signup } = useAuth(); // 3. Get login and signup functions from context

    const [isLoading, setIsLoading] = useState(false);
    // Renamed 'name' field to 'username' to match our backend User model
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isLoginMode) {
                // Call the login function from AuthContext
                await login({ email: formData.email, password: formData.password });
                showToast('Welcome back!', 'success');
            } else {
                // Call the signup function from AuthContext
                // Note: backend expects 'username', not 'name'
                await signup({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                    // 'role' field is optional, backend defaults to 'buyer'
                });
                showToast('Account created successfully!', 'success');
            }
            onSuccess(); // Call onSuccess to close the modal
        } catch (error) {
            // Handle errors from the API call
            const errorMessage = error.response?.data?.message ||
                (error.response?.data?.email && `Email: ${error.response.data.email[0]}`) ||
                'An unexpected error occurred.';
            showToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Animation variants (No change here)
    const backdropVariants = { /* ... */ };
    const modalVariants = { /* ... */ };

    return (
        // The modal is now handled by the Header component.
        // We only need to return the form content.
        <motion.div
            className="relative w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
        >
            {/* The close button is now in the Header component's modal wrapper */}

            <div className="text-center">
                {/* ... (Your awesome UI, no changes needed here) ... */}
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                    <Key className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                    {isLoginMode ? 'Welcome Back!' : 'Create Your Account'}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    {isLoginMode ? "Sign in to continue to your account." : "Get started with our B2B platform."}
                </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={submitHandler}>
                <AnimatePresence mode="wait">
                    {!isLoginMode && (
                        <motion.div key="name-field" /* ... (no changes) ... */ >
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                {/* Changed name="name" to name="username" */}
                                <input id="username" name="username" type="text" required placeholder="Username" value={formData.username} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ... (Email and Password fields, no changes) ... */}
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input id="email-address" name="email" type="email" required placeholder="Email address" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                </div>
                <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input id="password" name="password" type="password" required placeholder="Password" value={formData.password} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                </div>

                {/* ... (Forgot Password link, no changes) ... */}

                <div>
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />Processing...</>) : (isLoginMode ? 'Sign In' : 'Create Account')}
                    </button>
                </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
                {isLoginMode ? "Don't have an account?" : 'Already have an account?'}{' '}
                {/* 4. Use the onSwitchMode prop to switch between Login/Signup */}
                <button onClick={onSwitchMode} className="font-medium text-blue-600 hover:text-blue-500">
                    {isLoginMode ? 'Sign Up' : 'Sign In'}
                </button>
            </p>
        </motion.div>
    );
};

export default AuthForm;