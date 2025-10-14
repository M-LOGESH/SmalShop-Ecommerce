import React, { useState, useMemo } from 'react';
import { FaEye, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ScrollableDropdown from '../../../components/common/ScrollableDropdown';

function OrdersTable({ orders }) {
    const navigate = useNavigate();
    const [activeMode, setActiveMode] = useState('completed'); // 'completed' or 'cancelled'
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('');

    // Memoize filtered orders
    const filteredOrders = useMemo(() => {
        return orders.filter((order) => order.status === activeMode);
    }, [orders, activeMode]);

    // Memoize order counts for better performance
    const orderCounts = useMemo(() => {
        const completedOrders = orders.filter((order) => order.status === 'completed').length;
        const cancelledOrders = orders.filter((order) => order.status === 'cancelled').length;
        return { completedOrders, cancelledOrders };
    }, [orders]);

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

    // Simple username extraction
    const getUsername = (order) => {
        return order.user || 'N/A';
    };

    // Memoize display orders with search and sort
    const displayOrders = useMemo(() => {
        let result = filteredOrders.filter((order) => {
            const orderNumber = order.order_number?.toLowerCase() || '';
            const username = getUsername(order)?.toLowerCase() || '';

            return (
                orderNumber.includes(searchTerm.toLowerCase()) ||
                username.includes(searchTerm.toLowerCase())
            );
        });

        // Sorting logic
        if (sortBy === 'date-asc') {
            result = [...result].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        } else if (sortBy === 'date-desc') {
            result = [...result].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (sortBy === 'price-asc') {
            result = [...result].sort((a, b) => (a.total_price || 0) - (b.total_price || 0));
        } else if (sortBy === 'price-desc') {
            result = [...result].sort((a, b) => (b.total_price || 0) - (a.total_price || 0));
        }

        return result;
    }, [filteredOrders, searchTerm, sortBy]);

    const handleViewOrder = (order) => {
        navigate(`/admin/orders/${order.id}`, { state: { order: order } });
    };

    if (!filteredOrders.length) {
        return (
            <div className="p-8 text-center text-gray-500">
                <div className="mb-2 text-4xl">
                    {activeMode === 'completed' ? <FaCheckCircle /> : <FaTimesCircle />}
                </div>
                <p>No {activeMode} orders found.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Mode Toggle Buttons */}
            <div className="mb-6 flex gap-2">
                <button
                    onClick={() => setActiveMode('completed')}
                    className={`flex items-center gap-2 px-4 py-2 font-medium ${
                        activeMode === 'completed'
                            ? 'border-b-2 border-green-500 text-green-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <FaCheckCircle />
                    Complete ({orderCounts.completedOrders})
                </button>
                <button
                    onClick={() => setActiveMode('cancelled')}
                    className={`flex items-center gap-2 px-4 py-2 font-medium ${
                        activeMode === 'cancelled'
                            ? 'border-b-2 border-red-500 text-red-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <FaTimesCircle />
                    Cancel ({orderCounts.cancelledOrders})
                </button>
            </div>

            {/* Search and Sort Controls */}
            <div className="mb-4 flex flex-wrap items-center gap-4">
                <input
                    type="text"
                    placeholder="Search by order number or username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="min-w-[200px] flex-1 rounded border border-gray-400 px-3 py-1 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none sm:py-2"
                />

                <ScrollableDropdown
                    options={[
                        'Newest First',
                        'Oldest First',
                        'Price: Low to High',
                        'Price: High to Low',
                    ]}
                    value={
                        sortBy === 'date-desc'
                            ? 'Newest First'
                            : sortBy === 'date-asc'
                              ? 'Oldest First'
                              : sortBy === 'price-asc'
                                ? 'Price: Low to High'
                                : sortBy === 'price-desc'
                                  ? 'Price: High to Low'
                                  : ''
                    }
                    onChange={(val) => {
                        if (val === 'Newest First') setSortBy('date-desc');
                        else if (val === 'Oldest First') setSortBy('date-asc');
                        else if (val === 'Price: Low to High') setSortBy('price-asc');
                        else if (val === 'Price: High to Low') setSortBy('price-desc');
                        else setSortBy('');
                    }}
                    placeholder="Sort by"
                    buttonPadding="px-3 py-1 sm:py-2 rounded border border-gray-400"
                    itemPadding="px-3 py-2"
                    maxHeight="12rem"
                />
            </div>

            {/* Orders Count */}
            <div className="mb-4 text-sm text-gray-600">
                Showing {displayOrders.length} of {filteredOrders.length} {activeMode} orders
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap text-gray-900">
                                Order Number
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap text-gray-900">
                                Username
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold whitespace-nowrap text-gray-900">
                                Items
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-semibold whitespace-nowrap text-gray-900">
                                Total Price
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap text-gray-900">
                                Order Date
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap text-gray-900">
                                {activeMode === 'completed' ? 'Pickup Date' : 'Cancelled Date'}
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold whitespace-nowrap text-gray-900">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {displayOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-900">
                                    {order.order_number || `ORD-${order.id}`}
                                </td>
                                <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-900">
                                    {order.user || 'N/A'}
                                </td>
                                <td className="px-4 py-3 text-center text-sm whitespace-nowrap text-gray-900">
                                    {order.items_count || order.items?.length || 0}
                                </td>
                                <td className="px-4 py-3 text-right text-sm font-semibold whitespace-nowrap text-gray-900">
                                    ₹{order.total_price || 0}
                                </td>
                                <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-900">
                                    <div className="whitespace-nowrap">
                                        <div>{formatDate(order.created_at)}</div>
                                        <div className="text-xs text-gray-500">
                                            {formatTime(order.created_at)}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-900">
                                    <div className="whitespace-nowrap">
                                        <div>{formatDate(order.updated_at)}</div>
                                        <div className="text-xs text-gray-500">
                                            {formatTime(order.updated_at)}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center whitespace-nowrap">
                                    <button
                                        onClick={() => handleViewOrder(order)}
                                        className="inline-flex items-center gap-1 rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                                    >
                                        <FaEye size={12} />
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {displayOrders.length === 0 && (
                    <div className="px-4 py-8 text-center text-gray-500">
                        No orders found matching your search criteria.
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrdersTable;
