import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/header/Header.jsx';
import Footer from '../components/Footer.jsx';
import MobileHeader from '../components/header/MobileHeader.jsx';
import Navbar from '../components/Navbar.jsx';
import Login from '../components/Login.jsx';
import Register from '../components/Register.jsx';
import Cart from '../pages/users/Cart.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function MainLayout() {
    const location = useLocation();
    const { user, login, register, logout } = useAuth();
    
    const [showRegister, setShowRegister] = useState(() => {
        return localStorage.getItem('showRegister') === 'true';
    });
    const [showLogin, setShowLogin] = useState(() => {
        return localStorage.getItem('showLogin') === 'true';
    });
    const [cartOpen, setCartOpen] = useState(false);

    const mobileHeaderPages = ['/account', '/profile', '/my-orders', '/view-orders'];
    const showMobileHeader = mobileHeaderPages.some(
        (path) => location.pathname === path || location.pathname.startsWith(path + '/')
    );

    const isAdminPage = location.pathname.startsWith('/admin');
    
    const getPageTitle = () => {
        if (location.pathname === '/account') return 'My Account';
        if (location.pathname === '/profile') return 'My Profile';
        if (location.pathname === '/my-orders') return 'My Orders';
        if (location.pathname.startsWith('/my-orders/')) return 'Order Details';
        if (location.pathname === '/view-orders') return 'All Orders';
        return '';
    };

    const handleSetShowRegister = (val) => {
        setShowRegister(val);
        localStorage.setItem('showRegister', val.toString());
    };

    const handleSetShowLogin = (val) => {
        setShowLogin(val);
        localStorage.setItem('showLogin', val.toString());
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            {/* Header with all state management */}
            <Header 
                user={user} 
                onLoginClick={() => handleSetShowLogin(true)}
                cartOpen={cartOpen}
                setCartOpen={setCartOpen}
            />

            {/* Fixed Mobile Header for specific pages */}
            {showMobileHeader && (
                <MobileHeader 
                    title={getPageTitle()} 
                    setCartOpen={setCartOpen} 
                />
            )}

            {/* Cart Component - Always available in layout */}
            {(!user || (user && !user.is_staff)) && (
                <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
            )}

            {/* Login Modal */}
            {showLogin && (
                <Login
                    onClose={() => handleSetShowLogin(false)}
                    onLoginSuccess={(userData) => {
                        login(userData);
                        handleSetShowLogin(false);
                    }}
                    onSwitchToRegister={() => {
                        handleSetShowLogin(false);
                        handleSetShowRegister(true);
                    }}
                />
            )}

            {/* Register Modal */}
            {showRegister && (
                <Register
                    onClose={() => handleSetShowRegister(false)}
                    onRegisterSuccess={(userData) => {
                        register(userData);
                        handleSetShowRegister(false);
                    }}
                    onSwitchToLogin={() => {
                        handleSetShowRegister(false);
                        handleSetShowLogin(true);
                    }}
                />
            )}

            {/* Main content */}
            <div
                className={`flex-grow pb-18 sm:pt-18 lg:pb-0 ${
                    showMobileHeader 
                        ? 'pt-16'
                        : (isAdminPage ? 'pt-14' : 'pt-24 sm:pt-18')
                }`}
            >
                <Outlet />
            </div>

            {/* Bottom Navbar - Always visible on mobile */}
            <Navbar user={user} />
            
            <Footer />
        </div>
    );
}

export default MainLayout;