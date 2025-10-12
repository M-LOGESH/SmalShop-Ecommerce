// pages/ProductView.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import { FaChevronRight, FaHome } from 'react-icons/fa';
import ProductActionButton from '../components/common/ProductActionButton';
import CategoryProducts from '../components/CategoryProducts';
import WishlistIcon from '../components/common/WishlistIcon';
import { toast } from 'react-toastify';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function ProductView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, fetchWithAuth, cart, addToCart, updateCartQuantity } = useAuth();

    const { getProductById, allProducts, loading: productsLoading, hasFetched } = useProducts();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProduct();
    }, [id, user, allProducts]);

    const loadProduct = async () => {
        try {
            setLoading(true);

            // First try to get product from cache
            const cachedProduct = getProductById(id);
            if (cachedProduct) {
                console.log('🔄 ProductView: Using cached product');
                setProduct(cachedProduct);
                setLoading(false);
                return;
            }

            console.log('🚀 ProductView: Fetching individual product');
            // If not in cache, fetch individually
            const res = user?.access
                ? await fetchWithAuth(`${API_BASE}/api/products/${id}/`)
                : await fetch(`${API_BASE}/api/products/${id}/`);

            if (res.ok) {
                const data = await res.json();
                setProduct(data);
            } else if (res.status === 404) {
                toast.error('Product not found');
                navigate('/');
            } else {
                toast.error('Error loading product');
            }
        } catch (err) {
            console.error('Error fetching product:', err);
            toast.error('Error loading product');
        } finally {
            setLoading(false);
        }
    };

    const getCartItem = (productId) => cart.find((item) => item.product === productId);

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="mx-auto max-w-5xl px-4 py-2 sm:py-6">
                    {/* Breadcrumb Skeleton */}
                    <div className="mx-auto mb-5 max-w-5xl py-3">
                        <div className="flex items-center space-x-2">
                            <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                            <FaChevronRight size={12} className="text-gray-300" />
                            <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                            <FaChevronRight size={12} className="text-gray-300" />
                            <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                        </div>
                    </div>

                    {/* Product Grid Skeleton */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-6">
                        {/* Image Section Skeleton */}
                        <div className="space-y-4">
                            <div className="aspect-square animate-pulse rounded-xl bg-gray-200"></div>
                            <div className="flex justify-center gap-2">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-12 w-12 animate-pulse rounded bg-gray-200"
                                    ></div>
                                ))}
                            </div>
                        </div>

                        {/* Details Section Skeleton */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200"></div>
                                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
                            </div>
                            <div className="h-12 w-1/3 animate-pulse rounded bg-gray-200"></div>
                            <div className="space-y-3">
                                <div className="h-6 animate-pulse rounded bg-gray-200"></div>
                                <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                                <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 text-lg text-red-500">Product not found</div>
                    <button
                        onClick={() => navigate('/')}
                        className="rounded-lg bg-violet-600 px-4 py-2 text-white hover:bg-violet-700"
                    >
                        Go Back Home
                    </button>
                </div>
            </div>
        );
    }

    const cartItem = getCartItem(product.id);

    return (
        <div className="min-h-screen bg-white">
            {/* Main Content */}
            <div className="mx-auto max-w-5xl px-4 py-2 sm:py-6">
                {/* Breadcrumb */}
                <div className="mx-auto mb-5 max-w-5xl py-3">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-1 transition-colors hover:text-gray-900"
                        >
                            <FaHome size={14} />
                            <span>Home</span>
                        </button>
                        <FaChevronRight size={12} />
                        <button
                            onClick={() => navigate('/category')}
                            className="transition-colors hover:text-gray-900"
                        >
                            <span>Category</span>
                        </button>
                        <FaChevronRight size={12} />
                        {product.category && (
                            <>
                                <button
                                    onClick={() => navigate(`/category/${product.category.slug}`)}
                                    className="transition-colors hover:text-gray-900"
                                >
                                    {product.category.name}
                                </button>
                                <FaChevronRight size={12} />
                            </>
                        )}
                        <span className="font-medium text-gray-900">{product.name}</span>
                    </nav>
                </div>

                {/* Main Product Grid */}
                <div className="relative">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-6">
                        {/* Left Side - Sticky Image Section */}
                        <div className="space-y-4 lg:sticky lg:top-25 lg:self-start">
                            {/* Main Image */}
                            <div className="mx-auto flex aspect-square max-w-sm items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="h-full max-h-80 w-auto object-contain"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="flex h-48 w-full items-center justify-center text-gray-400">
                                        No Image Available
                                    </div>
                                )}
                            </div>

                            {/* Add to Cart Button - Mobile: Below image on smaller screens */}
                            <div className="mx-auto max-w-md pt-4 lg:hidden">
                                <ProductActionButton
                                    product={product}
                                    cartItem={cartItem}
                                    addToCart={addToCart}
                                    updateCartQuantity={updateCartQuantity}
                                    className="w-full py-3"
                                />
                            </div>

                            {/* Add to Cart Button - Desktop (below image) */}
                            <div className="mx-auto hidden max-w-sm pt-4 lg:block">
                                <ProductActionButton
                                    product={product}
                                    cartItem={cartItem}
                                    addToCart={addToCart}
                                    updateCartQuantity={updateCartQuantity}
                                    className="py-2"
                                />
                            </div>
                        </div>

                        {/* Right Side - Scrollable Product Details */}
                        <div className="space-y-6 sm:px-20 lg:px-0">
                            {/* Product Header */}
                            <div>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            {product.name}
                                        </h1>
                                        <p className="mt-1 text-gray-500">{product.quantity}</p>
                                    </div>

                                    <WishlistIcon
                                        productId={product.id}
                                        size={20}
                                        className="rounded-full p-2 transition-colors hover:bg-red-50"
                                        showToast={true}
                                    />
                                </div>
                            </div>

                            {/* Prices */}
                            <div className="border-t border-gray-200 pt-4">
                                {product.retail_price &&
                                product.retail_price > product.selling_price ? (
                                    <div className="flex items-baseline gap-3">
                                        <div className="flex flex-col">
                                            <span className="text-2xl font-bold text-violet-600">
                                                ₹{product.selling_price}
                                            </span>
                                            <span className="text-lg text-gray-500 line-through">
                                                ₹{product.retail_price}
                                            </span>
                                        </div>
                                        <span className="rounded bg-green-100 px-2 py-1 text-sm font-semibold text-green-700">
                                            {Math.round(
                                                ((product.retail_price - product.selling_price) /
                                                    product.retail_price) *
                                                    100
                                            )}
                                            % OFF
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-2xl font-bold text-violet-600">
                                        ₹{product.selling_price ?? '-'}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            {product.description && (
                                <div className="border-t border-gray-200 pt-4">
                                    <h3 className="mb-3 text-lg font-semibold text-gray-900">
                                        Description
                                    </h3>
                                    <p className="leading-relaxed text-gray-600">
                                        {product.description}
                                    </p>
                                </div>
                            )}

                            {/* Product Details */}
                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                                    Product Details
                                </h3>
                                <div className="space-y-3">
                                    {product.category && (
                                        <div className="flex">
                                            <span className="w-28 font-medium text-gray-700">
                                                Category
                                            </span>
                                            <span className="text-gray-600">
                                                {product.category.name}
                                            </span>
                                        </div>
                                    )}
                                    {product.subcategories && product.subcategories.length > 0 && (
                                        <div className="flex">
                                            <span className="w-28 font-medium text-gray-700">
                                                Subcategories
                                            </span>
                                            <span className="text-gray-600">
                                                {product.subcategories
                                                    .map((sub) => sub.name)
                                                    .join(', ')}
                                            </span>
                                        </div>
                                    )}
                                    {product.brand && (
                                        <div className="flex">
                                            <span className="w-28 font-medium text-gray-700">
                                                Brand
                                            </span>
                                            <span className="text-gray-600">{product.brand}</span>
                                        </div>
                                    )}
                                    {product.manufacturer && (
                                        <div className="flex">
                                            <span className="w-28 font-medium text-gray-700">
                                                Manufacturer
                                            </span>
                                            <span className="text-gray-600">
                                                {product.manufacturer}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Seller Information */}
                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                                    Sold By
                                </h3>
                                <div className="text-gray-600">
                                    <p className="font-medium">Smalshop</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Products Section */}
                {product.category && (
                    <div className="mt-12">
                        <CategoryProducts
                            categoryName={product.category.name}
                            title="Similar Products"
                            slug={product.category.slug}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductView;