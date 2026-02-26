import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
    const { user, fetchWithAuth } = useAuth();
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastFetchTime, setLastFetchTime] = useState(0);
    const [hasFetched, setHasFetched] = useState(false);

    const CACHE_DURATION = 5 * 60 * 1000;

    const fetchProducts = useCallback(async (force = false) => {
        const now = Date.now();

        // Return cached data if still valid
        if (!force && allProducts.length > 0 && now - lastFetchTime < CACHE_DURATION) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            let res;
            if (user?.access) {
                res = await fetchWithAuth(`${API_BASE}/api/products/`);
            } else {
                res = await fetch(`${API_BASE}/api/products/`);
            }

            if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);

            const data = await res.json();

            if (Array.isArray(data)) {
                setAllProducts(data);
                setLastFetchTime(now);
                setHasFetched(true);
            } else {
                throw new Error('Invalid products data format');
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user, fetchWithAuth, allProducts.length, lastFetchTime]);

    // Fetch products once when user changes (not on every render)
    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Refetch manually (force refresh)
    const refetchProducts = useCallback(() => {
        fetchProducts(true);
    }, [fetchProducts]);

    // Helper filters
    const getProductsByCategory = useCallback(
        (categoryName) => allProducts.filter(p => p.category?.name === categoryName),
        [allProducts]
    );

    const getProductsByCategorySlug = useCallback(
        (slug) => allProducts.filter(p => p.category?.slug === slug),
        [allProducts]
    );

    const getProductById = useCallback(
        (id) => allProducts.find(p => p.id === parseInt(id)),
        [allProducts]
    );

    const value = {
        allProducts,
        loading,
        error,
        hasFetched,
        getProductsByCategory,
        getProductsByCategorySlug,
        getProductById,
        refetchProducts
    };

    return (
        <ProductsContext.Provider value={value}>
            {children}
        </ProductsContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductsProvider');
    }
    return context;
};
