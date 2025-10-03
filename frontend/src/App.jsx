import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/header/Header.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import Navbar from './components/Navbar.jsx';

import Home from './pages/Home.jsx';
import Category from './pages/Category.jsx';
import CategoryPage from './pages/CategoryPage.jsx';

import Account from './pages/myaccount/Account.jsx';
import Profile from './pages/myaccount/Profile.jsx';
import Orders from './pages/Orders.jsx';
import Wishlist from './pages/Wishlist.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';

import AdminPanel from './pages/admin/AdminPanel.jsx';
import ManageItems from './pages/admin/products/ManageProducts.jsx';

function App() {
    const [showRegister, setShowRegister] = useState(() => {
        return localStorage.getItem('showRegister') === 'true';
    });
    const [showLogin, setShowLogin] = useState(() => {
        return localStorage.getItem('showLogin') === 'true';
    });

    const { user, login, register, logout } = useAuth();

    const handleSetShowRegister = (val) => {
        setShowRegister(val);
        localStorage.setItem('showRegister', val);
    };

    const handleSetShowLogin = (val) => {
        setShowLogin(val);
        localStorage.setItem('showLogin', val);
    };

    return (
        <Router>
            <ScrollToTop />
            <Header user={user} onLoginClick={() => handleSetShowLogin(true)} />

            {showRegister && (
                <Register
                    onClose={() => handleSetShowRegister(false)}
                    onRegisterSuccess={(u) => {
                        register(u);
                        handleSetShowRegister(false);
                    }}
                    onSwitchToLogin={() => {
                        handleSetShowRegister(false);
                        handleSetShowLogin(true);
                    }}
                />
            )}

            {showLogin && (
                <Login
                    onClose={() => handleSetShowLogin(false)}
                    onLoginSuccess={(u) => {
                        login(u);
                        handleSetShowLogin(false);
                    }}
                    onSwitchToRegister={() => {
                        handleSetShowLogin(false);
                        handleSetShowRegister(true);
                    }}
                />
            )}

            <Navbar user={user} />

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
                        path="/orders"
                        element={
                            <ProtectedRoute>
                                <Orders />
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
                        <Route path="dashboard" element={<h2>Dashboard Page</h2>} />
                        <Route path="products" element={<ManageItems />} />
                        <Route path="orders" element={<h2>Orders Page</h2>} />
                        <Route path="customers" element={<h2>Customers Page</h2>} />
                        <Route path="sales" element={<h2>Sales Page</h2>} />
                        <Route path="settings" element={<h2>Settings Page</h2>} />
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
