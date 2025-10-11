import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import ProtectedRoute from './components/routes/ProtectedRoute.jsx';
import AdminRoute from './components/routes/AdminRoute.jsx';
import UserOnlyRoute from './components/routes/UserOnlyRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';
import Loading from './components/common/Loading.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load components
const Home = lazy(() => import('./pages/Home.jsx'));
const Category = lazy(() => import('./pages/Category.jsx'));
const CategoryPage = lazy(() => import('./pages/CategoryPage.jsx'));
const Account = lazy(() => import('./pages/myaccount/Account.jsx'));
const Profile = lazy(() => import('./pages/myaccount/Profile.jsx'));
const MyOrders = lazy(() => import('./pages/users/myorders/MyOrders.jsx'));
const Wishlist = lazy(() => import('./pages/Wishlist.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const OrdersPage = lazy(() => import('./pages/admin/OrdersPage.jsx'));
const OrderDetails = lazy(() => import('./pages/users/myorders/OrderDetails.jsx'));
const AdminPanel = lazy(() => import('./pages/admin/AdminPanel.jsx'));
const ManageItems = lazy(() => import('./pages/admin/products/ManageProducts.jsx'));
const ManageOrders = lazy(() => import('./pages/admin/orders/ManageOrders.jsx'));
const ManageCustomers = lazy(() => import('./pages/admin/customers/ManageCustomers.jsx'));
const CustomerView = lazy(() => import('./pages/admin/customers/CustomerView.jsx'));
const OrderView = lazy(() => import('./pages/admin/orders/OrderView.jsx'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const ProductView = lazy(() => import('./pages/ProductView.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function App() {
    const { user, logout } = useAuth();

    return (
        <Router>
            <ScrollToTop />
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route element={<MainLayout />}>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/category" element={<Category />} />
                        <Route path="/category/:slug" element={<CategoryPage />} />
                        <Route path="/product/:id" element={<ProductView />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />

                        {/* Protected Routes - Any Authenticated User */}
                        <Route
                            path="/account"
                            element={
                                <ProtectedRoute>
                                    <Account user={user} onLogout={logout} />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile user={user} />
                                </ProtectedRoute>
                            }
                        />

                        {/* User Only Routes - Regular Users Only */}
                        <Route
                            path="/my-orders"
                            element={
                                <UserOnlyRoute>
                                    <MyOrders />
                                </UserOnlyRoute>
                            }
                        />
                        <Route
                            path="/wishlist"
                            element={
                                <UserOnlyRoute>
                                    <Wishlist />
                                </UserOnlyRoute>
                            }
                        />
                        <Route
                            path="/my-orders/:id"
                            element={
                                <UserOnlyRoute>
                                    <OrderDetails />
                                </UserOnlyRoute>
                            }
                        />

                        {/* Admin Only Routes */}
                        <Route
                            path="/view-orders"
                            element={
                                <AdminRoute>
                                    <OrdersPage />
                                </AdminRoute>
                            }
                        />

                        {/* Nested Admin Routes */}
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminPanel />
                                </AdminRoute>
                            }
                        >
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="products" element={<ManageItems />} />
                            <Route path="orders" element={<ManageOrders />} />
                            <Route path="customers" element={<ManageCustomers />} />
                            <Route path="customers/:id" element={<CustomerView />} />
                            <Route path="orders/:id" element={<OrderView />} />
                        </Route>
                    </Route>

                    {/* 404 Page */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>

            {/* Toast Notifications */}
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover={false}
                theme="colored"
                closeButton={false}
                toastClassName={({ type }) =>
                    `flex items-center max-w-xs md:max-w-sm rounded-lg shadow-lg p-3 space-x-3
                    ${
                        type === 'success'
                            ? 'bg-green-500 text-white'
                            : type === 'error'
                              ? 'bg-red-500 text-white'
                              : 'bg-black text-white'
                    }`
                }
                containerClassName="p-2 md:p-0"
            />
        </Router>
    );
}

export default App;
