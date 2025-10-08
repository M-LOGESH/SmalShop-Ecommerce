import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaStar, FaChevronRight, FaHome } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ProductActionButton from '../components/ProductActionButton';
import CategoryProducts from '../components/CategoryProducts';

function ProductView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        user,
        fetchWithAuth,
        cart,
        setCart,
        wishlist,
        setWishlist,
        wishlistData,
        setWishlistData,
    } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    
    // Local state for wishlist management
    const [localWishlistData, setLocalWishlistData] = useState([]);

    useEffect(() => {
        loadProduct();
        // Load wishlist data when component mounts and user is authenticated
        if (user?.access && !user?.is_staff) {
            loadWishlist();
        }
    }, [id, user]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const res = user?.access
                ? await fetchWithAuth(`http://127.0.0.1:8000/api/products/${id}/`)
                : await fetch(`http://127.0.0.1:8000/api/products/${id}/`);

            if (res.ok) {
                const data = await res.json();
                setProduct(data);
            } else {
                toast.error('Product not found');
                navigate('/');
            }
        } catch (err) {
            console.error('Error fetching product:', err);
            toast.error('Error loading product');
        } finally {
            setLoading(false);
        }
    };

    // Add this function to load wishlist data
    const loadWishlist = async () => {
        try {
            const res = await fetchWithAuth('http://127.0.0.1:8000/api/wishlist/');
            if (res.ok) {
                const data = await res.json();
                // Use local state instead of potentially undefined context functions
                setLocalWishlistData(data);
                // Only use setWishlist if it exists in context
                if (typeof setWishlist === 'function') {
                    setWishlist(data.map((item) => item.product));
                }
            }
        } catch (err) {
            console.error('Error loading wishlist:', err);
        }
    };

    const toggleWishlist = async (productId) => {
        if (!user) {
            toast.error('Login to add to wishlist');
            return;
        }
        if (user?.is_staff) return;

        try {
            const existingItem = localWishlistData.find((w) => w.product === productId);

            if (existingItem) {
                await fetchWithAuth(`http://127.0.0.1:8000/api/wishlist/${existingItem.id}/`, {
                    method: 'DELETE',
                });
                
                // Update local state
                setLocalWishlistData((prev) => prev.filter((w) => w.product !== productId));
                
                // Update context if functions exist
                if (typeof setWishlist === 'function') {
                    setWishlist((prev) => prev.filter((pid) => pid !== productId));
                }
                if (typeof setWishlistData === 'function') {
                    setWishlistData((prev) => prev.filter((w) => w.product !== productId));
                }
                
                toast.success('Removed from wishlist');
            } else {
                const res = await fetchWithAuth('http://127.0.0.1:8000/api/wishlist/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product: productId }),
                });

                if (res.ok) {
                    const data = await res.json();
                    
                    // Update local state
                    setLocalWishlistData((prev) => [...prev, data]);
                    
                    // Update context if functions exist
                    if (typeof setWishlist === 'function') {
                        setWishlist((prev) => [...prev, productId]);
                    }
                    if (typeof setWishlistData === 'function') {
                        setWishlistData((prev) => [...prev, data]);
                    }
                    
                    toast.success('Added to wishlist');
                } else {
                    toast.error('Failed to add to wishlist');
                }
            }
        } catch (err) {
            console.error('Wishlist error:', err);
            toast.error('Error updating wishlist');
        }
    };

    const addToCart = async (productId) => {
        if (!user) return toast.error('Login to add to cart');
        if (user?.is_staff) return;

        try {
            const res = await fetchWithAuth('http://127.0.0.1:8000/api/cart/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product: productId, quantity: 1 }),
            });
            if (res.ok) {
                const data = await res.json();
                setCart((prev) => [...prev, data]);
                toast.success('Added to cart');
            }
        } catch (err) {
            console.error('Cart error:', err);
            toast.error('Error adding to cart');
        }
    };

    const updateCartQuantity = async (cartId, newQty) => {
        if (user?.is_staff) return;

        try {
            if (newQty <= 0) {
                await fetchWithAuth(`http://127.0.0.1:8000/api/cart/${cartId}/`, {
                    method: 'DELETE',
                });
                setCart((prev) => prev.filter((c) => c.id !== cartId));
                toast.success('Removed from cart');
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
            toast.error('Error updating cart');
        }
    };

    const getCartItem = (productId) => cart.find((item) => item.product === productId);

    // Check if product is wishlisted using both context and local state
    const isWishlisted = () => {
        // First check local state
        if (localWishlistData.find((w) => w.product === product?.id)) {
            return true;
        }
        // Then check context (if wishlist exists)
        if (wishlist && Array.isArray(wishlist)) {
            return wishlist.includes(product?.id);
        }
        return false;
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-lg text-red-500">Product not found</div>
            </div>
        );
    }

    const cartItem = getCartItem(product.id);
    const wishlisted = isWishlisted();
    const images =
        product.images && product.images.length > 0
            ? product.images
            : [product.image].filter(Boolean);

    return (
        <div className="min-h-screen bg-white">
            {/* Main Content */}
            <div className="mx-auto max-w-5xl px-4 py-2 sm:py-6">
                {/* Breadcrumb */}
                <div className="mx-auto max-w-5xl py-3 mb-5">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-1 hover:text-gray-900"
                        >
                            <FaHome size={14} />
                            <span>Home</span>
                        </button>
                        <FaChevronRight size={12} />
                        <button
                            onClick={() => navigate('/category')}
                            className="hover:text-gray-900"
                        >
                            <span>Category</span>
                        </button>
                        <FaChevronRight size={12} />
                        {product.category && (
                            <>
                                <button
                                    onClick={() => navigate(`/category/${product.category.slug}`)}
                                    className="hover:text-gray-900"
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
                        <div className="lg:sticky lg:top-25 lg:self-start space-y-4">
                            {/* Main Image */}
                            <div className="mx-auto flex aspect-square max-w-sm items-center rounded-xl border border-gray-200 justify-center bg-gray-50">
                                {images.length > 0 ? (
                                    <img
                                        src={images[selectedImage]}
                                        alt={product.name}
                                        className="h-full max-h-80 w-auto object-contain"
                                    />
                                ) : (
                                    <div className="flex h-48 w-full items-center justify-center text-gray-400">
                                        No Image Available
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Images */}
                            {images.length > 1 && (
                                <div className="mx-auto flex max-w-md justify-center gap-2 overflow-x-auto">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center border bg-white ${
                                                selectedImage === index
                                                    ? 'border-violet-600'
                                                    : 'border-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`${product.name} ${index + 1}`}
                                                className="h-full w-auto object-contain"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

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
                                    {!user?.is_staff && (
                                        <button
                                            onClick={() => toggleWishlist(product.id)}
                                            className={`flex items-center gap-2 p-2 rounded-full transition-colors ${
                                                wishlisted 
                                                    ? 'text-red-500 bg-red-50' 
                                                    : 'text-gray-400 hover:bg-red-50'
                                            }`}
                                        >
                                            <FaHeart
                                                size={20}
                                                className={wishlisted ? 'fill-current' : ''}
                                            />
                                        </button>
                                    )}
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
                                    <p className="text-gray-600">{product.description}</p>
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
                                <h3 className="mb-3 text-lg font-semibold text-gray-900">Sold By</h3>
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