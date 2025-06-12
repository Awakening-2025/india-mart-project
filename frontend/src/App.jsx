// App.jsx - Updated Code

import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import { products, categories } from './data/products';
import { useCart } from './hooks/useCart';
import { Grid3X3, List } from 'lucide-react';
import AuthForm from './components/auth/AuthForm'; // Path check kar lein
import { ToastProvider } from './components/context/ToastContext';
import ToasterContainer from './components/common/ToasterContainer';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');

  // 1. FORM VISIBILITY KE LIYE STATE BANAYEIN
  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false);

  const {
    cartItems,
    addToCart,
    getTotalItems,
  } = useCart();

  // (Aapka baaki ka filtering aur sorting logic yahan same rahega)
  const filteredProducts = selectedCategory === 'All Categories'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popularity':
        return b.reviews - a.reviews;
      default:
        return 0;
    }
  });


  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">

        {/* 2. HEADER KO FUNCTION PASS KAREIN */}
        <Header
          cartItemsCount={getTotalItems()}
          onSignInClick={() => setIsAuthFormOpen(true)} // Jab Sign In click ho, state true karein
        />

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            <Sidebar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
            />
            <div className="flex-1">
              {/* (Aapka baaki ka JSX code yahan same rahega) */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedCategory}</h2>
                    <p className="text-gray-600 text-sm">Showing {sortedProducts.length} results</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="relevance">Sort by Relevance</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Customer Rating</option>
                      <option value="popularity">Popularity</option>
                    </select>
                    <div className="flex border border-gray-300 rounded-md">
                      <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <Grid3X3 className="w-5 h-5" />
                      </button>
                      <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <List className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <Footer />

        {/* 3. CONDITIONALLY AUTHFORM RENDER KAREIN */}
        {isAuthFormOpen && (
          <AuthForm onClose={() => setIsAuthFormOpen(false)} /> // Close function bhi pass karein
        )}
        <ToasterContainer />
      </div>

    </ToastProvider>
  );
}

export default App;