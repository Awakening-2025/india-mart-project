// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';
import ToasterContainer from './components/common/ToasterContainer';
import PrivateRoute from './components/common/PrivateRoute';

// Page Components
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import SellerDashboard from './pages/SellerDashboard';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import CartPage from './pages/CartPage';
// import EditProductPage from './pages/EditProductPage'; // Future page

function App() {
  return (
    // Set up the router for the entire application
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">

        {/* Header is part of the main layout and appears on all pages */}
        <Header />

        {/* The main content area where pages will be rendered */}
        <main className="flex-grow">
          <Routes>
            {/* --- Public Routes (Accessible to everyone) --- */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />

            {/* --- Private Routes (Accessible only to authenticated users with specific roles) --- */}

            {/* SELLER-ONLY ROUTES */}
            <Route
              path="/seller/dashboard"
              element={
                <PrivateRoute roles={['seller']}>
                  <SellerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-product"
              element={
                <PrivateRoute roles={['seller']}>
                  <AddProductPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/edit-product/:productId"
              element={
                <PrivateRoute roles={['seller']}>
                  <EditProductPage />
                </PrivateRoute>
              }
            />


            {/* You can add more routes for buyers or general users here */}
            {/* 
            <Route 
              path="/my-orders" 
              element={
                <PrivateRoute roles={['buyer']}>
                  <MyOrdersPage />
                </PrivateRoute>
              } 
            /> 
            */}

          </Routes>
        </main>

        {/* Footer is also part of the main layout */}
        <Footer />

        {/* ToasterContainer is a global utility that sits on top of everything */}
        <ToasterContainer />
      </div>
    </Router>
  );
}

export default App;