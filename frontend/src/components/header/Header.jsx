import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import SearchBar from '../common/SearchBar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { FiShoppingCart, FiMenu } from 'react-icons/fi';

function Header({ user, onLoginClick, cartOpen, setCartOpen }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { cart } = useAuth();

    const isAdminPage = location.pathname.startsWith('/admin');

    const hideHeaderMobilePages = ['/account', '/profile', '/my-orders', '/view-orders'];
    const hideHeaderOnMobile = hideHeaderMobilePages.some(
        (path) => location.pathname === path || location.pathname.startsWith(path + '/')
    );

    return (
        <header
            className={`fixed top-0 left-0 z-50 w-full bg-violet-600 shadow-md ${
                hideHeaderOnMobile ? 'hidden sm:block' : 'block'
            }`}
        >
            <div className="flex flex-col items-center justify-between px-3 py-3 sm:flex-row sm:px-6 sm:py-4">
                <div className="flex w-full items-center justify-between">
                    {isAdminPage && (
                        <button
                            className="pr-4 text-2xl text-white lg:hidden"
                            onClick={() => {
                                const event = new CustomEvent('toggleSidebar', {
                                    detail: { toggle: true },
                                });
                                window.dispatchEvent(event);
                            }}
                        >
                            <FiMenu />
                        </button>
                    )}

                    <div className="text-2xl font-bold text-white">SmalShop</div>

                    <div className="flex flex-1 justify-center">
                        <Navbar user={user} isDesktop />
                    </div>

                    <div className="flex items-center">
                        <div className="mr-4 hidden sm:flex">
                            <SearchBar onSearch={(query) => console.log('Search for:', query)} />
                        </div>

                        {(!user || (user && !user.is_staff)) && (
                            <button
                                onClick={() => navigate('/cart')}
                                className="relative mr-4 text-white transition hover:text-violet-200"
                            >
                                <FiShoppingCart size={22} />
                                <span className="absolute -top-2 -right-2 rounded-full bg-red-500 px-1 text-xs text-white">
                                    {cart.length}
                                </span>
                            </button>
                        )}

                        {!user ? (
                            <button
                                className="rounded-md bg-violet-900 px-4 py-2 text-white hover:bg-violet-800"
                                onClick={onLoginClick}
                            >
                                Sign In
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/account')}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 sm:h-10 sm:w-10"
                            >
                                {user.username[0].toUpperCase()}
                            </button>
                        )}
                    </div>
                </div>

                {!isAdminPage && (
                    <div className="mt-2 w-full sm:hidden">
                        <SearchBar onSearch={(query) => console.log('Search for:', query)} />
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
