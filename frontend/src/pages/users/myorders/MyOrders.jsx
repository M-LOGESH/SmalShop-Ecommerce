import { useEffect } from 'react';
import { useOrders } from '../../../context/OrdersContext';
import PendingOrders from './PendingOrders';
import CompletedOrders from './CompletedOrders';
import Loading from '../../../components/common/Loading';

export default function MyOrders() {
    const {
        getMyOrders,
        loading,
        hasFetched,
        refetchOrders,
        updateOrderLocally,
    } = useOrders();

    const orders = getMyOrders();

    useEffect(() => {
        // Ensures fetching if not yet fetched
        if (!hasFetched) {
            refetchOrders();
        }
    }, [hasFetched, refetchOrders]);

    const cancelOrder = async (orderId) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderId}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'cancelled' }),
                credentials: 'include', // optional, depending on your fetchWithAuth setup
            });

            if (res.ok) {
                // ✅ Instant UI update
                updateOrderLocally(orderId, 'cancelled');
            } else {
                alert('Failed to cancel order');
            }
        } catch (err) {
            console.error('Error cancelling order:', err);
        }
    };

    if (loading && !hasFetched) return <Loading />;

    if (!orders || orders.length === 0) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <div className="-mt-30">
                    <img
                        src="/img/emptyorder.png"
                        alt="Orders not found"
                        className="mb-4 h-64 w-64"
                        loading="lazy"
                    />
                    <p className="text-center text-lg font-semibold text-gray-600">
                        No Orders Found
                    </p>
                </div>
            </div>
        );
    }

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
