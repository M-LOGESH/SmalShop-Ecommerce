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
                        image: "/img/emptywishlist.webp",
                        message: "Login to view your Wishlist"
                    };
                case "orders":
                    return {
                        image: "/img/emptyorder.webp", 
                        message: "Login to view your orders"
                    };
                default:
                    return {
                        image: "/img/emptyorder.webp",
                        message: "Login to view this page"
                    };
            }
        };

        const content = getPageContent();
        
        return (
            <div className="flex h-screen -my-25 lg:my-0 flex-col items-center justify-center p-4 overflow-hidden">
                <div className="flex flex-col items-center justify-center text-center">
                    <img
                        src={content.image}
                        alt="Login required"
                        className="mb-4 h-40 w-40 sm:h-64 sm:w-64 max-w-full object-contain"
                        loading="lazy"
                    />
                    <p className="text-md sm:text-lg font-semibold text-gray-600 px-4">
                        {content.message}
                    </p>
                </div>
            </div>
        );
    }

    return children;
}

export default UserOnlyRoute;