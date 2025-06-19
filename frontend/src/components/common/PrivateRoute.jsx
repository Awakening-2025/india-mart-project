// src/components/common/PrivateRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const PrivateRoute = ({ children, roles }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-10 h-10 animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location, openLogin: true }} replace />;
    }

    // Role-based access check
    if (roles && !roles.includes(user?.role)) {
        // If user's role is not in the allowed roles, redirect to home
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;