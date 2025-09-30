import React, { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

function AdminPanel() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Toggle from Header
  useEffect(() => {
    const handleToggle = (e) => {
      if (e.detail?.toggle) {
        setIsSidebarOpen((prev) => !prev);
      }
    };
    window.addEventListener("toggleSidebar", handleToggle);
    return () => window.removeEventListener("toggleSidebar", handleToggle);
  }, []);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex [height:calc(100vh-72px)] relative">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        ref={sidebarRef}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Overlay with fade */}
      <div
        className={`fixed inset-0 bg-gray-900/30 z-30 lg:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6 z-0">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminPanel;
