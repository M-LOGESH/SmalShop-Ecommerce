import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import SearchBar from "./SearchBar.jsx";
import { FiShoppingCart } from "react-icons/fi";

function Header({ user, onLoginClick }) {
    const navigate = useNavigate();
    const location = useLocation();

    // Pages where desktop header should hide on mobile
    const hideHeaderMobilePages = ["/account", "/profile", "/cart", "/orders"];
    const hideHeaderOnMobile = hideHeaderMobilePages.includes(location.pathname);

    return (
        <header
            className={`bg-violet-600 shadow-md fixed top-0 left-0 w-full z-50 ${hideHeaderOnMobile ? "hidden sm:block" : "block"
                }`}
        >
            <div className="flex flex-col sm:flex-row justify-between items-center py-3 sm:py-4 px-4 sm:px-6">
                <div className="flex w-full justify-between items-center">
                    <div className="text-2xl font-bold text-white">SmalShop</div>

                    {/* Desktop Navbar */}
                    <div className="flex-1 flex justify-center">
                        <Navbar user={user} isDesktop />
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="hidden sm:flex">
                            <SearchBar onSearch={(query) => console.log("Search for:", query)} />
                        </div>

                        {/* Cart Icon - visible for guests and normal users, hidden for staff */}
                        {(!user || (user && !user.is_staff)) && (
                            <button
                                onClick={() => navigate("/cart")}
                                className="relative text-white hover:text-violet-200 transition"
                            >
                                <FiShoppingCart size={22} />
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                                    4
                                </span>
                            </button>
                        )}

                        {!user ? (
                            <button
                                className="bg-violet-900 text-white px-4 py-2 rounded-md hover:bg-violet-800"
                                onClick={onLoginClick}
                            >
                                Sign In
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate("/account")}
                                className="bg-gray-200 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-700 hover:bg-gray-300"
                            >
                                {user.username[0].toUpperCase()}
                            </button>
                        )}
                    </div>
                </div>

                <div className="w-full mt-2 sm:hidden">
                    <SearchBar onSearch={(query) => console.log("Search for:", query)} />
                </div>
            </div>
        </header>
    );
}

export default Header;
