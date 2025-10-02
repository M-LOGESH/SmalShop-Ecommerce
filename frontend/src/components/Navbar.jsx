import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiHeart, FiShoppingBag, FiBox, FiSettings, FiGrid } from 'react-icons/fi';

function Navbar({ user, isDesktop = false }) {
    const getLinkClass = ({ isActive }) =>
        isActive
            ? 'flex items-center gap-2 text-violet-200 transition'
            : 'flex items-center gap-2 text-white hover:text-violet-200 transition';

    const getMobileLinkClass = ({ isActive }) =>
        isActive
            ? 'flex flex-col items-center text-sm py-2 text-violet-700 transition'
            : 'flex flex-col items-center text-sm py-2 hover:text-violet-700 transition';

    if (isDesktop) {
        // Desktop Navbar
        return (
            <nav className="hidden space-x-10 text-lg font-medium lg:flex">
                {!user?.is_staff ? (
                    <>
                        <NavLink to="/" className={getLinkClass}>
                            <FiHome /> Home
                        </NavLink>
                        <NavLink to="/category" className={getLinkClass}>
                            <FiGrid /> Category
                        </NavLink>
                        <NavLink to="/wishlist" className={getLinkClass}>
                            <FiHeart /> Wishlist
                        </NavLink>
                        <NavLink to="/orders" className={getLinkClass}>
                            <FiShoppingBag /> Order
                        </NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to="/" className={getLinkClass}>
                            <FiHome /> Home
                        </NavLink>
                        <NavLink to="/category" className={getLinkClass}>
                            <FiGrid /> Category
                        </NavLink>
                        <NavLink to="/view-orders" className={getLinkClass}>
                            <FiBox /> Orders
                        </NavLink>
                        <NavLink to="/admin/dashboard" className={getLinkClass}>
                            <FiSettings /> Manage
                        </NavLink>
                    </>
                )}
            </nav>
        );
    }

    // Mobile Bottom Navbar (always visible)
    return (
        <nav className="fixed bottom-0 left-0 z-40 flex w-full justify-around border-t border-zinc-200 bg-zinc-100 py-2 shadow-md lg:hidden">
            {!user?.is_staff ? (
                <>
                    <NavLink to="/" className={getMobileLinkClass}>
                        <FiHome size={20} />
                        <span>Home</span>
                    </NavLink>
                    <NavLink to="/category" className={getMobileLinkClass}>
                        <FiGrid size={20} />
                        <span>Category</span>
                    </NavLink>
                    <NavLink to="/wishlist" className={getMobileLinkClass}>
                        <FiHeart size={20} />
                        <span>Wishlist</span>
                    </NavLink>
                    <NavLink to="/orders" className={getMobileLinkClass}>
                        <FiShoppingBag size={20} />
                        <span>Order</span>
                    </NavLink>
                </>
            ) : (
                <>
                    <NavLink to="/" className={getMobileLinkClass}>
                        <FiHome size={20} />
                        <span>Home</span>
                    </NavLink>
                    <NavLink to="/category" className={getMobileLinkClass}>
                        <FiGrid size={20} />
                        <span>Category</span>
                    </NavLink>
                    <NavLink to="/view-orders" className={getMobileLinkClass}>
                        <FiBox size={20} />
                        <span>Orders</span>
                    </NavLink>
                    <NavLink to="/admin/dashboard" className={getMobileLinkClass}>
                        <FiSettings size={20} />
                        <span>Manage</span>
                    </NavLink>
                </>
            )}
        </nav>
    );
}

export default Navbar;
