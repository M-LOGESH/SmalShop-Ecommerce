import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiShoppingCart } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';

function MobileHeader({ title, setCartOpen }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    // Check if current page is admin-only or user is admin
    const isAdminPage = location.pathname.startsWith('/admin');
    const shouldShowCart = !user?.is_staff && !isAdminPage;

    return (
        <div className="fixed top-0 left-0 z-50 flex w-full items-center justify-between bg-violet-600 px-4 py-3 text-white shadow sm:hidden">
            <button onClick={() => navigate(-1)} className="flex items-center">
                <FiArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-medium">{title}</h1>
            
            {/* Conditionally render cart icon or empty space */}
            {shouldShowCart ? (
                <button onClick={() => setCartOpen(true)}>
                    <FiShoppingCart size={20} />
                </button>
            ) : (
                <span className="w-5" />
            )}
        </div>
    );
}

export default MobileHeader;