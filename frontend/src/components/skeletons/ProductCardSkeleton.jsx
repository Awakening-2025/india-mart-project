// src/components/skeletons/ProductCardSkeleton.jsx
import React from 'react';
import Skeleton from 'react-loading-skeleton';

const ProductCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Skeleton height={192} /> {/* Corresponds to the image height */}
            <div className="p-4">
                <Skeleton height={20} style={{ marginBottom: '0.5rem' }} />
                <Skeleton height={20} width="80%" />
                <Skeleton height={16} width="60%" style={{ marginTop: '0.75rem' }} />
                <Skeleton height={28} width="40%" style={{ marginTop: '0.75rem' }} />
                <div className="flex space-x-2 mt-4">
                    <Skeleton height={40} containerClassName="flex-1" />
                    <Skeleton height={40} width={80} />
                </div>
            </div>
        </div>
    );
};

export default ProductCardSkeleton;