import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const AdminUsersContext = createContext();

export const AdminUsersProvider = ({ children }) => {
    const { fetchWithAuth, user } = useAuth();
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastFetchTime, setLastFetchTime] = useState(0);
    const [hasFetched, setHasFetched] = useState(false);

    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    const fetchInProgress = useRef(false);

    const isAdminUser = user && (user.is_staff || user.is_superuser);

    const fetchUsers = useCallback(
        async (force = false) => {
            // Prevent multiple simultaneous calls
            if (fetchInProgress.current && !force) return;
            
            // Only fetch if user is admin/staff
            if (!isAdminUser) {
                setAllUsers([]);
                setHasFetched(false);
                return;
            }

            const now = Date.now();

            // Return cached data if still valid
            if (!force && allUsers.length > 0 && now - lastFetchTime < CACHE_DURATION) {
                return;
            }

            try {
                fetchInProgress.current = true;
                setLoading(true);
                setError(null);

                const res = await fetchWithAuth('${API_BASE}/api/users/all/');

                if (!res.ok) {
                    if (res.status === 403) {
                        throw new Error('Access denied: Admin privileges required');
                    }
                    throw new Error(`Failed to fetch users: ${res.status}`);
                }

                const data = await res.json();

                if (Array.isArray(data)) {
                    setAllUsers(data);
                    setLastFetchTime(now);
                    setHasFetched(true);
                } else {
                    throw new Error('Invalid users data format');
                }
            } catch (err) {
                console.error('Error fetching users:', err);
                setError(err.message);
                setAllUsers([]);
            } finally {
                setLoading(false);
                fetchInProgress.current = false;
            }
        },
        [fetchWithAuth, isAdminUser, lastFetchTime] 
    );

    // Fetch users only when user changes to admin/staff
    useEffect(() => {
        // Only fetch if we haven't fetched recently and user is admin
        if (isAdminUser && !loading && !hasFetched) {
            fetchUsers();
        }
    }, [fetchUsers, isAdminUser, loading, hasFetched]);

    // Refetch manually
    const refetchUsers = useCallback(() => {
        if (isAdminUser) {
            fetchUsers(true);
        }
    }, [fetchUsers, isAdminUser]);

    // Helper functions - return empty for non-admin users
    const getUserById = useCallback(
        (id) => (isAdminUser ? allUsers.find((u) => u.id === parseInt(id)) : null),
        [allUsers, isAdminUser]
    );

    const getUserByUsername = useCallback(
        (username) => (isAdminUser ? allUsers.find((u) => u.username === username) : null),
        [allUsers, isAdminUser]
    );

    const getCustomers = useCallback(
        () => (isAdminUser ? allUsers.filter((u) => !u.is_staff && !u.is_superuser) : []),
        [allUsers, isAdminUser]
    );

    const getStaff = useCallback(
        () => (isAdminUser ? allUsers.filter((u) => u.is_staff || u.is_superuser) : []),
        [allUsers, isAdminUser]
    );

    const value = {
        allUsers: isAdminUser ? allUsers : [],
        loading: isAdminUser ? loading : false,
        error: isAdminUser ? error : null,
        hasFetched: isAdminUser ? hasFetched : false,
        getUserById,
        getUserByUsername,
        getCustomers,
        getStaff,
        refetchUsers,
        isAdminAccess: !!isAdminUser,
    };

    return <AdminUsersContext.Provider value={value}>{children}</AdminUsersContext.Provider>;
};

export const useAdminUsers = () => {
    const context = useContext(AdminUsersContext);
    if (!context) {
        throw new Error('useAdminUsers must be used within a AdminUsersProvider');
    }
    return context;
};