// src/pages/MyOrdersPage.jsx
import React, { useState, useEffect } from 'react';
import { orderService } from '../services/apiService';
import { Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await orderService.getMyOrders();
                setOrders(response.data.results || response.data);
            } catch (error) {
                showToast("Failed to load your orders.", 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [showToast]);

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10" /></div>;

    return (
        <div className="max-w-4xl mx-auto p-8 my-10">
            <h1 className="text-3xl font-bold mb-6">My Orders</h1>
            {orders.length === 0 ? (
                <p>You have not placed any orders yet.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-center border-b pb-4 mb-4">
                                <div>
                                    <p className="font-semibold">Order ID: #{order.id.substring(0, 8)}</p>
                                    <p className="text-sm text-gray-500">
                                        Placed on: {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 text-sm rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="space-y-4">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex items-center">
                                        <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                                        <div>
                                            <p>{item.product.name}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="text-right font-bold mt-4 pt-4 border-t">
                                Total: ₹{parseFloat(order.total_amount).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;