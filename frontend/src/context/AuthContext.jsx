import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const saveUser = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const login = (userData) => saveUser(userData);
    const register = (userData) => saveUser(userData);
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    // Refresh token function
    const refreshAccessToken = async () => {
        if (!user?.refresh) return null;

        try {
            const response = await fetch("http://127.0.0.1:8000/api/users/token/refresh/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
            console.error("Error refreshing token:", err);
            logout();
            return null;
        }
    };

    // Helper: fetch with auto-refresh
    const fetchWithAuth = async (url, options = {}) => {
        let token = user?.access;
        if (!token) throw new Error("Not authenticated");

        // First try
        let response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                "Authorization": `Bearer ${token}`,
            },
        });

        // If unauthorized, try refreshing token
        if (response.status === 401) {
            token = await refreshAccessToken();
            if (!token) throw new Error("Session expired");

            response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    "Authorization": `Bearer ${token}`,
                },
            });
        }

        return response;
    };

    //Proactive refresh: refresh access token every 55 minutes
    useEffect(() => {
        if (!user?.refresh) return;

        const interval = setInterval(() => {
            refreshAccessToken();
        }, 55 * 60 * 1000); // 55 minutes

        return () => clearInterval(interval);
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, logout, register, fetchWithAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
