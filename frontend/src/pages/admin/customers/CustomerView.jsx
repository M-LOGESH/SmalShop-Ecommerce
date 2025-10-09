import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import {
    FaArrowLeft,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaVenusMars,
    FaCalendar,
    FaMapMarkerAlt,
    FaShoppingBag,
    FaCheckCircle,
    FaTimesCircle,
    FaRupeeSign,
} from 'react-icons/fa';

function CustomerView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { fetchWithAuth } = useAuth();

    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Calculate order statistics
    const calculateOrderStats = (orders) => {
        const completedOrders = orders.filter((order) => order.status === 'completed');
        const cancelledOrders = orders.filter((order) => order.status === 'cancelled');

        // Fix: Ensure we're working with numbers, not strings
        const totalCompletedPrice = completedOrders.reduce((sum, order) => {
            // Convert to number and handle potential string values
            const price = Number(order.total_price) || 0;
            return sum + price;
        }, 0);

        return {
            completedCount: completedOrders.length,
            cancelledCount: cancelledOrders.length,
            totalCompletedPrice: totalCompletedPrice,
            totalOrders: orders.length,
        };
    };

    // Fetch customer details and their orders
    useEffect(() => {
        const loadCustomerData = async () => {
            try {
                setLoading(true);
                setError('');

                // Option 1: Get customer data from navigation state (passed from CustomersTable)
                if (location.state?.customer) {
                    setCustomer(location.state.customer);
                } else {
                    // Option 2: Try to fetch from all users endpoint
                    try {
                        const allUsersRes = await fetchWithAuth(
                            'http://127.0.0.1:8000/api/users/all/'
                        );
                        if (allUsersRes.ok) {
                            const allUsers = await allUsersRes.json();
                            const foundCustomer = allUsers.find(
                                (user) => user.id.toString() === id
                            );
                            if (foundCustomer) {
                                setCustomer(foundCustomer);
                            } else {
                                throw new Error('Customer not found in users list');
                            }
                        } else {
                            throw new Error('Failed to load users data');
                        }
                    } catch (apiError) {
                        console.warn('Users API failed:', apiError);
                        throw new Error('Could not load customer details');
                    }
                }

                // Fetch ALL orders and filter by user
                let ordersData = [];
                try {
                    const allOrdersRes = await fetchWithAuth('http://127.0.0.1:8000/api/orders/');
                    if (allOrdersRes.ok) {
                        const allOrders = await allOrdersRes.json();

                        // Filter orders by user - based on your actual Order model structure
                        ordersData = allOrders.filter((order) => {
                            // Check different possible user identifier fields
                            return (
                                order.user?.toString() === id ||
                                (order.user &&
                                    typeof order.user === 'object' &&
                                    order.user.id?.toString() === id) ||
                                order.user === customer?.username ||
                                order.user_id?.toString() === id
                            );
                        });
                    } else {
                        console.warn('Failed to load orders, continuing without order data');
                    }
                } catch (ordersError) {
                    console.warn('Error loading orders:', ordersError);
                    // Continue without orders data - this is not critical
                }

                setOrders(ordersData);
            } catch (err) {
                console.error('Error loading customer data:', err);
                setError(`Failed to load customer details: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadCustomerData();
        }
    }, [id, fetchWithAuth, location.state, customer?.username]);

    // Calculate age from date of birth
    const calculateAge = (dobString) => {
        if (!dobString) return '-';
        try {
            const dob = new Date(dobString);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            return age;
        } catch (error) {
            return '-';
        }
    };

    // Format date for display with short month names
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

    if (loading) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <div className="text-gray-500">Loading customer details...</div>
            </div>
        );
    }

    if (error && !customer) {
        return (
            <div className="mx-auto max-w-2xl">
                <button
                    onClick={() => navigate('/admin/customers')}
                    className="mb-6 flex items-center gap-2 text-violet-600 hover:text-violet-700"
                >
                    <FaArrowLeft />
                    Back to Customers
                </button>

                <div className="rounded-lg border border-red-200 bg-red-50 p-6">
                    <h3 className="mb-2 text-lg font-semibold text-red-800">
                        Error Loading Customer
                    </h3>
                    <p className="mb-4 text-red-600">{error}</p>
                    <div className="mb-4 text-sm text-red-500">
                        <p>This might be due to:</p>
                        <ul className="mt-2 list-inside list-disc space-y-1">
                            <li>Customer ID does not exist</li>
                            <li>Network connectivity issue</li>
                            <li>API endpoint unavailable</li>
                        </ul>
                    </div>
                    <button
                        onClick={() => navigate('/admin/customers')}
                        className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    >
                        Return to Customers List
                    </button>
                </div>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p>Customer not found.</p>
                <button
                    onClick={() => navigate('/admin/customers')}
                    className="mt-3 rounded bg-violet-500 px-4 py-2 text-white hover:bg-violet-600"
                >
                    Go Back to Customers
                </button>
            </div>
        );
    }

    const stats = calculateOrderStats(orders);

    return (
        <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-violet-600 hover:text-violet-700"
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
                </div>
                {error && (
                    <div className="mt-2 rounded bg-orange-50 px-3 py-1 text-sm text-orange-600">
                        Some data may be incomplete
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Customer Information and Order Statistics Side by Side */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Customer Information Card - Takes 2/3 width */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Personal Information */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                <FaUser className="text-violet-500" />
                                Personal Information
                            </h2>

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

                                <div>
                                    <label className="flex items-center gap-1 text-sm font-medium text-gray-500">
                                        <FaVenusMars className="text-gray-400" />
                                        Gender
                                    </label>
                                    <p className="text-gray-900 capitalize">
                                        {customer.profile?.gender || 'Not provided'}
                                    </p>
                                </div>

                                <div>
                                    <label className="flex items-center gap-1 text-sm font-medium text-gray-500">
                                        <FaCalendar className="text-gray-400" />
                                        Date of Birth
                                    </label>
                                    <p className="text-gray-900">
                                        {customer.profile?.dob ? (
                                            <>
                                                {formatDate(customer.profile.dob)}
                                                <span className="ml-2 text-sm text-gray-500">
                                                    ({calculateAge(customer.profile.dob)} years)
                                                </span>
                                            </>
                                        ) : (
                                            'Not provided'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                <FaMapMarkerAlt className="text-violet-500" />
                                Address Information
                            </h2>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Address</label>
                                    <p className="text-gray-900">
                                        {customer.profile?.address || 'Not provided'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Statistics Card - Takes 1/3 width */}
                    <div className="space-y-6">
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                <FaShoppingBag className="text-violet-500" />
                                Order Statistics
                            </h2>

                            <div className="space-y-4">
                                {/* Completed Orders */}
                                <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                                    <div className="flex items-center gap-3">
                                        <FaCheckCircle className="text-xl text-green-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">
                                                Completed Orders
                                            </p>
                                            <p className="text-2xl font-bold text-green-600">
                                                {stats.completedCount}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Cancelled Orders */}
                                <div className="flex items-center justify-between rounded-lg bg-red-50 p-3">
                                    <div className="flex items-center gap-3">
                                        <FaTimesCircle className="text-xl text-red-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">
                                                Cancelled Orders
                                            </p>
                                            <p className="text-2xl font-bold text-red-600">
                                                {stats.cancelledCount}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Total Spent - FIXED DISPLAY */}
                                <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                                    <div className="flex items-center gap-3">
                                        <FaRupeeSign className="text-xl text-blue-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">
                                                Total Spent
                                            </p>
                                            <p className="text-2xl font-bold text-blue-600">
                                                ₹
                                                {typeof stats.totalCompletedPrice === 'number'
                                                    ? stats.totalCompletedPrice.toLocaleString(
                                                          'en-IN',
                                                          {
                                                              minimumFractionDigits: 2,
                                                              maximumFractionDigits: 2,
                                                          }
                                                      )
                                                    : '0.00'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Total Orders */}
                                <div className="flex items-center justify-between rounded-lg bg-purple-50 p-3">
                                    <div className="flex items-center gap-3">
                                        <FaShoppingBag className="text-xl text-purple-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">
                                                Total Orders
                                            </p>
                                            <p className="text-2xl font-bold text-purple-600">
                                                {stats.totalOrders}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {orders.length === 0 && (
                                <div className="mt-4 text-center text-sm text-gray-500">
                                    No order data available for this customer
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Account Information - Now at the bottom */}
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h2 className="mb-4 text-lg font-semibold">Account Information</h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="flex justify-between md:block">
                            <span className="text-gray-600">User ID: </span>
                            <span className="font-medium">{customer.id}</span>
                        </div>
                        <div className="flex justify-between md:block">
                            <span className="text-gray-600">Joined: </span>
                            <span className="font-medium">
                                {formatDate(customer.date_joined)}
                            </span>
                        </div>
                        <div className="flex justify-between md:block">
                            <span className="text-gray-600">Account Type: </span>
                            <span
                                className={`font-medium ${
                                    customer.is_superuser
                                        ? 'text-red-600'
                                        : customer.is_staff
                                          ? 'text-purple-600'
                                          : 'text-blue-600'
                                }`}
                            >
                                {customer.is_superuser
                                    ? 'Admin'
                                    : customer.is_staff
                                      ? 'Staff'
                                      : 'Customer'}
                            </span>
                        </div>
                        <div className="flex justify-between md:block">
                            <span className="text-gray-600">Account Status: </span>
                            <span
                                className={`font-medium ${
                                    customer.is_active ? 'text-red-600' : 'text-green-600'
                                }`}
                            >
                                {customer.is_active ? 'Inactive' : 'Active'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerView;