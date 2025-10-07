import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home.jsx';
import Category from './pages/Category.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import Account from './pages/myaccount/Account.jsx';
import Profile from './pages/myaccount/Profile.jsx';
import MyOrders from './pages/users/myorders/MyOrders.jsx';
import Wishlist from './pages/Wishlist.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import OrdersPage from './pages/admin/OrdersPage.jsx';
import OrderDetails from './pages/users/myorders/OrderDetails.jsx';
import AdminPanel from './pages/admin/AdminPanel.jsx';
import ManageItems from './pages/admin/products/ManageProducts.jsx';
import ManageOrders from './pages/admin/orders/ManageOrders.jsx';
import ManageCustomers from './pages/admin/customers/ManageCustomers.jsx';
import CustomerView from './pages/admin/customers/CustomerView.jsx';
import OrderView from './pages/admin/orders/OrderView.jsx';
import Dashboard from './pages/admin/DashBoard.jsx';

function App() {
    const { user, logout } = useAuth();

    return (
        <Router>
            <ScrollToTop />

            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/category" element={<Category />} />
                    <Route path="/category/:slug" element={<CategoryPage />} />
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
                    <Route
                        path="/my-orders"
                        element={
                            <ProtectedRoute>
                                <MyOrders />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/wishlist"
                        element={
                            <ProtectedRoute>
                                <Wishlist />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/view-orders"
                        element={
                            <ProtectedRoute adminOnly={true}>
                                <OrdersPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/my-orders/:id"
                        element={
                            <ProtectedRoute>
                                <OrderDetails />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />

                    {/* NESTED ADMIN ROUTES */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute adminOnly={true}>
                                <AdminPanel />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="products" element={<ManageItems />} />
                        <Route path="orders" element={<ManageOrders />} />
                        <Route path="customers" element={<ManageCustomers />} />
                        <Route path="sales" element={<h2>Sales Page</h2>} />
                        <Route path="settings" element={<h2>Settings Page</h2>} />
                        <Route
                            path="/admin/customers/:id"
                            element={
                                <ProtectedRoute adminOnly={true}>
                                    <CustomerView />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/orders/:id"
                            element={
                                <ProtectedRoute adminOnly={true}>
                                    <OrderView />
                                </ProtectedRoute>
                            }
                        />
                    </Route>
                </Route>
            </Routes>

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
