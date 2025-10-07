import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';
import OrdersTable from './OrdersTable.jsx';

function ManageOrders() {
    const { fetchWithAuth, user } = useAuth();
    const [ordersData, setOrdersData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch orders data
    useEffect(() => {
        const loadOrders = async () => {
            try {
                const res = await fetchWithAuth('http://127.0.0.1:8000/api/orders/');
                if (res.ok) {
                    const data = await res.json();
                    setOrdersData(data);
                }
            } catch (err) {
                console.error('Error loading orders:', err);
            } finally {
                setLoading(false);
            }
        };
        
        loadOrders();
    }, [fetchWithAuth]);

    if (loading) {
        return <div>Loading orders...</div>;
    }

    return (
        <div >
            <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
            <OrdersTable orders={ordersData} user={user} />
        </div>
    );
}

export default ManageOrders;