// src/components/auth/AuthForm.js - REDESIGNED

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Key, User, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext'


const AuthForm = ({ onClose }) => {
    const { showToast } = useToast();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const switchModeHandler = () => {
        setIsLoginMode(prev => !prev);
        setFormData({ name: '', email: '', password: '' }); // Reset form on switch
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Simulate API call
    const submitHandler = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            if (formData.password !== 'error') {
                // <-- Step 3: Just call it!
                showToast('Welcome back! Logged in successfully.', 'success');
                onClose();
            } else {
                // <-- Step 3: Call it with a different type
                showToast('Login failed. Please check your credentials.', 'error');
            }
        }, 1500);
    };

    // Animation variants
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants = {
        hidden: { y: "-10vh", opacity: 0, scale: 0.95 },
        visible: { y: "0", opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
        exit: { y: "10vh", opacity: 0, scale: 0.95 },
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onClick={onClose}
            >
                <motion.div
                    className="relative w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl"
                    variants={modalVariants}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors">
                        <X className="w-6 h-6" />
                    </button>

                    <div className="text-center">
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
                                <motion.div
                                    key="name-field"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input id="name" name="name" type="text" required placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input id="email-address" name="email" type="email" required placeholder="Email address" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                        </div>

                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input id="password" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                        </div>

                        {isLoginMode && (
                            <div className="flex items-center justify-end">
                                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                    Forgot password?
                                </a>
                            </div>
                        )}

                        <div>
                            <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    isLoginMode ? 'Sign In' : 'Create Account'
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        {isLoginMode ? "Don't have an account?" : 'Already have an account?'}{' '}
                        <button onClick={switchModeHandler} className="font-medium text-blue-600 hover:text-blue-500">
                            {isLoginMode ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AuthForm;