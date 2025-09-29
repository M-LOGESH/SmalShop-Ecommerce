import React, { forwardRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = forwardRef(({ isOpen, onClose }, ref) => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'Products', path: '/admin/products' },
        { name: 'Orders', path: '/admin/orders' },
        { name: 'Customers', path: '/admin/customers' },
        { name: 'Sales', path: '/admin/sales' },
        { name: 'Settings', path: '/admin/settings' },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden w-64 flex-col bg-gray-200 text-black lg:flex ">
                <nav className="flex-1 p-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`mb-2 block rounded px-3 py-2 ${
                                location.pathname === item.path
                                    ? 'bg-violet-700 text-white'
                                    : 'hover:bg-violet-500 hover:text-white'
                            }`}
                        >
                            {item.name}
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
                            className={`mb-2 block rounded px-3 py-2 ${
                                location.pathname === item.path
                                    ? 'bg-violet-700 text-white'
                                    : 'hover:bg-violet-500 hover:text-white'
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    );
});

export default AdminSidebar;
