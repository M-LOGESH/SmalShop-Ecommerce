import React from 'react';
import { FaHeart, FaPlus, FaMinus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import ProductActionButton from '../components/ProductActionButton';

function Wishlist() {
    const { user, wishlistData, cart, toggleWishlist, addToCart, updateCartQuantity } = useAuth();

    if (!user) return <p className="min-h-screen p-4 text-center">Login to view your wishlist.</p>;

    if (!wishlistData || wishlistData.length === 0)
        return <p className="min-h-screen p-4 text-center">No items in wishlist.</p>;

    const getCartItem = (productId) => cart.find((item) => item.product === productId);

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-4 text-xl font-bold">My Wishlist</h1>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5">
                    {wishlistData.map((w) => {
                        const p = w.product_detail;
                        if (!p) return null; // Prevent crash if product_detail missing

                        const cartItem = getCartItem(p.id);

                        return (
                            <div
                                key={w.id}
                                className="flex flex-row overflow-hidden rounded-lg border border-gray-200 bg-white p-2 shadow-md sm:flex-col"
                            >
                                {/* Image */}
                                <div className="relative flex h-28 w-28 flex-shrink-0 items-center justify-center bg-gray-100 sm:h-32 sm:w-full">
                                    {p.image ? (
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            className="h-full w-auto object-contain"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                                            No Image
                                        </div>
                                    )}
                                    <button
                                        onClick={() => toggleWishlist(p.id)}
                                        className="absolute top-2 right-2"
                                    >
                                        <FaHeart size={16} className="text-red-500" />
                                    </button>
                                </div>

                                {/* Details */}
                                <div className="flex flex-1 flex-col justify-between p-2">
                                    <div>
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

                                    <ProductActionButton
                                        product={p}
                                        cartItem={cartItem}
                                        addToCart={addToCart}
                                        updateCartQuantity={updateCartQuantity}
                                        className="mt-2"
                                    />
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
