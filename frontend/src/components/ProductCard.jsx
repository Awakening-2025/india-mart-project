// src/components/ProductCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ShoppingCart, Heart } from 'lucide-react';

// Import the useCart hook to access cart functions
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  // Get the addToCart function from our context
  const { addToCart } = useCart();

  // Determine if the product is in stock based on the 'stock' quantity from the API
  const isInStock = product.stock > 0;

  // Calculate discount percentage from 'price' and 'sale_price' from the API
  const discountPercentage = product.sale_price && product.price
    ? Math.round(((parseFloat(product.price) - parseFloat(product.sale_price)) / parseFloat(product.price)) * 100)
    : 0;

  // Handler for the Add to Cart button
  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent the Link from navigating
    e.stopPropagation(); // Stop the event from bubbling up
    addToCart(product);
  };

  return (
    // The entire card is a link to the product's detail page
    <Link to={`/product/${product.id}`} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group block text-left">

      {/* Product Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'} // Placeholder for missing images
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
            {discountPercentage}% OFF
          </div>
        )}
        <button
          onClick={(e) => { e.preventDefault(); /* Add to wishlist logic */ }}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100"
        >
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Product Info Section */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 h-12 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating Section */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.average_rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            ({product.review_count || 0} reviews)
          </span>
        </div>

        {/* Price Section */}
        <div className="flex items-baseline mb-3">
          <span className="text-2xl font-bold text-gray-900">
            ₹{parseFloat(product.sale_price || product.price).toLocaleString('en-IN')}
          </span>
          {product.sale_price && (
            <span className="ml-2 text-lg text-gray-500 line-through">
              ₹{parseFloat(product.price).toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Stock Status Section */}
        <div className="mb-4">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isInStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isInStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Action Buttons Section */}
        <div className="flex space-x-2">
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </button>
          <button
            onClick={(e) => e.preventDefault()}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
          >
            Contact
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;