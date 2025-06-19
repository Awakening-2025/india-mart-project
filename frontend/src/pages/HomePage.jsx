// src/pages/HomePage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import { productService, categoryService } from '../services/apiService';
import { Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

function HomePage() {
    // --- STATE MANAGEMENT ---
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All Categories');

    const { showToast } = useToast();

    // --- DATA FETCHING ---

    // 1. Fetch categories (sirf ek baar, component load hone par)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const response = await categoryService.getCategories();
                setCategories(response.data);
            } catch (err) {
                showToast('Could not load categories.', 'error');
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, [showToast]);

    // 2. Fetch products (ye tab chalega jab selectedCategory badlegi)
    const fetchProducts = useCallback(async () => {
        try {
            setLoadingProducts(true);

            const params = {};
            // Agar 'All Categories' nahi hai, to hi parameter bhejein
            if (selectedCategory !== 'All Categories') {
                params.category__name = selectedCategory;
            }

            const response = await productService.getProducts(params);
            setProducts(response.data.results || response.data);
        } catch (err) {
            showToast('Could not fetch products.', 'error');
        } finally {
            setLoadingProducts(false);
        }
    }, [selectedCategory, showToast]); // Dependency array

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]); // fetchProducts function ko as a dependency daalein

    // --- RENDER LOGIC ---
    const handleCategoryChange = (categoryName) => {
        setSelectedCategory(categoryName);
    };

    // Sorting logic can be applied here on the `products` state if needed

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-8">

                <Sidebar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                    isLoading={loadingCategories}
                />

                <div className="flex-1">
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">{selectedCategory}</h2>
                        {!loadingProducts && <p className="text-gray-600 text-sm">Showing {products.length} results</p>}
                    </div>

                    {loadingProducts ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-10 bg-white rounded-lg">
                            <p className="text-gray-500">No products found in this category.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomePage;