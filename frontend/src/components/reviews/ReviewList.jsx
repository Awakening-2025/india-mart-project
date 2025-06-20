// src/components/reviews/ReviewList.jsx
import React from 'react';
import { Star } from 'lucide-react';

const ReviewList = ({ reviews }) => {
    if (!reviews || reviews.length === 0) {
        return <p className="text-gray-500">No reviews yet. Be the first to review!</p>;
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">Customer Reviews</h3>
            {reviews.map(review => (
                <div key={review.id} className="border-b pb-4">
                    <div className="flex items-center mb-2">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                        </div>
                        <p className="ml-4 font-semibold">{review.user.first_name || review.user.username}</p>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-2">Reviewed on {new Date(review.created_at).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;