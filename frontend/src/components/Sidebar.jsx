// src/components/Sidebar.jsx

import React from 'react';

const Sidebar = ({ categories, filters, setFilters }) => {

  // Pass the entire category object on change
  const handleCategoryChange = (category) => {
    // If 'All Categories' is clicked, category will be null
    setFilters(prev => ({
      ...prev,
      category: category ? category.name : '', // Update filter with name
      search: '' // Reset search on category change
    }));
  };

  const handlePriceChange = (min, max) => {
    setFilters(prev => ({ ...prev, min_price: min, max_price: max }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: '', category: '', min_price: '', max_price: '', ordering: '-created_at',
    });
  };

  const priceRanges = [
    { label: 'Any Price', min: '', max: '' },
    { label: 'Under ₹1,000', min: '', max: '1000' },
    { label: '₹1,000 - ₹5,000', min: '1000', max: '5000' },
    { label: '₹5,000 - ₹10,000', min: '5000', max: '10000' },
    { label: 'Above ₹10,000', min: '10000', max: '' },
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button onClick={clearAllFilters} className="text-sm text-blue-600 hover:underline">Clear All</button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <ul>
          <li className="mb-2">
            <button
              onClick={() => handleCategoryChange(null)} // Pass null for 'All Categories'
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${!filters.category ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              All Categories
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id} className="mb-2">
              <button
                onClick={() => handleCategoryChange(category)} // Pass the whole category object
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${filters.category === category.name ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
        <div className="space-y-3">
          {priceRanges.map((range, index) => (
            <div key={index} className="flex items-center">
              <input
                type="radio"
                name="price-range"
                id={`price-${index}`}
                checked={filters.min_price === range.min && filters.max_price === range.max}
                onChange={() => handlePriceChange(range.min, range.max)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor={`price-${index}`} className="ml-3 text-sm text-gray-600">{range.label}</label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;