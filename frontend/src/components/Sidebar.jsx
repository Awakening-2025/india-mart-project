// src/components/Sidebar.jsx

import React from 'react';

const Sidebar = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <aside className="w-64 flex-shrink-0">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <ul>
          {/* "All Categories" ko pehle render karein */}
          <li className="mb-2">
            <button
              onClick={() => onCategoryChange('All Categories')}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === 'All Categories'
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              All Categories
            </button>
          </li>
          {/* API se aayi baaki categories ko map karein */}
          {categories.map((category) => (
            <li key={category.id} className="mb-2">
              <button
                onClick={() => onCategoryChange(category.name)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === category.name
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Price Range Filter (iska logic baad mein add kiya ja sakta hai) */}
      <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
        {/* ... price filter UI ... */}
      </div>
    </aside>
  );
};

export default Sidebar;