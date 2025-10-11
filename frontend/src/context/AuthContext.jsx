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
        localStorage.removeItem('user');
    };

    // Check if user is staff or admin
    const isStaffOrAdmin = () => {
        if (!user) return false;

        // Check from decoded token
        const payload = decodeJWT(user.access);
        if (payload?.is_staff || payload?.is_superuser) {
            return true;
        }

        // Check from user object (fallback)
        if (user.is_staff || user.is_superuser) {
            return true;
        }

        return false;
    };

    const refreshAccessToken = async () => {
        if (!user?.refresh) return null;

        try {
            const response = await fetch('${API_BASE}/api/users/token/refresh/', {
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

        // Skip cart loading for staff/admin
        if (isStaffOrAdmin()) {
            console.log('Skipping cart load for staff/admin user');
            setCart([]);
            return;
        }

        try {
            const res = await fetchWithAuth('${API_BASE}/api/cart/');
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

        // Skip wishlist loading for staff/admin
        if (isStaffOrAdmin()) {
            console.log('Skipping wishlist load for staff/admin user');
            setWishlist([]);
            setWishlistData([]);
            return;
        }

        try {
            const res = await fetchWithAuth('${API_BASE}/api/wishlist/');
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

        try {
            const res = await fetchWithAuth('${API_BASE}/api/cart/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product: productId, quantity }),
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

    const updateCartQuantity = async (cartId, quantity) => {
        if (isStaffOrAdmin()) {
            toast.error('Staff and admin users cannot modify cart');
            return;
        }

        try {
            if (quantity < 1) {
                const res = await fetchWithAuth(`${API_BASE}/api/cart/${cartId}/`, {
                    method: 'DELETE',
                });
                if (res.ok) setCart((prev) => prev.filter((item) => item.id !== cartId));
            } else {
                const res = await fetchWithAuth(`${API_BASE}/api/cart/${cartId}/`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quantity }),
                });
                if (res.ok) {
                    const data = await res.json();
                    setCart((prev) => prev.map((item) => (item.id === cartId ? data : item)));
                }
            }
        } catch (err) {
            console.error('Error updating cart:', err);
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
                await fetchWithAuth(`${API_BASE}/api/wishlist/${existingItem.id}/`, {
                    method: 'DELETE',
                });
                setWishlist((prev) => prev.filter((pid) => pid !== productId));
                setWishlistData((prev) => prev.filter((w) => w.product !== productId));
                toast.success('Removed from wishlist');
            } else {
                const res = await fetchWithAuth('${API_BASE}/api/wishlist/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product: productId }),
                });
                if (res.ok) {
                    const data = await res.json();
                    setWishlist((prev) => [...prev, productId]);
                    setWishlistData((prev) => [...prev, data]);
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

    // proactive refresh every 55 min
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
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
