// src/components/Header.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, MapPin, Phone, Mail, LogOut, Package } from 'lucide-react';

// Custom Hooks
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Import useCart

// Child Components
import AuthForm from './auth/AuthForm';

const Header = () => {
  // --- CONTEXT & HOOKS ---
  const { user, isAuthenticated, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const { getTotalItems } = useCart(); // Get getTotalItems from CartContext
  const navigate = useNavigate();

  // --- COMPONENT STATE ---
  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isSticky, setIsSticky] = useState(false);

  const headerPlaceholderHeight = useRef(0);
  const topBarRef = useRef(null);
  const mainHeaderRef = useRef(null);

  // --- EFFECTS ---
  // Effect for handling sticky header logic
  useEffect(() => {
    const mainHeader = mainHeaderRef.current;
    if (!mainHeader) return;

    headerPlaceholderHeight.current = mainHeader.offsetHeight;

    const handleScroll = () => {
      const topBarHeight = topBarRef.current ? topBarRef.current.offsetHeight : 0;
      setIsSticky(window.scrollY > topBarHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- HANDLER FUNCTIONS ---
  const handleOpenLoginModal = () => {
    setIsLoginMode(true);
    setIsAuthFormOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to the home page (or a dedicated search page) with the search query
      // This will trigger the useEffect in HomePage to re-fetch products
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    } else {
      // If search is empty, go to home page without search query
      navigate('/');
    }
  };


  const closeAuthModal = () => setIsAuthFormOpen(false);

  return (
    <>
      <div className="header-container">
        {/* Top Bar Section */}
        <div ref={topBarRef} className="bg-gray-800 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-1"><Phone className="w-4 h-4" /><span>+91 98765 43210</span></div>
                <div className="flex items-center space-x-1"><Mail className="w-4 h-4" /><span>support@tradehub.com</span></div>
              </div>
              <div className="flex items-center space-x-4">
                <span>Welcome to Awakening Coins</span>
                {(!isAuthenticated || user?.role !== 'seller') && (
                  <button onClick={handleOpenLoginModal} className="hover:text-blue-300 transition-colors">Sell on Awakening Coins</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Header Section */}
        <header ref={mainHeaderRef} className={`bg-white shadow-lg border-b-2 border-blue-600 transition-all duration-300 ${isSticky ? 'sticky-header' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link to="/" className="flex items-center">
                <div className="bg-blue-600 text-white p-2 rounded-lg"><div className="w-8 h-8 flex items-center justify-center font-bold text-lg">AC</div></div>
                <div className="ml-3"><h1 className="text-2xl font-bold text-gray-900">Awakening Coins</h1><p className="text-sm text-gray-600">B2B Marketplace</p></div>
              </Link>
              <div className="flex-1 max-w-2xl mx-8">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products, suppliers, categories..."
                    className="w-full px-4 py-3 pl-12 pr-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                  {/* ... (Search Icon) ... */}
                  <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Search
                  </button>
                </form>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors"><MapPin className="w-5 h-5" /><span className="text-sm">Mumbai</span></div>
                {isAuthenticated ? (
                  <>
                    {user?.role === 'seller' && (
                      <Link to="/seller/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600" title="My Products"><Package className="w-6 h-6" /></Link>
                    )}
                    <Link to="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                      <User className="w-6 h-6 text-blue-600" />
                      <span>Hi, {user?.first_name || user?.username}</span>
                    </Link>
                    <button onClick={handleLogout}><LogOut /></button>
                  </>
                ) : (
                  <button onClick={handleOpenLoginModal} className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"><User className="w-6 h-6" /><span>Sign In</span></button>
                )}

                {/* Updated Cart Button */}
                <Link to="/cart" className="relative flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart</span>
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </header>

        {isSticky && <div style={{ height: `${headerPlaceholderHeight.current}px` }} />}
      </div>

      {isAuthFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeAuthModal}>
          <div className="bg-white rounded-lg shadow-2xl relative w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeAuthModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">×</button>
            <AuthForm isLoginMode={isLoginMode} onSwitchMode={() => setIsLoginMode(!isLoginMode)} onSuccess={closeAuthModal} />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;