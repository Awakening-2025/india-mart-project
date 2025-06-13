import React from 'react';
import { Search, ShoppingCart, User, MapPin, Phone, Mail } from 'lucide-react';

// We pass isSticky, topBarRef, and mainHeaderRef as props from App.jsx
const Header = ({ cartItemsCount, onSignInClick, isSticky, topBarRef, mainHeaderRef }) => {
  return (
    <>
      {/* Top Bar - We attach a ref to it to measure its height */}
      <div ref={topBarRef} className="bg-gray-800 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>support@tradehub.com</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span>Welcome to Awakening Coins</span>
              <button className="hover:text-blue-300 transition-colors">Sell on Awakening Coins</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - We attach a ref and conditionally add the 'sticky-header' class */}
      <header
        ref={mainHeaderRef}
        className={`bg-white shadow-lg border-b-2 border-blue-600 transition-all duration-300 ${isSticky ? 'sticky-header' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <div className="w-8 h-8 flex items-center justify-center font-bold text-lg">
                  AC
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-900">Awakening Coins</h1>
                <p className="text-sm text-gray-600">B2B Marketplace</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products, suppliers, categories..."
                  className="w-full px-4 py-3 pl-12 pr-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Search
                </button>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">Mumbai</span>
              </div>

              <button
                onClick={onSignInClick}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors" >
                <User className="w-6 h-6" />
                <span>Sign In</span>
              </button>

              <button className="relative flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="border-t border-gray-200">
            <div className="flex items-center py-3 space-x-8">
              <button className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                All Categories
              </button>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Industrial Equipment</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Electronics</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Textiles</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Healthcare</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Agriculture</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Construction</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Automotive</a>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;