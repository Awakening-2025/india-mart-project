// src/pages/SellerDashboard.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productService, sellerService } from '../services/apiService';
import { Edit, Trash2, Loader2, Package, DollarSign, Tag, CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

// --- Child Components ---
import StatCard from '../components/dashboard/StatCard';
import ProductStockChart from '../components/dashboard/ProductStockChart';

const SellerDashboard = () => {
    // --- STATE MANAGEMENT ---
    const [myProducts, setMyProducts] = useState([]);
    const [stats, setStats] = useState(null); // Initialize as null to handle loading state properly
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    // --- DATA FETCHING ---
    const fetchData = useCallback(async () => {
        // Don't set loading to true here if we want to refetch silently
        try {
            // Fetch both products and stats concurrently for better performance
            const [productsRes, statsRes] = await Promise.all([
                productService.getMyProducts(),
                sellerService.getDashboardStats(), // Ensure this function exists in apiService.js
            ]);

            // Handle paginated or non-paginated responses gracefully
            setMyProducts(productsRes.data.results || productsRes.data || []);
            setStats(statsRes.data);

        } catch (err) {
            showToast('Failed to load dashboard data. Please refresh the page.', 'error');
            console.error("Dashboard Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    // Fetch data when the component mounts
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- HANDLERS ---
    const handleDelete = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
            try {
                await productService.deleteProduct(productId);
                showToast('Product deleted successfully', 'success');
                // Refetch all data to update stats and the product list
                setLoading(true); // Show loader while refetching
                fetchData();
            } catch (error) {
                showToast('Failed to delete product', 'error');
            }
        }
    };

    // --- RENDER LOGIC ---
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 my-10">
            {/* --- Page Header --- */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
                <div className="flex gap-4">
                    <Link to="/seller/orders" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Manage Orders</Link>
                    <Link to="/add-product" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add New Product</Link>
                </div>
            </div>

            {/* --- Stats Section --- */}
            {stats ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard title="Total Products" value={stats.total_products} icon={<Package size={24} />} />
                        <StatCard title="Total Stock Value" value={`₹${stats.total_stock_value?.toLocaleString('en-IN') || '0'}`} icon={<DollarSign size={24} />} colorClass="text-green-600" />
                        <StatCard title="Active Listings" value={stats.active_products_count} icon={<CheckCircle size={24} />} colorClass="text-teal-600" />
                        <StatCard title="Categories" value={stats.categories_count} icon={<Tag size={24} />} colorClass="text-purple-600" />
                    </div>

                    {/* --- Chart Section --- */}
                    {stats.top_products_by_stock && stats.top_products_by_stock.length > 0 && (
                        <div className="mb-8">
                            <ProductStockChart chartData={stats.top_products_by_stock} />
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center p-10 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500">Could not load dashboard statistics.</p>
                </div>
            )}


            {/* --- Product List Section --- */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">My Products</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {myProducts.length === 0 ? (
                    <p className="p-6 text-center text-gray-500">You haven't added any products yet.</p>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {myProducts.map(product => (
                            <div key={product.id} className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                                <img
                                    src={product.image || 'https://via.placeholder.com/80x80?text=No+Img'}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded-md mr-4"
                                />
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-800">{product.name}</p>
                                    <p className="text-sm text-gray-600">Stock: {product.stock} | Price: ₹{parseFloat(product.price).toLocaleString('en-IN')}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Link to={`/edit-product/${product.id}`} className="text-blue-500 hover:text-blue-700" title="Edit Product">
                                        <Edit size={20} />
                                    </Link>
                                    <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700" title="Delete Product">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;