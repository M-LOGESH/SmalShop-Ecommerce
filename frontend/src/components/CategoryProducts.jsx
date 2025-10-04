import React, { useEffect, useRef, useState } from 'react';
import { FaHeart, FaChevronRight, FaChevronLeft, FaPlus, FaMinus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

function CategoryProducts({ categoryName, title, slug }) {
    const { user, fetchWithAuth, cart, setCart } = useAuth();
    const [products, setProducts] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [wishlistData, setWishlistData] = useState([]);

    const navigate = useNavigate();

    // Scroll refs
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const pointerTypeRef = useRef('mouse');

    // --- Load products ---
    useEffect(() => {
        loadProducts();
    }, [categoryName, user]);

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

            const filtered = data.filter((p) => p.category?.name === categoryName);
            setProducts(filtered);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    // --- Load wishlist & cart ---
    useEffect(() => {
        if (user?.access) {
            loadWishlist();
            loadCart();
        } else {
            setWishlist([]);
            setWishlistData([]);
        }
    }, [user]);

    const loadWishlist = async () => {
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

    const loadCart = async () => {
        try {
            const res = await fetchWithAuth('http://127.0.0.1:8000/api/cart/');
            if (res.ok) {
                const data = await res.json();
                setCart(data);
            }
        } catch (err) {
            console.error('Error loading cart:', err);
        }
    };

    // --- Wishlist toggle ---
    const toggleWishlist = async (productId) => {
        if (!user) return toast.error('Login to add to wishlist');

        try {
            const existingItem = wishlistData.find((w) => w.product === productId);

            if (existingItem) {
                await fetchWithAuth(`http://127.0.0.1:8000/api/wishlist/${existingItem.id}/`, {
                    method: 'DELETE',
                });
                setWishlist((prev) => prev.filter((pid) => pid !== productId));
                setWishlistData((prev) => prev.filter((w) => w.product !== productId));
            } else {
                const res = await fetchWithAuth('http://127.0.0.1:8000/api/wishlist/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product: productId }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setWishlist((prev) => [...prev, productId]);
                    setWishlistData((prev) => [...prev, data]);
                }
            }
        } catch (err) {
            console.error('Wishlist error:', err);
        }
    };

    // --- Cart actions ---
    const addToCart = async (productId) => {
        if (!user) return toast.error('Login to add to cart');

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

    // --- Drag-to-scroll (desktop only) ---
    const handlePointerDown = (e) => {
        pointerTypeRef.current = e.pointerType;
        if (e.pointerType !== 'mouse') return;
        setIsDown(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handlePointerMove = (e) => {
        if (pointerTypeRef.current !== 'mouse' || !isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = x - startX;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handlePointerUp = () => setIsDown(false);
    const handlePointerLeave = () => setIsDown(false);

    // --- Scroll with buttons ---
    const scrollLeftBtn = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
        }
    };

    const scrollRightBtn = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
    };

    // --- Track scroll position ---
    const updateScrollButtons = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    };

    useEffect(() => {
        updateScrollButtons();
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener('scroll', updateScrollButtons);
        window.addEventListener('resize', updateScrollButtons);
        return () => {
            el.removeEventListener('scroll', updateScrollButtons);
            window.removeEventListener('resize', updateScrollButtons);
        };
    }, [products]);

    if (products.length === 0) return null;

    return (
        <div className="relative flex justify-center p-3 sm:px-10">
            <div className="w-full max-w-6xl">
                {/* Header */}
                <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-lg font-bold">{title || categoryName}</h2>
                    <button
                        onClick={() => navigate(`/category/${slug}`)}
                        className="flex items-center gap-1 text-sm font-medium text-violet-600"
                    >
                        See all <FaChevronRight size={12} />
                    </button>
                </div>

                {/* Scroll Container */}
                <div className="relative">
                    {/* Left Button */}
                    {canScrollLeft && (
                        <button
                            onClick={scrollLeftBtn}
                            className="text-2xs absolute top-1/2 left-2 z-10 hidden -translate-y-1/2 rounded-full border border-gray-200 bg-white p-1 shadow-lg md:flex"
                        >
                            <FaChevronLeft />
                        </button>
                    )}

                    {/* Products */}
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto py-3 select-none [&::-webkit-scrollbar]:hidden"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            cursor:
                                pointerTypeRef.current === 'mouse'
                                    ? isDown
                                        ? 'grabbing'
                                        : 'grab'
                                    : 'auto',
                        }}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerLeave}
                    >
                        {products.map((p) => {
                            const cartItem = cart.find((c) => c.product === p.id);
                            return (
                                <div
                                    key={p.id}
                                    className="relative flex w-35 flex-shrink-0 snap-start flex-col justify-between rounded-lg border border-gray-300 p-2 shadow-md sm:w-40 lg:w-45"
                                >
                                    {/* Card content */}
                                    <div>
                                        <div className="relative mb-2 flex h-24 w-full items-center justify-center rounded bg-gray-100 sm:h-32">
                                            {p.image ? (
                                                <img
                                                    src={p.image}
                                                    alt={p.name}
                                                    className="h-full max-h-40 w-auto object-contain"
                                                />
                                            ) : (
                                                <div className="flex h-32 w-full items-center justify-center rounded">
                                                    No Image
                                                </div>
                                            )}
                                            <button
                                                onClick={() => toggleWishlist(p.id)}
                                                className="absolute top-2 right-2"
                                            >
                                                <FaHeart
                                                    size={14}
                                                    className={
                                                        wishlist.includes(p.id)
                                                            ? 'text-red-500'
                                                            : 'text-gray-400'
                                                    }
                                                />
                                            </button>
                                        </div>

                                        <h3 className="truncate text-sm font-medium sm:font-semibold">
                                            {p.name}
                                        </h3>
                                        <p className="text-xs text-gray-500">{p.quantity}</p>

                                        <div className="mt-1">
                                            {p.retail_price && p.retail_price > p.selling_price ? (
                                                <div className="flex items-baseline gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="sm:text-md text-sm font-bold text-violet-600">
                                                            ₹{p.selling_price}
                                                        </span>
                                                        <span className="text-xs text-gray-500 line-through">
                                                            ₹{p.retail_price}
                                                        </span>
                                                    </div>
                                                    <span className="rounded bg-green-300/20 px-1 text-xs font-semibold text-green-600 sm:text-sm">
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

                                    {/* Button pinned to bottom */}
                                    <div className="mt-2">
                                        {cartItem ? (
                                            <div className="flex items-center justify-between rounded bg-violet-900 px-2 py-1 text-sm font-bold text-white">
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
                                        ) : p.stock_status === 'out_of_stock' ? (
                                            <button
                                                disabled
                                                className="w-full cursor-not-allowed rounded bg-gray-400 px-2 py-1 text-sm font-semibold text-white"
                                            >
                                                Out of Stock
                                            </button>
                                        ) : (
                                            <button
                                                className="w-full rounded bg-violet-900 px-2 py-1 text-sm text-white hover:bg-violet-800"
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

                    {/* Right Button */}
                    {canScrollRight && (
                        <button
                            onClick={scrollRightBtn}
                            className="text-2xs absolute top-1/2 right-2 z-10 hidden -translate-y-1/2 rounded-full border border-gray-200 bg-white p-1 shadow-lg md:flex"
                        >
                            <FaChevronRight />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CategoryProducts;
