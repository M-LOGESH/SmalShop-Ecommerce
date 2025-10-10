import React, { useState } from 'react';
import { useOrders } from '../../context/OrdersContext';
import Loading from '../../components/common/Loading';

const STATUS_STEPS = ['pending', 'preparing', 'ready'];

function OrderPage() {
    const { allOrders, loading: ordersLoading, refetchOrders } = useOrders();
    const [category, setCategory] = useState('Prep');
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    const updateStatus = async (orderId, newStatus) => {
        try {
            setUpdatingOrderId(orderId);
            const res = await fetchWithAuth(`http://127.0.0.1:8000/api/orders/${orderId}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                // Refresh orders from context instead of reloading all data
                refetchOrders();
            } else {
                alert('Failed to update status');
            }
        } catch (err) {
            console.error('Error updating status:', err);
        } finally {
            setUpdatingOrderId(null);
        }
    };

    if (ordersLoading) return <Loading />;

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Calculate order counts for each tab
    const prepOrdersCount = allOrders.filter((order) =>
        ['pending', 'preparing'].includes(order.status)
    ).length;
    const pickupOrdersCount = allOrders.filter((order) => order.status === 'ready').length;
    const cancelledOrdersCount = allOrders.filter((order) => {
        const orderDate = order.updated_at?.split('T')[0] || order.created_at?.split('T')[0];
        return order.status === 'cancelled' && orderDate === today;
    }).length;

    const filteredOrders = allOrders
        .filter((order) => {
            if (category === 'Prep') return ['pending', 'preparing'].includes(order.status);
            if (category === 'Pickup') return order.status === 'ready';
            if (category === 'cancelled') {
                // Only today's cancelled orders - check both updated_at and created_at
                const orderDate =
                    order.updated_at?.split('T')[0] || order.created_at?.split('T')[0];
                return order.status === 'cancelled' && orderDate === today;
            }
            return true;
        })
        .sort((a, b) => a.id - b.id);

    return (
        <div className="mx-auto min-h-screen max-w-4xl">
            <div className="p-4 md:p-8">
                <h1 className="mb-6 hidden text-2xl font-bold sm:block">Manage Orders</h1>

                {/* Tabs */}
                <div className="mb-6 flex flex-wrap gap-3">
                    {[
                        { key: 'Prep', label: 'Prep', count: prepOrdersCount },
                        { key: 'Pickup', label: 'Pickup', count: pickupOrdersCount },
                        { key: 'cancelled', label: 'Cancel', count: cancelledOrdersCount },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setCategory(tab.key)}
                            className={`text-md flex items-center gap-2 rounded-lg px-2 py-2 font-medium transition sm:px-4 ${
                                category === tab.key
                                    ? 'bg-violet-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            <span>{tab.label}</span>
                            <span
                                className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold sm:h-6 sm:w-6 sm:text-sm ${
                                    category === tab.key
                                        ? 'bg-white text-violet-600'
                                        : 'bg-gray-500 text-white'
                                }`}
                            >
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {filteredOrders.length === 0 ? (
                    <p className="text-gray-500">No {category} orders.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="rounded-lg bg-white p-4 shadow md:p-6">
                                {/* Order Header */}
                                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="text-lg font-semibold">
                                            {order.order_number}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {order.items.length} item(s) - ₹{order.total_price}
                                        </p>
                                    </div>

                                    {/* Pickup Orders → Mark as Completed & Cancel buttons */}
                                    {category === 'Pickup' && order.status === 'ready' && (
                                        <div className="mt-2 flex gap-2 md:mt-0">
                                            <button
                                                onClick={() => updateStatus(order.id, 'completed')}
                                                disabled={updatingOrderId === order.id}
                                                className="rounded bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {updatingOrderId === order.id
                                                    ? 'Updating...'
                                                    : 'Completed'}
                                            </button>
                                            <button
                                                onClick={() => updateStatus(order.id, 'cancelled')}
                                                disabled={updatingOrderId === order.id}
                                                className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {updatingOrderId === order.id
                                                    ? 'Updating...'
                                                    : 'Cancel'}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Prep Orders → Progress Bar */}
                                {category === 'Prep' && (
                                    <div className="relative mb-8 flex items-center justify-between">
                                        {/* Base line */}
                                        <div className="absolute top-2/7 right-5 left-5 h-0.5 bg-gray-300 sm:top-2/6"></div>

                                        {/* Progress line */}
                                        <div
                                            className="absolute top-2/7 left-5 h-0.5 bg-violet-600 transition-all duration-500 sm:top-2/6"
                                            style={{
                                                width: `calc(${
                                                    (STATUS_STEPS.indexOf(order.status) /
                                                        (STATUS_STEPS.length - 1)) *
                                                    100
                                                }% - 0px)`,
                                            }}
                                        ></div>

                                        {STATUS_STEPS.map((step, idx) => {
                                            const isActive =
                                                STATUS_STEPS.indexOf(order.status) >= idx;
                                            const isUpdating = updatingOrderId === order.id;
                                            return (
                                                <div
                                                    key={step}
                                                    onClick={() =>
                                                        !isUpdating && updateStatus(order.id, step)
                                                    }
                                                    className={`relative z-10 flex flex-col items-center text-sm font-medium ${
                                                        isUpdating
                                                            ? 'cursor-not-allowed opacity-50'
                                                            : 'cursor-pointer'
                                                    }`}
                                                >
                                                    <div
                                                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition sm:h-10 sm:w-10 ${
                                                            isActive
                                                                ? 'border-violet-600 bg-violet-600 text-white'
                                                                : 'border-gray-300 bg-white text-gray-400'
                                                        }`}
                                                    >
                                                        {idx + 1}
                                                    </div>
                                                    <span
                                                        className={`mt-2 capitalize ${
                                                            isActive
                                                                ? 'text-violet-600'
                                                                : 'text-gray-400'
                                                        }`}
                                                    >
                                                        {step}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Products */}
                                <ul className="mb-4 space-y-4 border-t border-gray-200 pt-3">
                                    {order.items.map((item) => (
                                        <li
                                            key={item.id}
                                            className="flex flex-wrap items-center justify-between gap-2"
                                        >
                                            <div className="flex min-w-[150px] flex-1 items-center gap-4">
                                                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded bg-gray-200">
                                                    {item.product_detail.image ? (
                                                        <img
                                                            src={item.product_detail.image}
                                                            alt={item.product_detail.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-gray-400">
                                                            No Img
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        {item.product_detail.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {item.product_detail.quantity}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Center: quantity */}
                                            <div className="hidden w-12 text-center font-medium sm:block">
                                                {item.quantity}
                                            </div>

                                            {/* Right: price × quantity */}
                                            <div className="flex-1 text-right text-sm font-medium md:text-base">
                                                ₹{item.price} × {item.quantity} = ₹
                                                {item.price * item.quantity}
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold">
                                    <span>Total</span>
                                    <span>₹{order.total_price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderPage;
