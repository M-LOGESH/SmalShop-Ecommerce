import React, { useRef, useState, useMemo, useEffect } from 'react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import ProductActionButton from './common/ProductActionButton';
import WishlistIcon from './common/WishlistIcon';

function CategoryProducts({ categoryName, title, slug }) {
    const { cart, addToCart, updateCartQuantity } = useAuth();
    const { getProductsByCategory, loading, hasFetched } = useProducts();
    const navigate = useNavigate();

    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const pointerTypeRef = useRef('mouse');

    // Memoize filtered products to prevent unnecessary recalculations
    const products = useMemo(() => {
        // Only return products if we have fetched data
        return hasFetched ? getProductsByCategory(categoryName) : [];
    }, [getProductsByCategory, categoryName, hasFetched]);

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

    // Show loading skeleton only if we're still loading AND haven't fetched data yet
    if (loading && !hasFetched) {
        return (
            <div className="relative flex justify-center p-3 sm:px-10">
                <div className="w-full max-w-6xl">
                    <div className="mb-2 flex items-center justify-between">
                        <h2 className="text-lg font-bold">{title || categoryName}</h2>
                        <div className="flex items-center gap-1 text-sm font-medium text-violet-600">
                            See all <FaChevronRight size={12} />
                        </div>
                    </div>
                    <div className="flex gap-4 overflow-x-auto py-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-35 flex-shrink-0 animate-pulse">
                                <div className="h-24 rounded-lg bg-gray-200 sm:h-32"></div>
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

    // Don't render anything if no products and we have fetched data
    if (hasFetched && products.length === 0) return null;

    // If we haven't fetched yet but also not loading (edge case), return null
    if (!hasFetched && !loading) return null;

    return (
        <div className="relative flex justify-center p-3 sm:px-10">
            <div className="w-full max-w-6xl">
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
                                    {/* Make image and product info clickable */}
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => navigate(`/product/${p.id}`)}
                                    >
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

                                            <WishlistIcon
                                                productId={p.id}
                                                size={14}
                                                className="absolute top-2 right-2"
                                                showToast={true}
                                            />
                                        </div>

                                        <h3 className="truncate pl-2 text-sm font-medium sm:font-semibold">
                                            {p.name}
                                        </h3>
                                        <p className="pl-2 text-xs text-gray-500">{p.quantity}</p>

                                        <div className="mt-1 pl-2">
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

                                    <ProductActionButton
                                        product={p}
                                        cartItem={cartItem}
                                        addToCart={addToCart}
                                        updateCartQuantity={updateCartQuantity}
                                        className="mt-2"
                                    />
                                </div>
                            );
                        })}
                    </div>

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
