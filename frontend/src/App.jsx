import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Loading from './components/Loading.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
const Dashboard = lazy(() => import('./pages/admin/DashBoard.jsx'));
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
                        <Route path="/" element={<Home />} />
                        <Route path="/category" element={<Category />} />
                        <Route path="/category/:slug" element={<CategoryPage />} />
                        <Route path="/product/:id" element={<ProductView />} />
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
                                    <MyOrders />                           
                            }
                        />
                        <Route
                            path="/wishlist"
                            element={                            
                                    <Wishlist />                            
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
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>

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