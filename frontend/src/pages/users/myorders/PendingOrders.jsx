// src/components/orders/PendingOrders.jsx
import { FaClock, FaCog, FaBoxOpen, FaCheckCircle } from 'react-icons/fa';

const STATUS_STEPS = [
    { key: 'pending', label: 'Pending', icon: <FaClock /> },
    { key: 'preparing', label: 'Preparing', icon: <FaCog /> },
    { key: 'ready', label: 'Ready', icon: <FaBoxOpen /> },
    { key: 'completed', label: 'Completed', icon: <FaCheckCircle /> },
];

export default function PendingOrders({ orders, cancelOrder }) {
    const getStepIndex = (status) => STATUS_STEPS.findIndex((s) => s.key === status);

    // Only show pending, preparing, or ready orders
    const visibleOrders = orders.filter(
        (order) => order.status !== 'cancelled' && order.status !== 'completed'
    );

    if (!visibleOrders.length) return (
            <div className="flex flex-col items-center justify-center mt-20 p-4">
                <div className="-mt-30">
                    <img
                        src="/img/emptyorder.png"
                        alt="Orders not found"
                        className="mb-2 h-64 w-64"
                    />
                    <p className="text-center text-lg font-semibold text-gray-600">
                        No Pending Orders
                    </p>
                </div>
            </div>
        );

    return (
        <div className="flex flex-col gap-4">
            {visibleOrders.map((order) => {
                const stepIndex = getStepIndex(order.status);

                return (
                    <div
                        key={order.id}
                        className="rounded-lg bg-white p-3 shadow-md sm:p-5 md:flex md:gap-6"
                    >
                        {/* LEFT SIDE - Order Summary */}
                        <div className="mb-5 flex-1 pr-4 md:mb-0">
                            <div className="mb-2 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold">{order.order_number}</p>
                                    <p className="text-sm text-gray-500">
                                        {order.items.length} item(s) - ₹{order.total_price}
                                    </p>
                                </div>
                                <button
                                    onClick={() => cancelOrder(order.id)}
                                    disabled={order.status === 'ready'}
                                    className={`rounded px-2 py-1 text-sm font-semibold text-white ${
                                        order.status === 'ready'
                                            ? 'cursor-not-allowed bg-gray-400'
                                            : 'bg-red-500 hover:bg-red-600'
                                    }`}
                                >
                                    Cancel
                                </button>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-5">
                                <div className="relative flex items-center justify-between">
                                    {STATUS_STEPS.map((step, idx) => {
                                        const completed = idx <= stepIndex;
                                        return (
                                            <div
                                                key={step.key}
                                                className="relative flex w-full flex-col items-center"
                                            >
                                                <div
                                                    className={`z-10 flex h-6 w-6 items-center justify-center rounded-full text-white sm:h-8 sm:w-8 ${
                                                        completed ? 'bg-green-600' : 'bg-gray-300'
                                                    }`}
                                                >
                                                    {step.icon}
                                                </div>
                                                <span className="mt-2 text-center text-xs text-gray-600">
                                                    {step.label}
                                                </span>
                                                {idx < STATUS_STEPS.length - 1 && (
                                                    <div
                                                        className={`absolute top-[0.6rem] left-1/2 h-1 w-full sm:top-3.5 ${
                                                            idx < stepIndex
                                                                ? 'bg-green-600'
                                                                : 'bg-gray-300'
                                                        }`}
                                                        style={{ zIndex: 0 }}
                                                    ></div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Dynamic Status Message */}
                                <p
                                    className={`mt-5 rounded-sm p-1 text-center text-xs font-medium sm:text-sm ${
                                        order.status === 'ready'
                                            ? 'bg-green-300/10 text-green-600'
                                            : 'text-gray-600'
                                    }`}
                                >
                                    {order.status === 'ready'
                                        ? 'Your order is ready to pickup'
                                        : "Once the order is ready, you can't cancel the order"}
                                </p>
                            </div>
                        </div>

                        {/* RIGHT SIDE - Ordered Products */}
                        <div className="flex-1">
                            <div className="rounded-md bg-violet-50 p-2">
                                <div className="max-h-60 space-y-3 overflow-y-auto pr-2">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 pb-2">
                                            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded bg-purple-200">
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
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {item.product_detail.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {item.product_detail.quantity}
                                                </p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                ₹{item.price} × {item.quantity}
                                            </p>
                                            <div className="font-semibold">
                                                ₹{item.price * item.quantity}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-2 flex items-center justify-between pt-3 text-lg font-bold">
                                <span>Total</span>
                                <span>₹{order.total_price}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
