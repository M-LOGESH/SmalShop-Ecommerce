import React, { useState, useEffect } from 'react';
import { useOrders } from '../../context/OrdersContext.jsx';
import { useAdminUsers } from '../../context/AdminUsersContext.jsx';
import { useProducts } from '../../context/ProductsContext.jsx';
import {
    FaUsers,
    FaShoppingBag,
    FaRupeeSign,
    FaChartLine,
    FaBoxOpen,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaUserPlus,
    FaArrowUp,
    FaArrowDown,
    FaExclamationTriangle,
    FaCrown,
    FaStar,
} from 'react-icons/fa';

function Loading() {
    return (
        <div className="flex min-h-120 items-center justify-center bg-gray-50">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
        </div>
    );
}

function Dashboard() {
    const { allOrders, ordersLoading, hasFetched: ordersFetched } = useOrders();
    const { allUsers, loading: usersLoading, hasFetched: usersFetched } = useAdminUsers();
    const { allProducts, loading: productsLoading, hasFetched: productsFetched } = useProducts();

    const [stats, setStats] = useState({
        totalCustomers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        lowStockProducts: 0,
        newCustomers: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('week');

    // Calculate dashboard data when contexts are loaded
    useEffect(() => {
        const calculateDashboardData = () => {
            try {
                setLoading(true);

                // Use data from contexts instead of API calls
                const users = allUsers;
                const orders = allOrders;
                const products = allProducts;

                // Filter out staff and admin users
                const customers = users.filter((user) => !user.is_staff && !user.is_superuser);

                // Calculate statistics
                const totalCustomers = customers.length;
                const totalOrders = orders.length;
                const completedOrders = orders.filter(
                    (order) => order.status === 'completed'
                ).length;
                const cancelledOrders = orders.filter(
                    (order) => order.status === 'cancelled'
                ).length;
                const pendingOrders = orders.filter(
                    (order) =>
                        order.status === 'pending' ||
                        order.status === 'preparing' ||
                        order.status === 'ready'
                ).length;

                const totalRevenue = orders
                    .filter((order) => order.status === 'completed')
                    .reduce((sum, order) => sum + (Number(order.total_price) || 0), 0);

                // Calculate new customers (last 7 days)
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                const newCustomers = customers.filter(
                    (user) => new Date(user.date_joined) > oneWeekAgo
                ).length;

                // Find low stock products
                const lowStockProducts = products.filter(
                    (product) => product.stock_status === 'out_of_stock'
                ).length;

                // Get recent orders (last 5)
                const recentOrdersData = orders
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 5);

                // Calculate top products from COMPLETED orders only
                const productCount = {};
                orders
                    .filter((order) => order.status === 'completed')
                    .forEach((order) => {
                        order.items?.forEach((item) => {
                            const productId = item.product;
                            productCount[productId] =
                                (productCount[productId] || 0) + item.quantity;
                        });
                    });

                const topProductsData = Object.entries(productCount)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([productId, count]) => {
                        const product = products.find((p) => p.id.toString() === productId);
                        return {
                            id: productId,
                            name: product?.name || 'Unknown Product',
                            count: count,
                            image_url: product?.image_url,
                        };
                    });

                // Calculate top customers (by total spending from completed orders)
                const customerSpending = {};
                orders
                    .filter((order) => order.status === 'completed')
                    .forEach((order) => {
                        const username = order.user;
                        if (username) {
                            customerSpending[username] =
                                (customerSpending[username] || 0) +
                                (Number(order.total_price) || 0);
                        }
                    });

                const topCustomersData = Object.entries(customerSpending)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([username, totalSpent]) => {
                        const customer = customers.find((c) => c.username === username);
                        return {
                            username,
                            fullName: customer?.profile?.full_name || 'N/A',
                            totalSpent,
                            orderCount: orders.filter(
                                (order) => order.user === username && order.status === 'completed'
                            ).length,
                            joinDate: customer?.date_joined,
                            avatar: customer?.profile?.avatar,
                        };
                    });

                setStats({
                    totalCustomers,
                    totalOrders,
                    totalRevenue,
                    pendingOrders,
                    completedOrders,
                    cancelledOrders,
                    lowStockProducts,
                    newCustomers,
                });

                setRecentOrders(recentOrdersData);
                setTopProducts(topProductsData);
                setTopCustomers(topCustomersData);
            } catch (err) {
                console.error('Error calculating dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        // Only calculate when all contexts have data
        if (
            usersFetched &&
            !usersLoading &&
            ordersFetched &&
            !ordersLoading &&
            productsFetched &&
            !productsLoading
        ) {
            calculateDashboardData();
        }
    }, [
        allUsers,
        allOrders,
        allProducts,
        usersLoading,
        ordersLoading,
        productsLoading,
        usersFetched,
        ordersFetched,
        productsFetched,
        timeRange, // Recalculate when time range changes
    ]);

    // Show loading if any context is still loading
    if (usersLoading || ordersLoading || productsLoading) {
        return <Loading />;
    }

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    // Get rank badge color
    const getRankBadge = (rank) => {
        switch (rank) {
            case 0:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 1:
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 2:
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    // Get rank icon
    const getRankIcon = (rank) => {
        switch (rank) {
            case 0:
                return <FaCrown className="text-yellow-500" />;
            case 1:
                return <FaStar className="text-gray-500" />;
            case 2:
                return <FaStar className="text-orange-500" />;
            default:
                return <span className="text-sm font-bold">#{rank + 1}</span>;
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                </div>
                <div className="mt-4 sm:mt-0">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none"
                    >
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                        <option value="year">Last Year</option>
                    </select>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Revenue */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                            <FaRupeeSign className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(stats.totalRevenue)}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-green-600">
                        <FaArrowUp className="mr-1" />
                        <span>12% from last {timeRange}</span>
                    </div>
                </div>

                {/* Total Orders */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                            <FaShoppingBag className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-blue-600">
                        <FaArrowUp className="mr-1" />
                        <span>8% from last {timeRange}</span>
                    </div>
                </div>

                {/* Total Customers */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                            <FaUsers className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Customers</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.totalCustomers}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-green-600">
                        <FaUserPlus className="mr-1" />
                        <span>{stats.newCustomers} new this week</span>
                    </div>
                </div>

                {/* Low Stock Alert */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                            <FaExclamationTriangle className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Low Stock</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.lowStockProducts}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-orange-600">
                        <FaExclamationTriangle className="mr-1" />
                        <span>Products need restocking</span>
                    </div>
                </div>
            </div>

            {/* Rest of your component remains exactly the same... */}
            {/* Second Row - Order Status Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Completed Orders */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Completed Orders</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.completedOrders}
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                            <FaCheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Success rate</span>
                            <span className="font-medium text-green-600">
                                {stats.totalOrders > 0
                                    ? Math.round((stats.completedOrders / stats.totalOrders) * 100)
                                    : 0}
                                %
                            </span>
                        </div>
                    </div>
                </div>

                {/* Pending Orders */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.pendingOrders}
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                            <FaClock className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Need attention</span>
                            <span className="font-medium text-yellow-600">
                                {stats.totalOrders > 0
                                    ? Math.round((stats.pendingOrders / stats.totalOrders) * 100)
                                    : 0}
                                %
                            </span>
                        </div>
                    </div>
                </div>

                {/* Cancelled Orders */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Cancelled Orders</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.cancelledOrders}
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                            <FaTimesCircle className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Cancellation rate</span>
                            <span className="font-medium text-red-600">
                                {stats.totalOrders > 0
                                    ? Math.round((stats.cancelledOrders / stats.totalOrders) * 100)
                                    : 0}
                                %
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Third Row - Recent Orders, Top Products, and Top Customers */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Recent Orders */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Orders</h3>
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div
                                key={order.id}
                                className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                            >
                                <div className="flex items-center space-x-3">
                                    <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                            order.status === 'completed'
                                                ? 'bg-green-100'
                                                : order.status === 'cancelled'
                                                  ? 'bg-red-100'
                                                  : 'bg-yellow-100'
                                        }`}
                                    >
                                        <FaShoppingBag
                                            className={`h-4 w-4 ${
                                                order.status === 'completed'
                                                    ? 'text-green-600'
                                                    : order.status === 'cancelled'
                                                      ? 'text-red-600'
                                                      : 'text-yellow-600'
                                            }`}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {order.order_number}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(order.created_at)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">
                                        ₹{order.total_price?.toLocaleString('en-IN') || '0'}
                                    </p>
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                            order.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : order.status === 'cancelled'
                                                  ? 'bg-red-100 text-red-800'
                                                  : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {recentOrders.length === 0 && (
                        <div className="py-4 text-center text-gray-500">No recent orders found</div>
                    )}
                </div>

                {/* Top Products */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Top Products</h3>
                    <div className="space-y-4">
                        {topProducts.map((product, index) => (
                            <div key={product.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="h-8 w-8 rounded object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <FaBoxOpen className="h-5 w-5 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {product.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {product.count} sold
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                                        #{index + 1}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {topProducts.length === 0 && (
                        <div className="py-4 text-center text-gray-500">
                            No product data available
                        </div>
                    )}
                </div>

                {/* Top Customers */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Top Customers</h3>
                    <div className="space-y-4">
                        {topCustomers.map((customer, index) => (
                            <div
                                key={customer.username}
                                className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                            >
                                <div className="flex items-center space-x-3">
                                    <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-full ${getRankBadge(index)}`}
                                    >
                                        {getRankIcon(index)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-gray-900">
                                            {customer.fullName !== 'N/A'
                                                ? customer.fullName
                                                : customer.username}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {customer.orderCount} orders
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {formatCurrency(customer.totalSpent)}
                                    </p>
                                    <p className="text-xs text-gray-500">Total spent</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {topCustomers.length === 0 && (
                        <div className="py-4 text-center text-gray-500">
                            No customer data available
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <button
                        onClick={() => (window.location.href = '/admin/orders')}
                        className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                    >
                        <FaShoppingBag className="mb-2 h-6 w-6 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Manage Orders</span>
                    </button>
                    <button
                        onClick={() => (window.location.href = '/admin/products')}
                        className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                    >
                        <FaBoxOpen className="mb-2 h-6 w-6 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">Manage Products</span>
                    </button>
                    <button
                        onClick={() => (window.location.href = '/admin/customers')}
                        className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                    >
                        <FaUsers className="mb-2 h-6 w-6 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">View Customers</span>
                    </button>
                    <button
                        onClick={() => (window.location.href = '/admin/sales')}
                        className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                    >
                        <FaChartLine className="mb-2 h-6 w-6 text-orange-600" />
                        <span className="text-sm font-medium text-gray-700">Sales Report</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
