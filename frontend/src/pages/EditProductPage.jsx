// src/pages/EditProductPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService, categoryService } from '../services/apiService';
import { useToast } from '../context/ToastContext';
import { Loader2 } from 'lucide-react';

const EditProductPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    // --- STATE MANAGEMENT ---
    // formData holds the values for our form fields
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', stock: '', category: '',
    });
    // newImage holds the new file if user selects one
    const [newImage, setNewImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingImageUrl, setExistingImageUrl] = useState('');

    // --- DATA FETCHING ---
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [productRes, categoriesRes] = await Promise.all([
                productService.getProductById(productId),
                categoryService.getCategories(),
            ]);

            const productData = productRes.data;
            setFormData({
                name: productData.name,
                description: productData.description,
                price: productData.price,
                stock: productData.stock,
                category: productData.category.id, // Set the category ID
            });
            setExistingImageUrl(productData.image); // Store existing image URL
            setCategories(categoriesRes.data.results || []);
        } catch (error) {
            showToast('Failed to load product data', 'error');
            navigate('/seller/dashboard');
        } finally {
            setIsLoading(false);
        }
    }, [productId, navigate, showToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- HANDLER FUNCTIONS ---
    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleFileChange = (e) => setNewImage(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // We use FormData for updating, especially if there's a new image
        const productUpdateData = new FormData();
        Object.keys(formData).forEach(key => {
            productUpdateData.append(key, formData[key]);
        });
        if (newImage) {
            productUpdateData.append('image', newImage);
        }

        try {
            // productService mein updateProduct function banana zaroori hai
            await productService.updateProduct(productId, productUpdateData);
            showToast('Product updated successfully!', 'success');
            navigate('/seller/dashboard');
        } catch (error) {
            const errorMsg = error.response?.data?.detail || 'Failed to update product.';
            showToast(errorMsg, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- RENDER LOGIC ---
    if (isLoading) {
        return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10 text-blue-600" /></div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white my-10 rounded-lg shadow-xl">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Product</h1>

            {/* Display existing image */}
            {existingImageUrl && (
                <div className="mb-6">
                    <p className="block text-sm font-medium text-gray-700 mb-2">Current Image</p>
                    <img src={existingImageUrl} alt="Current product" className="w-32 h-32 object-cover rounded-md" />
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" id="description" rows="3" required value={formData.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₹)</label>
                        <input type="number" step="0.01" name="price" id="price" required value={formData.price} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                        <input type="number" name="stock" id="stock" required value={formData.stock} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <select name="category" id="category" required value={formData.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white">
                        <option value="">Select a category</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Upload New Image (Optional)</label>
                    <input type="file" name="image" id="image" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default EditProductPage;