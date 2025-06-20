// src/pages/SellerOrderManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { sellerService } from '../services/apiService';
import { useToast } from '../context/ToastContext';
import { Loader2, PackageCheck, Truck, ThumbsUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const OrderStatusUpdater = ({ order, onStatusUpdate }) => {
    const [newStatus, setNewStatus] = useState(order.status);
    const [isUpdating, setIsUpdating] = useState(false);
    const { showToast } = useToast();

    const handleUpdate = async () => {
        setIsUpdating(true);
        try {
            const updatedOrder = await sellerService.updateOrderStatus(order.id, newStatus);
            onStatusUpdate(updatedOrder.data);
            showToast('Order status updated!', 'success');
        } catch (error) {
            showToast('Failed to update status.', 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    // Don't allow changing status if it's already Delivered or Cancelled
    if (['Delivered', 'Cancelled'].includes(order.status)) {
        return (
            <span className="font-semibold text-green-600 flex items-center">
                <ThumbsUp size={16} className="mr-1" /> Completed
            </span>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="p-1 border rounded-md"
            >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
            </select>
            <button onClick={handleUpdate} disabled={isUpdating || newStatus === order.status} className="bg-blue-500 text-white px-2 py-1 rounded disabled:bg-gray-400">
                {isUpdating ? <Loader2 size={16} className="animate-spin" /> : 'Update'}
            </button>
        </div>
    );
};

const SellerOrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const { user } = useAuth();

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const response = await sellerService.getSellerOrders();
            setOrders(response.data.results || response.data);
        } catch (error) {
            showToast("Failed to load your orders.", 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleStatusUpdate = (updatedOrder) => {
        setOrders(prevOrders =>
            prevOrders.map(o => o.id === updatedOrder.id ? updatedOrder : o)
        );
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10" /></div>;

    return (
        <div className="max-w-7xl mx-auto p-8 my-10">
            <h1 className="text-3xl font-bold mb-6">Order Management</h1>
            <div className="space-y-6">
                {orders.length === 0 ? (
                    <p>You have no orders yet.</p>
                ) : (
                    orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-center border-b pb-4 mb-4">
                                <div>
                                    <p className="font-semibold">Order ID: #{order.id.substring(0, 8)}</p>
                                    <p className="text-sm text-gray-500">
                                        Placed on: {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-500">Customer: {order.user}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">Total: ₹{parseFloat(order.total_amount).toLocaleString()}</p>
                                    <OrderStatusUpdater order={order} onStatusUpdate={handleStatusUpdate} />
                                </div>
                            </div>
                            <h4 className="font-semibold mb-2">Items in this order from your store:</h4>
                            {order.items
                                .filter(item => item.product.seller?.id === user.id) // Show only this seller's items
                                .map(item => (
                                    <div key={item.id} className="flex items-center text-sm py-1">
                                        <p className="w-1/2">{item.product.name}</p>
                                        <p>Qty: {item.quantity}</p>
                                    </div>
                                ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SellerOrderManagement;