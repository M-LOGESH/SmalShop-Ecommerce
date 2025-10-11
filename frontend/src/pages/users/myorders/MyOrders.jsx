import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import PendingOrders from './PendingOrders';
import CompletedOrders from './CompletedOrders';
import Loading from '../../../components/common/Loading';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function MyOrders() {
    const { user, fetchWithAuth } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const res = await fetchWithAuth('${API_BASE}/api/orders/');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            } else {
                setOrders([]);
            }
        } catch (err) {
            console.error('Error loading orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (orderId) => {
        try {
            const res = await fetchWithAuth(`${API_BASE}/api/orders/${orderId}/`, {
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

    if (!user)
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <div className="-mt-30">
                    <img
                        src="/src/assets/img/emptyorder.png"
                        alt="Login required"
                        className="mb-4 h-64 w-64"
                    />
                    <p className="text-center text-lg font-semibold text-gray-600">
                        Login to view your orders
                    </p>
                </div>
            </div>
        );

    if (loading) {
        return <Loading />;
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <div className="-mt-30">
                    <img
                        src="/src/assets/img/emptyorder.png"
                        alt="Orders not found"
                        className="mb-4 h-64 w-64"
                    />
                    <p className="text-center text-lg font-semibold text-gray-600">
                        No Orders Found
                    </p>
                </div>
            </div>
        );
    }

    // Orders available
    return (
        <div className="flex min-h-screen justify-center bg-gray-100">
            <div className="w-full max-w-6xl">
                <div className="p-4 md:p-8">
                    <h1 className="mb-6 hidden text-xl font-bold sm:block">My Orders</h1>
                    <PendingOrders orders={orders} cancelOrder={cancelOrder} />
                    <h1 className="pt-10 text-xl font-bold">Orders History</h1>
                    <CompletedOrders orders={orders} />
                </div>
            </div>
        </div>
    );
}
