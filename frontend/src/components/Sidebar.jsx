import React from 'react';
import { Filter, Star, MapPin } from 'lucide-react';

const Sidebar = ({ selectedCategory, onCategoryChange, categories }) => {
  const priceRanges = [
    { label: "Under ₹1,000", min: 0, max: 1000 },
    { label: "₹1,000 - ₹5,000", min: 1000, max: 5000 },
    { label: "₹5,000 - ₹10,000", min: 5000, max: 10000 },
    { label: "₹10,000 - ₹20,000", min: 10000, max: 20000 },
    { label: "Above ₹20,000", min: 20000, max: Infinity }
  ];

  const locations = [
    "Mumbai, Maharashtra",
    "Delhi, NCR",
    "Bangalore, Karnataka",
    "Chennai, Tamil Nadu",
    "Pune, Maharashtra",
    "Hyderabad, Telangana",
    "Surat, Gujarat",
    "Vadodara, Gujarat"
  ];

  const ratings = [4, 3, 2, 1];

  return (
    <div className="w-80 bg-white shadow-lg rounded-lg p-6 h-fit sticky top-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </h3>
        <button className="text-blue-600 text-sm hover:text-blue-800 transition-colors">
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-900 mb-4">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-900 mb-4">Price Range</h4>
        <div className="space-y-2">
          {priceRanges.map((range, index) => (
            <label key={index} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700 text-sm">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Ratings */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-900 mb-4">Customer Rating</h4>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <label key={rating} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-2 flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-1 text-sm text-gray-600">& above</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          Location
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {locations.map((location, index) => (
            <label key={index} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700 text-sm">{location}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;