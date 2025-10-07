import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiInfo, FiPhone, FiUser, FiBox, FiSettings } from 'react-icons/fi';
import Profile from './Profile';
import { useState, useEffect } from 'react';

function Account({ user, onLogout }) {
    const navigate = useNavigate();
    const [activeKey, setActiveKey] = useState('profile');
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 944);

    // Update isDesktop on window resize
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 944);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        onLogout();
    };

    // Different menu for admin vs normal user
    const menuItems = !user?.is_staff
        ? [
              { key: 'profile', icon: <FiUser />, label: 'Profile', path: '/profile' },
              { key: 'orders', icon: <FiShoppingBag />, label: 'My Orders', path: '/my-orders' },
              { key: 'wishlist', icon: <FiHeart />, label: 'Wishlist', path: '/wishlist' },
              { key: 'about', icon: <FiInfo />, label: 'About', path: '/about' },
              { key: 'contact', icon: <FiPhone />, label: 'Contact', path: '/contact' },
          ]
        : [
              { key: 'profile', icon: <FiUser />, label: 'Profile', path: '/profile' },
              { key: 'orders', icon: <FiBox />, label: 'Orders', path: '/view-orders' },
              { key: 'manage', icon: <FiSettings />, label: 'Manage Items', path: '/admin/dashboard' },
              { key: 'about', icon: <FiInfo />, label: 'About', path: '/about' },
              { key: 'contact', icon: <FiPhone />, label: 'Contact', path: '/contact' },
          ];

    const handleMenuClick = (item) => {
        if (item.key === 'profile' && isDesktop) {
            setActiveKey('profile');
            return;
        }
        setActiveKey(item.key);
        navigate(item.path);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 p-4 md:flex-row md:p-8">
                {/* Sidebar */}
                <div className="2md:w-1/3 w-full flex-shrink-0 rounded-2xl bg-white p-4 shadow">
                    <div className="mb-6 flex items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-lg font-bold text-white">
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
                                className={`flex w-full items-center space-x-2 rounded-lg p-2 hover:bg-violet-100 ${
                                    isDesktop && activeKey === item.key
                                        ? 'bg-violet-100 font-semibold text-violet-700'
                                        : ''
                                }`}
                                onClick={() => handleMenuClick(item)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <button
                        className="mt-6 flex w-full items-center justify-center space-x-2 rounded-lg bg-violet-600 py-2 text-white hover:bg-violet-700"
                        onClick={handleLogout}
                    >
                        <span>Sign Out</span>
                    </button>
                </div>

                {/* Profile Section (desktop only) */}
                <div className="2md:w-2/3 2md:block hidden w-full">
                    <Profile user={user} />
                </div>
            </div>
        </div>
    );
}

export default Account;
