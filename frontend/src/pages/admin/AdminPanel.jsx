import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

function AdminPanel() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);
    const mainContentRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);

        if (mainContentRef.current) {
            mainContentRef.current.scrollTop = 0;
        }
    }, [location.pathname]);

    // Toggle from Header
    useEffect(() => {
        const handleToggle = (e) => {
            if (e.detail?.toggle) {
                setIsSidebarOpen((prev) => !prev);
            }
        };
        window.addEventListener('toggleSidebar', handleToggle);
        return () => window.removeEventListener('toggleSidebar', handleToggle);
    }, []);

    // Prevent background scroll when sidebar is open
    useEffect(() => {
        document.body.style.overflow = isSidebarOpen ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isSidebarOpen]);

    return (
        <div className="relative flex [height:calc(100vh-72px)]">
            {/* Sidebar */}
            <AdminSidebar
                isOpen={isSidebarOpen}
                ref={sidebarRef}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Overlay with fade */}
            <div
                className={`fixed inset-0 z-30 bg-gray-900/30 transition-opacity duration-300 lg:hidden ${
                    isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            {/* Main content with ref for scroll control */}
            <div ref={mainContentRef} className="z-0 flex-1 overflow-y-auto p-6">
                <Outlet />
            </div>
        </div>
    );
}

export default AdminPanel;