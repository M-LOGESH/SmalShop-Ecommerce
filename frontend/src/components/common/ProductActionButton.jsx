import React from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

export default function ProductActionButton({
    product,
    cartItem,
    addToCart,
    updateCartQuantity,
    size = 'normal',
    className = '',
}) {
    const { user, updatingItems } = useAuth();

    const baseBtn = size === 'small' ? 'px-2 py-1 text-xs gap-2 max-w-21' : 'px-2 py-1 text-sm';
    const isUpdating = cartItem && updatingItems.has(cartItem.id);

    if (user?.is_staff) {
        return (
            <button
                disabled
                className={`w-full cursor-not-allowed rounded bg-gray-400 font-semibold text-white ${baseBtn} ${className}`}
            >
                Staff View
            </button>
        );
    }

    // Out of stock
    if (product.stock_status === 'out_of_stock') {
        return (
            <button
                disabled
                className={`w-full cursor-not-allowed rounded bg-gray-400 font-semibold text-white ${baseBtn} ${className}`}
            >
                Out of Stock
            </button>
        );
    }

    // Already in cart
    if (cartItem) {
        return (
            <div
                className={`flex items-center justify-between rounded font-bold text-white ${
                    isUpdating ? 'bg-violet-700 cursor-wait' : 'bg-violet-900'
                } ${baseBtn} ${className}`}
            >
                <button
                    onClick={() => !isUpdating && updateCartQuantity(cartItem.id, cartItem.quantity - 1)}
                    disabled={isUpdating}
                    className={`flex items-center justify-center px-2 ${
                        isUpdating ? 'cursor-wait opacity-70' : ''
                    }`}
                >
                    {isUpdating ? (
                        <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent"></div>
                    ) : (
                        <FaMinus size={size === 'small' ? 10 : 12} />
                    )}
                </button>
                <span className={`px-1 ${isUpdating ? 'opacity-70' : ''}`}>
                    {cartItem.quantity}
                </span>
                <button
                    onClick={() => !isUpdating && updateCartQuantity(cartItem.id, cartItem.quantity + 1)}
                    disabled={isUpdating}
                    className={`flex items-center justify-center px-2 ${
                        isUpdating ? 'cursor-wait opacity-70' : ''
                    }`}
                >
                    {isUpdating ? (
                        <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent"></div>
                    ) : (
                        <FaPlus size={size === 'small' ? 10 : 12} />
                    )}
                </button>
            </div>
        );
    }

    // Not in cart
    return (
        <button
            className={`w-full rounded bg-violet-900 font-semibold text-white hover:bg-violet-800 ${baseBtn} ${className}`}
            onClick={() => addToCart(product.id)}
        >
            Add
        </button>
    );
}