import React, { forwardRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiPackage, FiClipboard, FiUsers, FiBarChart2, FiSettings } from 'react-icons/fi';

const AdminSidebar = forwardRef(({ isOpen, onClose }, ref) => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <FiGrid /> },
        { name: 'Products', path: '/admin/products', icon: <FiPackage /> },
        { name: 'Orders', path: '/admin/orders', icon: <FiClipboard /> },
        { name: 'Customers', path: '/admin/customers', icon: <FiUsers /> },
        { name: 'Sales', path: '/admin/sales', icon: <FiBarChart2 /> },
        { name: 'Settings', path: '/admin/settings', icon: <FiSettings /> },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden w-60 flex-col bg-gray-200 text-black lg:flex">
                <nav className="flex-1 p-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={`mb-2 flex items-center gap-2 rounded px-3 py-2 ${
                                location.pathname === item.path
                                    ? 'bg-violet-700 text-white'
                                    : 'hover:bg-violet-500 hover:text-white'
                            }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Mobile Sidebar (Animated) */}
            <div
                ref={ref}
                className={`fixed left-0 z-40 h-screen w-64 transform flex-col bg-gray-200 text-black shadow-lg transition-transform duration-300 ease-in-out sm:top-18 lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <nav className="flex-1 p-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={`mb-2 flex items-center gap-2 rounded px-3 py-2 ${
                                location.pathname === item.path
                                    ? 'bg-violet-700 text-white'
                                    : 'hover:bg-violet-500 hover:text-white'
                            }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    );
});

export default AdminSidebar;
