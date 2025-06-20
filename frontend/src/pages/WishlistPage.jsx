// src/pages/WishlistPage.jsx
import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Loader2 } from 'lucide-react';

const WishlistPage = () => {
    const { wishlistItems, loading } = useWishlist();

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10" /></div>;

    return (
        <div className="max-w-7xl mx-auto p-8 my-10">
            <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
            {wishlistItems.length === 0 ? (
                <p>Your wishlist is empty.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {wishlistItems.map(item => (
                        <ProductCard key={item.id} product={item.product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;