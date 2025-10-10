import React, { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

function WishlistIcon({ productId, size = 16, className = '', showToast = true }) {
    const { user, wishlist, toggleWishlist } = useAuth();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [loading, setLoading] = useState(false);

    // Check if product is in wishlist
    useEffect(() => {
        if (wishlist && Array.isArray(wishlist)) {
            setIsWishlisted(wishlist.includes(productId));
        }
    }, [wishlist, productId]);

    const handleToggleWishlist = async (e) => {
        if (e) e.stopPropagation(); // Prevent event bubbling

        if (!user) {
            if (showToast) toast.error('Login to add to wishlist');
            return;
        }

        if (user?.is_staff) return;

        if (loading) return;

        setLoading(true);

        try {
            await toggleWishlist(productId);
        } catch (err) {
            console.error('Wishlist error:', err);
            if (showToast) toast.error('Error updating wishlist');
        } finally {
            setLoading(false);
        }
    };

    if (user?.is_staff) return null;

    return (
        <button
            onClick={handleToggleWishlist}
            disabled={loading}
            className={`flex items-center justify-center transition-colors ${
                isWishlisted
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-400 hover:text-red-500'
            } ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <FaHeart size={size} className={isWishlisted ? 'fill-current' : ''} />
        </button>
    );
}

export default WishlistIcon;
