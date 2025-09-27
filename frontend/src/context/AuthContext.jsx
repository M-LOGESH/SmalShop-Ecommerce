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

    const saveUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const login = (userData) => saveUser(userData);
    const register = (userData) => saveUser(userData);
    const logout = () => {
        setUser(null);
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

    // Fetch with pre-emptive token refresh
    const fetchWithAuth = async (url, options = {}) => {
        let token = user?.access;
        if (!token) throw new Error('Not authenticated');

        // Check if token is expired BEFORE request
        const payload = decodeJWT(token);
        const isExpired = payload?.exp * 1000 < Date.now();

        if (isExpired) {
            token = await refreshAccessToken();
            if (!token) throw new Error('Session expired');
        }

        // now safe request (no 401 in console)
        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`,
            },
        });
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

    return (
        <AuthContext.Provider value={{ user, login, logout, register, fetchWithAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
