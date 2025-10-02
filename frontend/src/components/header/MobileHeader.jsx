import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShoppingCart } from 'react-icons/fi';

function MobileHeader({ title, cartOpen, setCartOpen }) {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between bg-violet-600 px-4 py-3 text-white shadow sm:hidden">
            <button onClick={() => navigate(-1)} className="flex items-center">
                <FiArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-medium">{title}</h1>
            <button onClick={() => setCartOpen(true)}>
                <FiShoppingCart size={20} />
            </button>
        </div>
    );
}

export default MobileHeader;
