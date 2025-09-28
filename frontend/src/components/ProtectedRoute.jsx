import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, adminOnly = false }) {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/" replace />;

    // Block access if adminOnly is true and user is not admin
    if (adminOnly && !user.is_staff) return <Navigate to="/" replace />;

    return children;
}

export default ProtectedRoute;
