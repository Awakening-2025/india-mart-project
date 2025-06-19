// src/pages/CartPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2 } from 'lucide-react';

const CartPage = () => {
    const { cartItems, removeFromCart, getCartTotal } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="text-center p-20">
                <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
                <Link to="/" className="text-blue-600 hover:underline">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-8 my-10">
            <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
            <div className="bg-white shadow-md rounded-lg">
                {cartItems.map(item => (
                    <div key={item.id} className="flex items-center p-4 border-b">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4"/>
                        <div className="flex-grow">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold">₹{(item.sale_price || item.price) * item.quantity}</p>
                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 mt-1">
                                <Trash2 size={18}/>
                            </button>
                        </div>
                    </div>
                ))}
                <div className="p-4 flex justify-between items-center font-bold text-xl">
                    <span>Total</span>
                    <span>₹{getCartTotal().toLocaleString()}</span>
                </div>
            </div>
            <div className="text-right mt-6">
                <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">Proceed to Checkout</button>
            </div>
        </div>
    );
};

export default CartPage;