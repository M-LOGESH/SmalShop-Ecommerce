import React from 'react';
import { useOrders } from '../../../context/OrdersContext.jsx';
import OrdersTable from './OrdersTable.jsx';

function ManageOrders() {
    const { allOrders, loading, error } = useOrders();

    if (loading) {
        return (
            <div className="flex min-h-120 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h1 className="mb-6 text-2xl font-bold">Manage Orders</h1>
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <h3 className="font-semibold text-red-800">Error Loading Orders</h3>
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold">Manage Orders</h1>
            <OrdersTable orders={allOrders} />
        </div>
    );
}

export default ManageOrders;
