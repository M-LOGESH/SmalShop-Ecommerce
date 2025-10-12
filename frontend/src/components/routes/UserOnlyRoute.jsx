// components/routes/UserOnlyRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../common/Loading';

function UserOnlyRoute({ children, pageType = "default" }) {
    const { user, loading } = useAuth();

    if (loading) return <Loading />;
    
    // Redirect staff users to home page
    if (user?.is_staff) return <Navigate to="/" replace />;
    
    // For non-logged-in users, show custom content based on page type
    if (!user) {
        const getPageContent = () => {
            switch (pageType) {
                case "wishlist":
                    return {
                        image: "/img/emptywishlist.png",
                        message: "Login to view your Wishlist"
                    };
                case "orders":
                    return {
                        image: "/img/emptyorder.png", 
                        message: "Login to view your orders"
                    };
                default:
                    return {
                        image: "/img/emptyorder.png",
                        message: "Login to view this page"
                    };
            }
        };

        const content = getPageContent();
        
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <div className="-mt-30">
                    <img
                        src={content.image}
                        alt="Login required"
                        className="mb-4 h-64 w-64"
                        loading="lazy"
                    />
                    <p className="text-center text-lg font-semibold text-gray-600">
                        {content.message}
                    </p>
                </div>
            </div>
        );
    }

    return children;
}

export default UserOnlyRoute;