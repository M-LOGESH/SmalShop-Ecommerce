import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaPlus, FaMinus } from 'react-icons/fa';

function CategoryPage() {
    const { slug } = useParams();
    const { user, fetchWithAuth, cart, setCart, toggleWishlist } = useAuth();

    const [products, setProducts] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [wishlistData, setWishlistData] = useState([]);

    // --- Map slug to backend category name ---
    const categoryMap = {
        biscuits: 'Biscuits & Cookies',
        munchies: 'Chips & Munchies',
        colddrinks: 'Cold Drinks',
        fruits: 'Fresh Fruits',
        vegetables: 'Basic Vegetables',
    };
    const categoryName = categoryMap[slug] || slug;

    // --- Load products ---
    useEffect(() => {
        const loadProducts = async () => {
            try {
                let res;
                if (user?.access) {
                    res = await fetchWithAuth('http://127.0.0.1:8000/api/products/');
                } else {
                    res = await fetch('http://127.0.0.1:8000/api/products/');
                }

                const data = await res.json();
                if (!Array.isArray(data)) return;

                // Use slug-based filtering if your backend has slug field
                const filtered = data.filter((p) => p.category?.slug === slug);
                setProducts(filtered);
            } catch (err) {
                console.error('Error fetching products:', err);
            }
        };
        loadProducts();
    }, [slug, user]);

    // --- Load wishlist ---
    useEffect(() => {
        const loadWishlist = async () => {
            if (!user?.access) return;
            try {
                const res = await fetchWithAuth('http://127.0.0.1:8000/api/wishlist/');
                if (!res.ok) return;
                const data = await res.json();
                setWishlistData(data);
                setWishlist(data.map((item) => item.product));
            } catch (err) {
                console.error('Error loading wishlist:', err);
            }
        };
        loadWishlist();
    }, [user]);

    const addToCart = async (productId) => {
        if (!user) return alert('Login to add to cart');

        try {
            const res = await fetchWithAuth('http://127.0.0.1:8000/api/cart/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product: productId, quantity: 1 }),
            });
            if (res.ok) {
                const data = await res.json();
                setCart((prev) => [...prev, data]);
            }
        } catch (err) {
            console.error('Cart error:', err);
        }
    };

    const updateCartQuantity = async (cartId, newQty) => {
        try {
            if (newQty <= 0) {
                await fetchWithAuth(`http://127.0.0.1:8000/api/cart/${cartId}/`, {
                    method: 'DELETE',
                });
                setCart((prev) => prev.filter((c) => c.id !== cartId));
            } else {
                const res = await fetchWithAuth(`http://127.0.0.1:8000/api/cart/${cartId}/`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quantity: newQty }),
                });
                if (res.ok) {
                    const data = await res.json();
                    setCart((prev) => prev.map((c) => (c.id === cartId ? data : c)));
                }
            }
        } catch (err) {
            console.error('Cart update error:', err);
        }
    };

    const getCartItem = (productId) => cart.find((item) => item.product === productId);

    if (!products || products.length === 0)
        return <p className="min-h-screen p-4 text-center">No products in this category.</p>;

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-4 sm:px-8">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-4 text-2xl font-bold">{categoryName}</h1>

                {/* Responsive grid: mobile 1 col, small 2, medium 3, large 5 */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
                    {products.map((p) => {
                        const cartItem = getCartItem(p.id);
                        const isWishlisted = wishlist.includes(p.id);

                        return (
                            <div
                                key={p.id}
                                className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-2 shadow-md"
                            >
                                {/* Image */}
                                <div className="relative flex h-32 w-full items-center justify-center bg-gray-100">
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
                                        <FaHeart
                                            size={16}
                                            className={
                                                isWishlisted ? 'text-red-500' : 'text-gray-400'
                                            }
                                        />
                                    </button>
                                </div>

                                {/* Details */}
                                <div className="flex flex-1 flex-col justify-between p-1">
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

                                    {/* Add / Quantity */}
                                    {cartItem ? (
                                        <div className="mt-2 flex items-center justify-between rounded bg-violet-900 px-2 py-1 text-sm font-bold text-white">
                                            <button
                                                onClick={() =>
                                                    updateCartQuantity(
                                                        cartItem.id,
                                                        cartItem.quantity - 1
                                                    )
                                                }
                                            >
                                                <FaMinus />
                                            </button>
                                            <span>{cartItem.quantity}</span>
                                            <button
                                                onClick={() =>
                                                    updateCartQuantity(
                                                        cartItem.id,
                                                        cartItem.quantity + 1
                                                    )
                                                }
                                            >
                                                <FaPlus />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="mt-2 w-full rounded bg-violet-900 px-2 py-1 text-sm text-white hover:bg-violet-800"
                                            onClick={() => addToCart(p.id)}
                                        >
                                            Add
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default CategoryPage;
