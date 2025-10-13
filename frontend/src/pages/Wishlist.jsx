// pages/Wishlist.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductActionButton from '../components/common/ProductActionButton';
import WishlistIcon from '../components/common/WishlistIcon';

function Wishlist() {
    const { wishlistData, cart, addToCart, updateCartQuantity } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (wishlistData !== undefined) {
            setLoading(false);
        }
    }, [wishlistData]);

    if (loading)
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="animate-pulse text-gray-500">Loading wishlist...</p>
            </div>
        );

    if (!wishlistData || wishlistData.length === 0)
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <div className="-mt-30">
                    <img
                        src="/img/emptywishlist.png"
                        alt="Wishlist"
                        className="mb-4 h-64 w-64"
                    />
                    <p className="text-center text-lg font-semibold text-gray-600">
                        No items in Wishlist
                    </p>
                </div>
            </div>
        );

    const getCartItem = (productId) => cart.find((item) => item.product === productId);

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-4 text-xl font-bold">My Wishlist</h1>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5">
                    {wishlistData.map((w) => {
                        const p = w.product_detail;
                        if (!p) return null;

                        const cartItem = getCartItem(p.id);

                        return (
                            <div
                                key={w.id}
                                className="flex flex-row overflow-hidden rounded-lg border border-gray-200 bg-white p-2 shadow-md sm:flex-col"
                            >
                                {/* Image */}
                                <div
                                    className="relative flex h-28 w-28 flex-shrink-0 cursor-pointer items-center justify-center bg-gray-100 sm:h-32 sm:w-full"
                                    onClick={() => navigate(`/product/${p.id}`)}
                                >
                                    {p.image_url ? (
                                        <img
                                            src={p.image_url}
                                            alt={p.name}
                                            className="h-full w-auto object-contain"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                                            No Image
                                        </div>
                                    )}
                                    <WishlistIcon
                                        productId={p.id}
                                        size={16}
                                        className="absolute top-2 right-2"
                                        showToast={true}
                                    />
                                </div>

                                {/* Details */}
                                <div
                                    className="flex flex-1 cursor-pointer flex-col justify-between pl-2 sm:pl-0"
                                    onClick={() => navigate(`/product/${p.id}`)}
                                >
                                    <div className="pl-2">
                                        <h3 className="truncate text-sm font-semibold">{p.name}</h3>
                                        <p className="text-xs text-gray-500">{p.quantity}</p>
                                        <div className="mt-1">
                                            {p.retail_price && p.retail_price > p.selling_price ? (
                                                <div className="flex items-baseline gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-md font-bold text-violet-600">
                                                            ₹{p.selling_price}
                                                        </span>
                                                        <span className="text-xs text-gray-500 line-through">
                                                            ₹{p.retail_price}
                                                        </span>
                                                    </div>
                                                    <span className="rounded bg-green-300/20 px-1 text-sm font-semibold text-green-600">
                                                        {Math.round(
                                                            ((p.retail_price - p.selling_price) /
                                                                p.retail_price) *
                                                                100
                                                        )}
                                                        % OFF
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-md font-bold text-violet-600">
                                                    ₹{p.selling_price ?? '-'}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div onClick={(e) => e.stopPropagation()}>
                                        <ProductActionButton
                                            product={p}
                                            cartItem={cartItem}
                                            addToCart={addToCart}
                                            updateCartQuantity={updateCartQuantity}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Wishlist;