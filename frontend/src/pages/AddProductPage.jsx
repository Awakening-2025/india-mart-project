// src/pages/AddProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService, categoryService } from '../services/apiService';
import { useToast } from '../context/ToastContext';
import { Loader2 } from 'lucide-react';

const AddProductPage = () => {
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', sale_price: '', category: '', stock: '', image: null,
    });
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getCategories();
                setCategories(response.data);
            } catch (error) { showToast('Failed to load categories', 'error'); }
        };
        fetchCategories();
    }, [showToast]);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleFileChange = (e) => setFormData(prev => ({ ...prev, image: e.target.files[0] }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const productData = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key]) productData.append(key, formData[key]);
        });

        try {
            await productService.createProduct(productData);
            showToast('Product added successfully!', 'success');
            navigate('/seller/dashboard');
        } catch (error) {
            showToast(error.response?.data?.detail || 'Failed to add product', 'error');
        } finally { setIsLoading(false); }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white my-10 rounded-lg shadow-xl">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Add a New Product</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input type="text" name="name" id="name" required onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" id="description" rows="3" required onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₹)</label>
                        <input type="number" step="0.01" name="price" id="price" required onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                        <input type="number" name="stock" id="stock" required onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <select name="category" id="category" required onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white">
                        <option value="">Select a category</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Product Image</label>
                    <input type="file" name="image" id="image" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
                <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Add Product'}
                </button>
            </form>
        </div>
    );
};

export default AddProductPage;