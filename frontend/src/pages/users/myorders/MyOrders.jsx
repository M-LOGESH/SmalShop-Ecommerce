import { useEffect, useState } from 'react';
import MobileHeader from '../../../components/header/MobileHeader';
import { useAuth } from '../../../context/AuthContext';
import PendingOrders from './PendingOrders';
import CompletedOrders from './CompletedOrders';

export default function MyOrders() {
    const { fetchWithAuth } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const res = await fetchWithAuth('http://127.0.0.1:8000/api/orders/');
            if (res.ok) setOrders(await res.json());
        } catch (err) {
            console.error('Error loading orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (orderId) => {
        try {
            const res = await fetchWithAuth(`http://127.0.0.1:8000/api/orders/${orderId}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'cancelled' }),
            });
            if (res.ok) loadOrders();
            else alert('Failed to cancel order');
        } catch (err) {
            console.error('Error cancelling order:', err);
        }
    };

    return (
        <div className="flex min-h-screen justify-center bg-gray-100">
            <div className="w-full max-w-6xl">
                <MobileHeader title="My Orders" />
                <div className="p-4 md:p-8">
                    <h1 className="mb-6 text-xl font-bold">My Orders</h1>
                    {loading ? (
                        <p className="text-gray-500">Loading orders...</p>
                    ) : (
                        <PendingOrders orders={orders} cancelOrder={cancelOrder} />
                    )}
                    <h1 className="mt-8 mb-6 text-xl font-bold">Completed Orders</h1>
                    <CompletedOrders orders={orders} />
                </div>
            </div>
        </div>
    );
}
