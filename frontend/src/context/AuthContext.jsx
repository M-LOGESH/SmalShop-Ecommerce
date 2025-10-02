import React, { createContext, useContext, useState, useEffect } from 'react';

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

    const refreshAccessToken = async () => {
        if (!user?.refresh) return null;

        try {
            const response = await fetch('http://127.0.0.1:8000/api/users/token/refresh/', {
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

    // Load cart from API
    const loadCart = async () => {
        if (!user?.access) return;
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

    // Load wishlist from API
    const loadWishlist = async () => {
        if (!user?.access) return;
        try {
            const res = await fetchWithAuth('http://127.0.0.1:8000/api/wishlist/');
            if (res.ok) {
                const data = await res.json();
                setWishlistData(data);
                setWishlist(data.map(item => item.product));
            }
        } catch (err) {
            console.error('Error loading wishlist:', err);
        }
    };

    // Add item to cart
    const addToCart = async (productId, quantity = 1) => {
        if (!user) return alert('Login to add to cart');

        try {
            const res = await fetchWithAuth('http://127.0.0.1:8000/api/cart/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product: productId, quantity }),
            });

            if (res.ok) {
                const data = await res.json();
                setCart(prev => [...prev, data]);
            }
        } catch (err) {
            console.error('Cart error:', err);
        }
    };

    // Update cart quantity
    const updateCartQuantity = async (cartId, quantity) => {
        try {
            if (quantity < 1) {
                const res = await fetchWithAuth(`http://127.0.0.1:8000/api/cart/${cartId}/`, {
                    method: 'DELETE',
                });
                if (res.ok) setCart(prev => prev.filter(item => item.id !== cartId));
            } else {
                const res = await fetchWithAuth(`http://127.0.0.1:8000/api/cart/${cartId}/`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quantity }),
                });
                if (res.ok) {
                    const data = await res.json();
                    setCart(prev => prev.map(item => item.id === cartId ? data : item));
                }
            }
        } catch (err) {
            console.error('Error updating cart:', err);
        }
    };

    // Toggle wishlist
    const toggleWishlist = async (productId) => {
        if (!user) return alert('Login to add to wishlist');

        try {
            const existingItem = wishlistData.find(w => w.product === productId);

            if (existingItem) {
                await fetchWithAuth(`http://127.0.0.1:8000/api/wishlist/${existingItem.id}/`, { method: 'DELETE' });
                setWishlist(prev => prev.filter(pid => pid !== productId));
                setWishlistData(prev => prev.filter(w => w.product !== productId));
            } else {
                const res = await fetchWithAuth('http://127.0.0.1:8000/api/wishlist/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product: productId }),
                });
                if (res.ok) {
                    const data = await res.json();
                    setWishlist(prev => [...prev, productId]);
                    setWishlistData(prev => [...prev, data]);
                }
            }
        } catch (err) {
            console.error('Wishlist error:', err);
        }
    };

    // proactive refresh every 55 min
    useEffect(() => {
        if (!user?.refresh) return;
        const interval = setInterval(() => {
            refreshAccessToken();
        }, 55 * 60 * 1000);
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
        <AuthContext.Provider value={{
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
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
