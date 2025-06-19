// src/pages/SellerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/apiService';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const SellerDashboard = () => {
    const [myProducts, setMyProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const fetchMyProducts = React.useCallback(async () => {
        try {
            setLoading(true);
            const response = await productService.getMyProducts();
            setMyProducts(response.data.results || response.data);
        } catch (err) {
            showToast('Failed to fetch your products', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchMyProducts();
    }, [fetchMyProducts]);

    const handleDelete = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
            try {
                await productService.deleteProduct(productId);
                showToast('Product deleted successfully', 'success');
                fetchMyProducts(); // Re-fetch products to update the list
            } catch (error) {
                showToast('Failed to delete product', 'error');
            }
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin w-8 h-8" /></div>;

    return (
        <div className="max-w-4xl mx-auto p-8 my-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">My Products</h1>
                <Link to="/add-product" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add New Product</Link>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {myProducts.length === 0 ? (
                    <p className="p-6 text-center text-gray-500">You haven't added any products yet.</p>
                ) : (
                    myProducts.map(product => (
                        <div key={product.id} className="flex items-center p-4 border-b last:border-b-0 hover:bg-gray-50">
                            <img src={product.image || 'https://via.placeholder.com/60'} alt={product.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                            <div className="flex-grow">
                                <p className="font-semibold">{product.name}</p>
                                <p className="text-sm text-gray-600">Stock: {product.stock} | Price: ₹{product.price}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link to={`/edit-product/${product.id}`} className="text-blue-500 hover:text-blue-700"><Edit size={20} /></Link>
                                <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;