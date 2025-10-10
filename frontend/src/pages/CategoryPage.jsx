import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import ProductActionButton from '../components/common/ProductActionButton';
import WishlistIcon from '../components/common/WishlistIcon';

function CategoryPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { cart, addToCart, updateCartQuantity } = useAuth();
    const { getProductsByCategorySlug, loading, hasFetched } = useProducts();

    const categoryMap = {
        biscuits: 'Biscuits & Cookies',
        munchies: 'Chips & Munchies',
        colddrinks: 'Cold Drinks',
        fruits: 'Fresh Fruits',
        vegetables: 'Basic Vegetables',
    };
    const categoryName = categoryMap[slug] || slug;

    const products = getProductsByCategorySlug(slug);

    const getCartItem = (productId) => cart.find((item) => item.product === productId);

    if (loading && !hasFetched) {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-4 sm:px-8">
                <div className="mx-auto max-w-6xl">
                    <h1 className="mb-4 text-xl font-bold">{categoryName}</h1>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-32 rounded bg-gray-200"></div>
                                <div className="mt-2 h-4 rounded bg-gray-200"></div>
                                <div className="mt-1 h-3 w-3/4 rounded bg-gray-200"></div>
                                <div className="mt-2 h-8 rounded bg-gray-200"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (hasFetched && !products.length) {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-4 sm:px-8">
                <div className="mx-auto max-w-6xl">
                    <h1 className="mb-4 text-xl font-bold">{categoryName}</h1>
                    <div className="flex items-center justify-center py-12">
                        <p className="text-gray-500">No products in this category.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-4 sm:px-8">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-4 text-xl font-bold">{categoryName}</h1>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {products.map((p) => {
                        const cartItem = getCartItem(p.id);
                        return (
                            <div
                                key={p.id}
                                className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-2 shadow-md"
                            >
                                {/* Clickable product info area */}
                                <div
                                    className="flex-1 cursor-pointer"
                                    onClick={() => navigate(`/product/${p.id}`)}
                                >
                                    <div className="relative flex h-32 items-center justify-center bg-gray-100">
                                        {p.image ? (
                                            <img
                                                src={p.image}
                                                alt={p.name}
                                                className="h-full w-auto object-contain"
                                            />
                                        ) : (
                                            <div className="text-xs text-gray-500">No Image</div>
                                        )}

                                        <WishlistIcon
                                            productId={p.id}
                                            size={16}
                                            className="absolute top-2 right-2"
                                            showToast={true}
                                        />
                                    </div>

                                    <div className="p-2">
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
                                </div>

                                <ProductActionButton
                                    product={p}
                                    cartItem={cartItem}
                                    addToCart={addToCart}
                                    updateCartQuantity={updateCartQuantity}
                                    className="w-full"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default CategoryPage;
