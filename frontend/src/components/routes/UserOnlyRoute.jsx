import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../common/Loading';

function UserOnlyRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <Loading />;
    if (!user) return <Navigate to="/" replace />;
    if (user.is_staff) return <Navigate to="/" replace />;

    return children;
}

export default UserOnlyRoute;
