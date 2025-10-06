import React, { useState } from 'react';
import { FaCheckCircle, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ScrollableDropdown from '../../../components/ScrollableDropdown'; // adjust path

export default function CompletedOrders({ orders }) {
    const navigate = useNavigate();
    const completedOrders = orders.filter((order) => order.status === 'completed');

    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('');

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

    // Filtering
    let filteredOrders = completedOrders.filter((order) => {
        const orderNumber = order.order_number?.toLowerCase() || '';
        const orderDate = formatDate(order.updated_at).toLowerCase();

        return (
            orderNumber.includes(searchTerm.toLowerCase()) ||
            orderDate.includes(searchTerm.toLowerCase())
        );
    });

    // Sorting
    if (sortOrder === 'low-to-high') {
        filteredOrders = [...filteredOrders].sort((a, b) => a.total_price - b.total_price);
    } else if (sortOrder === 'high-to-low') {
        filteredOrders = [...filteredOrders].sort((a, b) => b.total_price - a.total_price);
    }

    if (!completedOrders.length) return <p className="text-gray-500">No completed orders.</p>;

    return (
        <div className="flex flex-col gap-2">
            {/* Header row with title + controls */}
            <div className="mt-8 mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Title */}
                <h1 className="text-xl font-bold">Orders History</h1>

                {/* Search + Filter */}
                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="min-w-[150px] flex-1 rounded border-2 border-gray-400 bg-white px-3 py-1 text-sm focus:ring focus:ring-violet-400 focus:outline-none"
                    />

                    {/* Sort using ScrollableDropdown */}
                    <ScrollableDropdown
                        options={[
                            { label: 'Low → High', value: 'low-to-high' },
                            { label: 'High → Low', value: 'high-to-low' },
                        ].map((o) => o.label)}
                        value={
                            sortOrder === 'low-to-high'
                                ? 'Low → High'
                                : sortOrder === 'high-to-low'
                                  ? 'High → Low'
                                  : ''
                        }
                        onChange={(val) => {
                            if (val === 'Low → High') setSortOrder('low-to-high');
                            else if (val === 'High → Low') setSortOrder('high-to-low');
                            else setSortOrder('');
                        }}
                        placeholder="Sort by Price"
                        allLabel="All"
                        buttonPadding="px-2 py-1 rounded border-2 border-gray-400 text-sm"
                        itemPadding="px-2 py-1"
                        maxHeight="12rem"
                    />
                </div>
            </div>

            {/* Orders list */}
            {filteredOrders.map((order) => (
                <div
                    key={order.id}
                    onClick={() => navigate(`/my-orders/${order.id}`)}
                    className="relative flex cursor-pointer items-center justify-between rounded-lg bg-white p-3 shadow-md hover:bg-gray-50 sm:p-5"
                >
                    {/* Left section */}
                    <div className="flex w-full flex-col">
                        <p className="text-sm font-semibold">{order.order_number}</p>

                        {/* Items count and Total price */}
                        <div className="w-full flex-row sm:items-center">
                            <span className="text-sm font-medium text-gray-600">
                                {order.items.length} item(s){' '}
                            </span>
                            <span className="text-sm font-bold text-gray-800 sm:absolute sm:left-1/2 sm:translate-x-[-50%] sm:text-base">
                                ₹{order.total_price}
                            </span>
                        </div>

                        {/* Picked at */}
                        <p className="mt-1 flex items-center gap-1 text-sm text-gray-700">
                            <FaCheckCircle className="text-green-600" />
                            <span>
                                Picked at {formatDate(order.updated_at)},{' '}
                                {formatTime(order.updated_at)}
                            </span>
                        </p>
                    </div>

                    {/* Right Chevron */}
                    <FaChevronRight className="ml-2 text-gray-500" />
                </div>
            ))}
        </div>
    );
}
