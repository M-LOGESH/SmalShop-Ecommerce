import { useNavigate } from "react-router-dom";
import { FiShoppingBag, FiHeart, FiInfo, FiPhone, FiUser } from "react-icons/fi";
import MobileHeader from "../components/MobileHeader";
import Profile from "./Profile";
import { useState, useEffect } from "react";

function Account({ user, onLogout }) {
    const navigate = useNavigate();
    const [activeKey, setActiveKey] = useState("profile");
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

    // Update isDesktop on window resize
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = () => {
        onLogout();
    };

    const menuItems = [
        { key: "profile", icon: <FiUser />, label: "Profile", path: "/profile" },
        { key: "orders", icon: <FiShoppingBag />, label: "My Orders", path: "/orders" },
        { key: "wishlist", icon: <FiHeart />, label: "Wishlist", path: "/wishlist" },
        { key: "about", icon: <FiInfo />, label: "About", path: "/about" },
        { key: "contact", icon: <FiPhone />, label: "Contact", path: "/contact" },
    ];

    const handleMenuClick = (item) => {
        if (item.key === "profile" && isDesktop) {
            // Do nothing on desktop for Profile
            setActiveKey("profile");
            return;
        }
        setActiveKey(item.key);
        navigate(item.path);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <MobileHeader title="My Account" />

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-6 p-4 md:p-8">
                
                {/* Sidebar */}
                <div className="p-4 w-full md:w-1/3 rounded-2xl shadow bg-white flex-shrink-0">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center text-lg font-bold">
                            {user.username?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <h2 className="font-semibold">{user.username}</h2>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <p className="text-sm text-gray-500">{user.mobile}</p>
                        </div>
                    </div>

                    <nav className="space-y-3">
                        {menuItems.map((item) => (
                            <button
                                key={item.key}
                                className={`flex items-center space-x-2 w-full p-2 rounded-lg hover:bg-violet-100
                                    ${isDesktop && activeKey === item.key ? "bg-violet-100 text-violet-700 font-semibold" : ""}`}
                                onClick={() => handleMenuClick(item)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <button
                        className="w-full mt-6 flex items-center justify-center space-x-2 bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700"
                        onClick={handleLogout}
                    >
                        <span>Sign Out</span>
                    </button>
                </div>

                {/* Profile Section (desktop only) */}
                <div className="w-full md:w-2/3 hidden md:block">
                    <Profile user={user} />
                </div>
            </div>
        </div>
    );
}

export default Account;
