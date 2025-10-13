import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
    const { user, fetchWithAuth } = useAuth();
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastFetchTime, setLastFetchTime] = useState(0);
    const [hasFetched, setHasFetched] = useState(false);

    const CACHE_DURATION = 2 * 60 * 1000;

    const updateOrderLocally = (orderId, newStatus) => {
        setAllOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
    };

    const fetchOrders = useCallback(
        async (force = false) => {
            // Skip if not logged in
            if (!user?.access) {
                setAllOrders([]);
                setHasFetched(false);
                setLoading(false);
                return;
            }

            const now = Date.now();
            if (!force && allOrders.length > 0 && now - lastFetchTime < CACHE_DURATION) return;

            try {
                setLoading(true);
                setError(null);

                const res = await fetchWithAuth(`${API_BASE}/api/orders/`);

                if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);

                const data = await res.json();
                if (!Array.isArray(data)) throw new Error('Invalid orders data format');

                setAllOrders(data);
                setLastFetchTime(now);
                setHasFetched(true);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        },
        [user, fetchWithAuth, allOrders.length, lastFetchTime]
    );

    // Fetch only when user logs in
    useEffect(() => {
        if (user?.access) {
            fetchOrders();
        } else {
            setAllOrders([]);
            setHasFetched(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const refetchOrders = useCallback(() => {
        fetchOrders(true);
    }, [fetchOrders]);

    // --- Helper functions ---
    const getOrderById = useCallback(
        (id) => allOrders.find((o) => o.id === parseInt(id)),
        [allOrders]
    );

    const getOrdersByUser = useCallback(
        (userId) => {
            if (!userId) return [];
            return allOrders.filter((o) => {
                // Handle different user ID formats
                const orderUserId = o.user_id || o.user?.id || o.user;
                return orderUserId?.toString() === userId.toString();
            });
        },
        [allOrders]
    );

    const getOrdersByStatus = useCallback(
        (status) => allOrders.filter((o) => o.status === status),
        [allOrders]
    );

    const getCompletedOrders = useCallback(
        () => getOrdersByStatus('completed'),
        [getOrdersByStatus]
    );
    
    const getCancelledOrders = useCallback(
        () => getOrdersByStatus('cancelled'),
        [getOrdersByStatus]
    );

    const getPendingOrders = useCallback(
        () => allOrders.filter((o) => ['pending', 'preparing', 'ready'].includes(o.status)),
        [allOrders]
    );

    const getMyOrders = useCallback(() => {
        if (!user?.id) return [];
        return getOrdersByUser(user.id);
    }, [user, getOrdersByUser]);

    const value = {
        allOrders,
        loading,
        error,
        hasFetched,
        getOrderById,
        getOrdersByUser,
        getOrdersByStatus,
        getCompletedOrders,
        getCancelledOrders,
        getPendingOrders,
        getMyOrders,
        refetchOrders,
        updateOrderLocally,
    };

    return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

export const useOrders = () => {
    const context = useContext(OrdersContext);
    if (!context) throw new Error('useOrders must be used within an OrdersProvider');
    return context;
};