import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const AuthContext = createContext();

function decodeJWT(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch {
        return null;
    }
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [wishlistData, setWishlistData] = useState([]);
    const [updatingItems, setUpdatingItems] = useState(new Set()); // Track updating items

    const saveUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const login = (userData) => saveUser(userData);
    const register = (userData) => saveUser(userData);
    const logout = () => {
        setUser(null);
        setCart([]);
        setWishlist([]);
        setWishlistData([]);
        setUpdatingItems(new Set());
        localStorage.removeItem('user');
    };

    const isStaffOrAdmin = () => {
        if (!user) return false;
        const payload = decodeJWT(user.access);
        if (payload?.is_staff || payload?.is_superuser) return true;
        if (user.is_staff || user.is_superuser) return true;
        return false;
    };

    const refreshAccessToken = async () => {
        if (!user?.refresh) return null;
        try {
            const response = await fetch(`${API_BASE}/api/users/token/refresh/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: user.refresh }),
            });

            if (!response.ok) {
                logout();
                return null;
            }

            const data = await response.json();
            const updatedUser = { ...user, access: data.access };
            saveUser(updatedUser);
            return data.access;
        } catch (err) {
            console.error('Error refreshing token:', err);
            logout();
            return null;
        }
    };

    const fetchWithAuth = async (url, options = {}) => {
        let token = user?.access;
        if (!token) throw new Error('Not authenticated');

        const payload = decodeJWT(token);
        const isExpired = payload?.exp * 1000 < Date.now();

        if (isExpired) {
            token = await refreshAccessToken();
            if (!token) throw new Error('Session expired');
        }

        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`,
            },
        });
    };

    const loadCart = async () => {
        if (!user?.access) return;
        if (isStaffOrAdmin()) {
            setCart([]);
            return;
        }

        try {
            const res = await fetchWithAuth(`${API_BASE}/api/cart/`);
            if (res.ok) {
                const data = await res.json();
                setCart(data);
            }
        } catch (err) {
            console.error('Error loading cart:', err);
        }
    };

    const loadWishlist = async () => {
        if (!user?.access) return;
        if (isStaffOrAdmin()) {
            setWishlist([]);
            setWishlistData([]);
            return;
        }

        try {
            const res = await fetchWithAuth(`${API_BASE}/api/wishlist/`);
            if (res.ok) {
                const data = await res.json();
                setWishlistData(data);
                setWishlist(data.map((item) => item.product));
            }
        } catch (err) {
            console.error('Error loading wishlist:', err);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        if (!user) return toast.error('Login to add to cart');
        if (isStaffOrAdmin()) {
            toast.error('Staff and admin users cannot use cart functionality');
            return;
        }

        // Immediate UI update
        const tempCartItem = {
            id: `temp-${Date.now()}`,
            product: productId,
            quantity: quantity,
            product_detail: { id: productId }, // Minimal product detail for immediate UI
            isTemp: true
        };

        setCart((prev) => [...prev, tempCartItem]);

        try {
            const res = await fetchWithAuth(`${API_BASE}/api/cart/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product: productId, quantity }),
            });

            if (res.ok) {
                const data = await res.json();
                // Replace temp item with real item
                setCart((prev) => 
                    prev.map(item => item.id === tempCartItem.id ? data : item)
                );
                toast.success('Added to cart');
            } else {
                // Rollback on error
                setCart((prev) => prev.filter(item => item.id !== tempCartItem.id));
                toast.error('Failed to add to cart');
            }
        } catch (err) {
            console.error('Cart error:', err);
            setCart((prev) => prev.filter(item => item.id !== tempCartItem.id));
            toast.error('Error adding to cart');
        }
    };

    const updateCartQuantity = async (cartId, newQuantity) => {
        if (isStaffOrAdmin()) {
            toast.error('Staff and admin users cannot modify cart');
            return;
        }

        // Prevent multiple simultaneous updates for same item
        if (updatingItems.has(cartId)) return;
        
        setUpdatingItems(prev => new Set(prev).add(cartId));

        // Immediate UI update
        const previousCart = [...cart];
        setCart((prev) =>
            prev.map((item) =>
                item.id === cartId ? { ...item, quantity: newQuantity } : item
            )
        );

        try {
            if (newQuantity < 1) {
                const res = await fetchWithAuth(`${API_BASE}/api/cart/${cartId}/`, {
                    method: 'DELETE',
                });
                if (res.ok) {
                    setCart((prev) => prev.filter((item) => item.id !== cartId));
                } else {
                    // Rollback on error
                    setCart(previousCart);
                    toast.error('Failed to remove item');
                }
            } else {
                const res = await fetchWithAuth(`${API_BASE}/api/cart/${cartId}/`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quantity: newQuantity }),
                });
                if (res.ok) {
                    const data = await res.json();
                    setCart((prev) => prev.map((item) => (item.id === cartId ? data : item)));
                } else {
                    // Rollback on error
                    setCart(previousCart);
                    toast.error('Failed to update quantity');
                }
            }
        } catch (err) {
            console.error('Error updating cart:', err);
            // Rollback on error
            setCart(previousCart);
            toast.error('Error updating cart');
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(cartId);
                return newSet;
            });
        }
    };

    const toggleWishlist = async (productId) => {
        if (!user) {
            toast.error('Login to add to wishlist');
            return;
        }

        if (isStaffOrAdmin()) {
            toast.error('Staff and admin users cannot use wishlist functionality');
            return;
        }

        try {
            const existingItem = wishlistData.find((w) => w.product === productId);

            if (existingItem) {
                // Immediate UI update
                setWishlist((prev) => prev.filter((pid) => pid !== productId));
                setWishlistData((prev) => prev.filter((w) => w.product !== productId));
                
                await fetchWithAuth(`${API_BASE}/api/wishlist/${existingItem.id}/`, {
                    method: 'DELETE',
                });
                toast.success('Removed from wishlist');
            } else {
                // Immediate UI update
                setWishlist((prev) => [...prev, productId]);
                const tempWishlistItem = { id: `temp-${Date.now()}`, product: productId, isTemp: true };
                setWishlistData((prev) => [...prev, tempWishlistItem]);

                const res = await fetchWithAuth(`${API_BASE}/api/wishlist/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product: productId }),
                });
                if (res.ok) {
                    const data = await res.json();
                    setWishlistData((prev) => prev.map(item => item.id === tempWishlistItem.id ? data : item));
                    toast.success('Added to wishlist');
                } else {
                    // Rollback on error
                    setWishlist((prev) => prev.filter((pid) => pid !== productId));
                    setWishlistData((prev) => prev.filter((w) => w.id !== tempWishlistItem.id));
                    toast.error('Failed to add to wishlist');
                }
            }
        } catch (err) {
            console.error('Wishlist error:', err);
            toast.error('Error updating wishlist');
        }
    };

    useEffect(() => {
        if (!user?.refresh) return;
        const interval = setInterval(
            () => {
                refreshAccessToken();
            },
            55 * 60 * 1000
        );
        return () => clearInterval(interval);
    }, [user]);

    // Load cart and wishlist when user logs in
    useEffect(() => {
        if (user?.access) {
            loadCart();
            loadWishlist();
        } else {
            setCart([]);
            setWishlist([]);
            setWishlistData([]);
            setUpdatingItems(new Set());
        }
    }, [user]);

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                register,
                fetchWithAuth,
                cart,
                setCart,
                wishlist,
                wishlistData,
                toggleWishlist,
                addToCart,
                updateCartQuantity,
                isStaffOrAdmin,
                updatingItems, 
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);