// src/pages/CartPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// --- Custom Hooks & Services ---
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/apiService';

// --- UI Components & Icons ---
import { Trash2, Loader2, ShoppingBag } from 'lucide-react';

const CartPage = () => {
    // --- State and Context ---
    const { cartItems, removeFromCart, getCartTotal, loading: cartLoading, fetchCart } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    // --- Handlers ---
    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            await orderService.createOrder();
            showToast('Order placed successfully!', 'success');
            await fetchCart(); // Refresh the cart from the backend (it will be empty)
            navigate('/my-orders'); // Redirect to order history page
        } catch (error) {
            const errorMsg = error.response?.data?.detail || "Checkout failed. Please try again.";
            showToast(errorMsg, 'error');
        } finally {
            setIsCheckingOut(false);
        }
    };

    const handleRemoveItem = async (itemId) => {
        // This is an async function now because it makes an API call
        await removeFromCart(itemId);
    };

    // --- Render Logic ---
    if (cartLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="text-center p-20 max-w-lg mx-auto bg-white my-10 rounded-lg shadow-md">
                <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h1>
                <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 my-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Shopping Cart</h1>
            <div className="bg-white shadow-lg rounded-lg">
                {/* Cart Items List */}
                <div className="divide-y divide-gray-200">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex items-center p-4">
                            <img
                                src={item.product.image || 'https://via.placeholder.com/80'}
                                alt={item.product.name}
                                className="w-20 h-20 object-cover rounded-md mr-4"
                            />
                            <div className="flex-grow">
                                <Link to={`/product/${item.product.id}`} className="font-semibold text-gray-800 hover:text-blue-600">
                                    {item.product.name}
                                </Link>
                                <p className="text-sm text-gray-500">
                                    Quantity: {item.quantity}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-lg text-gray-800">
                                    ₹{((item.product.sale_price || item.product.price) * item.quantity).toLocaleString('en-IN')}
                                </p>
                                <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700 mt-1" title="Remove Item">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cart Summary */}
                <div className="p-4 bg-gray-50 rounded-b-lg">
                    <div className="flex justify-between items-center font-bold text-xl text-gray-800">
                        <span>Total</span>
                        <span>₹{getCartTotal().toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>

            {/* Checkout Button */}
            <div className="flex justify-end mt-6">
                <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut || cartItems.length === 0}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-semibold flex items-center justify-center min-w-[200px]"
                >
                    {isCheckingOut ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        'Proceed to Checkout'
                    )}
                </button>
            </div>
        </div>
    );
};

export default CartPage;