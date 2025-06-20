// src/pages/ProductDetailPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Loader2, ShoppingCart } from 'lucide-react';

// --- Custom Hooks & Services ---
import { productService, reviewService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';

// --- Child Components ---
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewList from '../components/reviews/ReviewList';

const ProductDetailPage = () => {
    // --- Hooks ---
    const { productId } = useParams();
    const { isAuthenticated, user } = useAuth();
    const { showToast } = useToast();
    const { addToCart } = useCart();

    // --- State ---
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submittingReview, setSubmittingReview] = useState(false);

    // --- Data Fetching ---
    const fetchProductAndReviews = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch both product and its reviews concurrently for better performance
            const [productRes, reviewsRes] = await Promise.all([
                productService.getProductById(productId),
                reviewService.getReviewsForProduct(productId)
            ]);
            setProduct(productRes.data);
            setReviews(reviewsRes.data.results || reviewsRes.data);
        } catch (error) {
            showToast('Failed to load product details.', 'error');
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    }, [productId, showToast]);

    useEffect(() => {
        // Fetch data when the component mounts or productId changes
        fetchProductAndReviews();
    }, [fetchProductAndReviews]);

    // --- Handlers ---
    const handleReviewSubmit = async (reviewData) => {
        if (!isAuthenticated) {
            showToast("Please log in to submit a review.", "info");
            return;
        }
        setSubmittingReview(true);
        try {
            await reviewService.createReview(productId, reviewData);
            showToast('Thank you for your review!', 'success');
            // Refresh reviews list after submitting a new one
            await fetchProductAndReviews();
        } catch (error) {
            const errorMsg = error.response?.data?.detail || 'Failed to submit review. You may have already reviewed this product.';
            showToast(errorMsg, 'error');
        } finally {
            setSubmittingReview(false);
        }
    };

    // --- Render Logic ---
    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-12 h-12 animate-spin text-blue-600" /></div>;
    }

    if (!product) {
        return <div className="text-center p-20 text-xl text-gray-600">Product not found.</div>;
    }

    const isInStock = product.stock > 0;

    return (
        <div className="bg-gray-100 py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Product Details Section */}
                <div className="bg-white p-8 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Image Gallery */}
                    <div>
                        <img
                            src={product.image || 'https://via.placeholder.com/500x500?text=No+Image'}
                            alt={product.name}
                            className="w-full h-auto object-cover rounded-lg"
                        />
                    </div>

                    {/* Product Information */}
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                        <div className="flex items-center mb-4">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.average_rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">({product.review_count || 0} reviews)</span>
                        </div>
                        <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

                        <div className="flex items-baseline mb-4">
                            <span className="text-4xl font-bold text-blue-600">₹{parseFloat(product.sale_price || product.price).toLocaleString('en-IN')}</span>
                            {product.sale_price && <span className="ml-3 text-xl text-gray-500 line-through">₹{parseFloat(product.price).toLocaleString('en-IN')}</span>}
                        </div>

                        <div className="mb-6">
                            <span className={`font-semibold ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
                                {isInStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                            </span>
                        </div>

                        <div className="mt-auto pt-6 border-t">
                            <button onClick={() => addToCart(product)} disabled={!isInStock} className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center">
                                <ShoppingCart className="mr-2" />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white p-8 rounded-lg shadow-lg mt-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Review Form on the left */}
                        <div>
                            {isAuthenticated && user?.role === 'buyer' ? (
                                <ReviewForm onSubmit={handleReviewSubmit} isLoading={submittingReview} />
                            ) : (
                                <div className="bg-gray-50 p-6 rounded-lg text-center">
                                    <h3 className="text-lg font-semibold">Want to share your experience?</h3>
                                    <p className="text-gray-600 mt-2">Please log in as a buyer to write a review.</p>
                                </div>
                            )}
                        </div>

                        {/* Review List on the right */}
                        <div>
                            <ReviewList reviews={reviews} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;