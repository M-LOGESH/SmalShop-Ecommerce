import { useEffect } from 'react';
import { useOrders } from '../../../context/OrdersContext';
import { useAuth } from '../../../context/AuthContext';
import PendingOrders from './PendingOrders';
import CompletedOrders from './CompletedOrders';
import Loading from '../../../components/common/Loading';
import { toast } from 'react-toastify';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function MyOrders() {
    const { 
        getMyOrders, 
        loading, 
        refetchOrders,
        updateOrderLocally,
        hasFetched
    } = useOrders();
    
    const { fetchWithAuth } = useAuth();
    const orders = getMyOrders();

    useEffect(() => {
        if (!hasFetched) {
            refetchOrders();
        }
    }, [refetchOrders, hasFetched]);

    const cancelOrder = async (orderId) => {
        try {
            const res = await fetchWithAuth(`${API_BASE}/api/orders/${orderId}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'cancelled' }),
            });
            
            if (res.ok) {
                updateOrderLocally(orderId, 'cancelled');
                toast.success('Order cancelled successfully')
            } else {
                alert('Failed to cancel order');
            }
        } catch (err) {
            console.error('Error cancelling order:', err);
        }
    };

    // Show loading only on initial load when no orders exist
    if (loading && !hasFetched) {
        return <Loading />;
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <div className="-mt-30">
                    <img
                        src="/img/emptyorder.webp"
                        alt="Orders not found"
                        className="mb-4 h-40 w-40 sm:h-64 sm:w-64"
                        loading="lazy"
                    />
                    <p className="text-center text-md sm:text-lg font-semibold text-gray-600">
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