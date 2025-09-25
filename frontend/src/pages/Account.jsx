import { useState } from "react";
import MobileHeader from "../components/MobileHeader.jsx";
import Profile from "./Profile.jsx";
import Home from "./Home.jsx";
import {
  FiShoppingBag,
  FiHeart,
  FiInfo,
  FiPhone,
  FiUser,
} from "react-icons/fi";

function Account({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("profile"); // sidebar state
  const [mobileView, setMobileView] = useState(false); // mobile toggle for content

  const handleLogout = () => {
    onLogout();
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile user={user} />;
      case "orders":
        return <Home />;
      case "wishlist":
        return (
          <div>
            <h3 className="text-lg font-semibold">Wishlist</h3>
            <p>No items in wishlist.</p>
          </div>
        );
      case "about":
        return (
          <div>
            <h3 className="text-lg font-semibold">About</h3>
            <p>About content here.</p>
          </div>
        );
      case "contact":
        return (
          <div>
            <h3 className="text-lg font-semibold">Contact</h3>
            <p>Contact content here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <MobileHeader title="My Account" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-6 p-4 md:p-8">
        {/* Sidebar */}
        {!mobileView && (
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
              {[
                { key: "profile", icon: <FiUser />, label: "Profile" },
                { key: "orders", icon: <FiShoppingBag />, label: "My Orders" },
                { key: "wishlist", icon: <FiHeart />, label: "Wishlist" },
                { key: "about", icon: <FiInfo />, label: "About" },
                { key: "contact", icon: <FiPhone />, label: "Contact" },
              ].map((item) => (
                <button
                  key={item.key}
                  className={`flex items-center space-x-2 w-full p-2 rounded-lg hover:bg-gray-100 ${
                    activeTab === item.key ? "bg-gray-100 font-semibold" : ""
                  }`}
                  onClick={() => {
                    setActiveTab(item.key);
                    if (window.innerWidth < 768) setMobileView(true); // mobile view toggle
                  }}
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
        )}

        {/* Main Content (desktop only) */}
        <div className="md:w-2/3 flex-1 hidden md:block">{renderContent()}</div>
      </div>

      {/* Mobile separate page content (without back button) */}
      {mobileView && <div className="p-4">{renderContent()}</div>}
    </div>
  );
}

export default Account;
