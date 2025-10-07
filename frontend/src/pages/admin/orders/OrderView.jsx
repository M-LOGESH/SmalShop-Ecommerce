import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import {
    FaArrowLeft,
    FaShoppingBag,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaCalendar,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaBox,
    FaRupeeSign,
} from 'react-icons/fa';

function OrderView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchWithAuth } = useAuth();

    const [order, setOrder] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch order details and customer information
    useEffect(() => {
        const loadOrderData = async () => {
            try {
                setLoading(true);
                setError('');

                // Fetch order details
                const orderRes = await fetchWithAuth(`http://127.0.0.1:8000/api/orders/${id}/`);
                if (!orderRes.ok) {
                    throw new Error('Failed to load order details');
                }
                const orderData = await orderRes.json();
                setOrder(orderData);

                // Try to fetch customer details from all users endpoint
                try {
                    const allUsersRes = await fetchWithAuth('http://127.0.0.1:8000/api/users/all/');
                    if (allUsersRes.ok) {
                        const allUsers = await allUsersRes.json();
                        
                        // Find customer by username (since order.user contains username)
                        const foundCustomer = allUsers.find(user => 
                            user.username === orderData.user || 
                            user.id?.toString() === orderData.user?.toString()
                        );
                        
                        if (foundCustomer) {
                            setCustomer(foundCustomer);
                        } else {
                            console.log('Customer not found in users list');
                        }
                    }
                } catch (customerError) {
                    console.warn('Could not load customer details:', customerError);
                    // Continue without customer details
                }

            } catch (err) {
                console.error('Error loading order data:', err);
                setError(`Failed to load order details: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadOrderData();
        }
    }, [id, fetchWithAuth]);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch (error) {
            return 'Invalid date';
        }
    };

    // Format time for display
    const formatTime = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });
        } catch (error) {
            return 'Invalid time';
        }
    };

    // Get status badge color
    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'preparing':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'ready':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <div className="text-gray-500">Loading order details...</div>
            </div>
        );
    }

    if (error && !order) {
        return (
            <div className="mx-auto max-w-2xl">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-violet-600 hover:text-violet-700"
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
                </div>

                <div className="rounded-lg border border-red-200 bg-red-50 p-6">
                    <h3 className="mb-2 text-lg font-semibold text-red-800">
                        Error Loading Order
                    </h3>
                    <p className="mb-4 text-red-600">{error}</p>
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    >
                        Return to Orders
                    </button>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p>Order not found.</p>
                <button
                    onClick={() => navigate('/admin/orders')}
                    className="mt-3 rounded bg-violet-500 px-4 py-2 text-white hover:bg-violet-600"
                >
                    Go Back to Orders
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-violet-600 hover:text-violet-700"
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
                </div>
                {error && (
                    <div className="mt-2 rounded bg-orange-50 px-3 py-1 text-sm text-orange-600">
                        Some data may be incomplete
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Order Information - Left Column */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Order Summary */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                            <FaShoppingBag className="text-violet-500" />
                            Order Summary
                        </h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Order Number
                                </label>
                                <p className="font-medium text-gray-900">{order.order_number}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Status
                                </label>
                                <span className={`inline-flex items-center rounded-full border px-2 py-1 ml-3  text-sm font-medium ${getStatusBadge(order.status)}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Total Amount
                                </label>
                                <p className="text-xl font-bold text-gray-900">
                                    ₹{order.total_price?.toLocaleString('en-IN', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }) || '0.00'}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Items Count
                                </label>
                                <p className="font-medium text-gray-900">
                                    {order.items?.length || 0} items
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Timeline */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                            <FaClock className="text-violet-500" />
                            Order Timeline
                        </h2>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <div className="flex items-center gap-3">
                                    <FaCalendar className="text-gray-400" />
                                    <div>
                                        <p className="font-medium text-gray-900">Order Placed</p>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(order.created_at)}, {formatTime(order.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <div className="flex items-center gap-3">
                                    {order.status === 'completed' ? (
                                        <FaCheckCircle className="text-green-500" />
                                    ) : order.status === 'cancelled' ? (
                                        <FaTimesCircle className="text-red-500" />
                                    ) : (
                                        <FaClock className="text-blue-500" />
                                    )}
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {order.status === 'completed' ? 'Completed' : 
                                             order.status === 'cancelled' ? 'Cancelled' : 'Last Updated'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(order.updated_at)}, {formatTime(order.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                            <FaUser className="text-violet-500" />
                            Customer Information
                        </h2>

                        {customer ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Username
                                    </label>
                                    <p className="font-medium text-gray-900">{customer.username}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Full Name
                                    </label>
                                    <p className="text-gray-900">
                                        {customer.profile?.full_name || 'Not provided'}
                                    </p>
                                </div>

                                <div>
                                    <label className="flex items-center gap-1 text-sm font-medium text-gray-500">
                                        <FaEnvelope className="text-gray-400" />
                                        Email
                                    </label>
                                    <p className="text-gray-900">{customer.email || 'Not provided'}</p>
                                </div>

                                <div>
                                    <label className="flex items-center gap-1 text-sm font-medium text-gray-500">
                                        <FaPhone className="text-gray-400" />
                                        Phone
                                    </label>
                                    <p className="text-gray-900">
                                        {customer.profile?.mobile || 'Not provided'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="text-center text-gray-500 py-2">
                                    Customer details not available
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Basic Customer Info</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Username:</span>
                                            <span className="text-sm font-medium">{order.user || 'N/A'}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Full customer profile not available in the system
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Items - Right Column */}
                <div className="space-y-6">
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                            <FaBox className="text-violet-500" />
                            Order Items
                        </h2>

                        {/* Scrollable Order Items Container */}
                        <div className="max-h-96 space-y-3 overflow-y-auto rounded-lg bg-gray-50 p-3">
                            {order.items?.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
                                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded bg-gray-100">
                                        {item.product_detail?.image ? (
                                            <img
                                                src={item.product_detail.image}
                                                alt={item.product_detail.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <FaBox className="text-gray-400" size={16} />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate text-sm">
                                            {item.product_detail?.name || 'Product'}
                                        </p>
                                        <div className="flex items-center gap-4 mt-1">
                                            <p className="text-xs text-gray-500">
                                                Qty: {item.quantity}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                ₹{item.price} each
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-semibold text-gray-900 text-sm">
                                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Total - Fixed at bottom */}
                        <div className="mt-4 border-t border-gray-200 pt-4">
                            <div className="flex justify-between text-lg font-semibold">
                                <span>Total Amount</span>
                                <span className="flex items-center gap-1">
                                    <FaRupeeSign className="text-gray-500" size={14} />
                                    {order.total_price?.toLocaleString('en-IN', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }) || '0.00'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderView;