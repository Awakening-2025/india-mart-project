// src/components/reviews/ReviewForm.jsx
import React, { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';

const ReviewForm = ({ onSubmit, isLoading }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating > 0) {
            onSubmit({ rating, comment });
            setRating(0);
            setComment('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <div className="flex items-center mb-4">
                {[...Array(5)].map((_, index) => {
                    const starValue = index + 1;
                    return (
                        <Star
                            key={starValue}
                            className={`w-8 h-8 cursor-pointer transition-colors ${starValue <= (hoverRating || rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                            onClick={() => setRating(starValue)}
                            onMouseEnter={() => setHoverRating(starValue)}
                            onMouseLeave={() => setHoverRating(0)}
                        />
                    );
                })}
            </div>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="w-full p-2 border rounded-md"
                rows="4"
            ></textarea>
            <button type="submit" disabled={isLoading || rating === 0} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-gray-400">
                {isLoading ? <Loader2 className="animate-spin" /> : 'Submit Review'}
            </button>
        </form>
    );
};

export default ReviewForm;