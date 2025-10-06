// src/pages/orders/OrderDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import MobileHeader from '../../../components/header/MobileHeader';
import {
    FaShoppingCart,
    FaClock,
    FaCog,
    FaBoxOpen,
    FaCheckCircle,
    FaMapMarkerAlt,
    FaHistory,
    FaRegCalendarCheck,
} from 'react-icons/fa';

const STATUS_STEPS = [
    { key: 'ordered', label: 'Ordered', icon: <FaShoppingCart /> },
    { key: 'pending', label: 'Pending', icon: <FaClock /> },
    { key: 'preparing', label: 'Preparing', icon: <FaCog /> },
    { key: 'ready', label: 'Ready', icon: <FaBoxOpen /> },
    { key: 'completed', label: 'Completed', icon: <FaCheckCircle /> },
];

export default function OrderDetails() {
    const { id } = useParams();
    const { fetchWithAuth } = useAuth();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const loadOrder = async () => {
            try {
                const res = await fetchWithAuth(`http://127.0.0.1:8000/api/orders/${id}/`);
                if (!res.ok) throw new Error('Failed to fetch order');
                const data = await res.json();
                setOrder(data);
            } catch (err) {
                console.error('Error fetching order:', err);
            }
        };
        loadOrder();
    }, [id, fetchWithAuth]);

    if (!order) return <p className="p-4 min-h-screen">Loading order details...</p>;

    // Adjust stepIndex: completed includes "ordered" as first step
    const stepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status) + 1;

    const formatDate = (isoString) => {
        if (!isoString) return '-';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatTime = (isoString) => {
        if (!isoString) return '-';
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    return (
        <div className="mx-auto max-w-6xl min-h-screen">
            <MobileHeader title="My Orders" />
            <div className="p-3 sm:p-6 md:flex md:gap-6">
                {/* LEFT SIDE */}
                <div className="flex-1 space-y-2 sm:space-y-4">
                    {/* Box 1: Order Summary + Progress Bar */}
                    <div className="rounded-lg bg-white p-4 pb-6 shadow sm:pb-10">
                        <h2 className="text-md mb-2 font-bold sm:text-lg">{order.order_number}</h2>
                        <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
                        <p className="mt-2 text-base font-semibold">₹{order.total_price}</p>

                        {/* Progress Bar */}
                        <div className="relative mt-6 flex items-center justify-between">
                            {STATUS_STEPS.map((step, idx) => {
                                const completed = idx < stepIndex;
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
                                        <span className="text-2xs mt-2 text-center text-gray-600 sm:text-xs">
                                            {step.label}
                                        </span>
                                        {idx < STATUS_STEPS.length - 1 && (
                                            <div
                                                className={`absolute top-[0.6rem] left-1/2 h-1 w-full sm:top-3.5 ${
                                                    idx < stepIndex - 1
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
                    </div>

                    {/* Box 2: Order Times + User & Pickup Info */}
                    <div className="space-y-4 rounded-lg bg-white p-3 shadow sm:p-4">
                        {/* Order Placed */}
                        <div className="flex items-center gap-2">
                            <FaHistory className="text-gray-500" />
                            <p className="text-sm text-gray-700">
                                <span className="font-semibold">Order Placed -</span>{' '}
                                {formatDate(order.created_at)}, {formatTime(order.created_at)}
                            </p>
                        </div>

                        {/* Picked */}
                        <div className="flex items-center gap-2">
                            <FaRegCalendarCheck className="text-gray-500" />
                            <p className="text-sm text-gray-700">
                                <span className="font-semibold">Picked -</span>{' '}
                                {formatDate(order.updated_at)}, {formatTime(order.updated_at)}
                            </p>
                        </div>

                        {/* Shop Info */}
                        <div className="flex flex-wrap items-start gap-2 sm:flex-nowrap">
                            {/* Icon + Label */}
                            <div className="flex w-24 flex-col items-start gap-1">
                                <div className="flex items-center gap-1">
                                    <FaMapMarkerAlt className="text-gray-500" />
                                    <span className="text-sm font-semibold">Shop info :</span>
                                </div>
                            </div>

                            {/* Shop Details */}
                            <div className="flex flex-1 flex-col text-sm text-gray-700 sm:flex-row sm:flex-wrap sm:gap-1">
                                <span>SmallShop,</span>
                                <span>Solaialaupuram 1st Street,</span>
                                <span>Madurai-625011.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE - Product Details */}
                <div className="flex-1">
                    <div className="rounded-lg p-4 shadow">
                        <h3 className="mb-3 font-medium">Products Details</h3>
                        <div className="max-h-80 space-y-3 overflow-y-auto bg-violet-50 p-2">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 pb-2">
                                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded bg-purple-200">
                                        {item.product_detail?.image ? (
                                            <img
                                                src={item.product_detail.image}
                                                alt={item.product_detail.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xs text-gray-400">No Img</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{item.product_detail?.name}</p>
                                        <p className="text-sm text-gray-500">
                                            Qty: {item.quantity}
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
                        <div className="mt-3 flex items-center justify-between pt-3 text-lg font-semibold">
                            <span>Total amount</span>
                            <span>₹{order.total_price}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
