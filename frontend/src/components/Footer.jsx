import React from 'react';
import { FaInstagram, FaWhatsapp, FaFacebook, FaTwitter } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function Footer() {
    const { user } = useAuth();
    const isStaff = user?.is_staff;

    return (
        <footer className="bg-neutral-100 text-gray-800 py-8 hidden lg:block border-t border-neutral-200 mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* First Section: Brand & Description */}
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold text-gray-900">SmalShop</h2>
                        <p className="text-gray-700 text-lg font-medium">
                            Bringing Essentials Closer to You!
                        </p>
                        <p className="text-gray-600 text-sm">
                            Your friendly neighborhood store serving fresh groceries and daily essentials 
                            with a personal touch.
                        </p>
                    </div>

                    {/* Second Section: Quick Links - Single Column */}
                    <div className="space-y-3 pl-30">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Links</h3>
                        <div className="space-y-2">
                            <a 
                                href="/about" 
                                className="block text-gray-600 hover:text-violet-600 transition-colors text-sm"
                            >
                                About Us
                            </a>
                            <a 
                                href="/account" 
                                className="block text-gray-600 hover:text-violet-600 transition-colors text-sm"
                            >
                                My Account
                            </a>
                            
                            {/* Show different links based on staff status */}
                            {isStaff ? (
                                <a 
                                    href="/view-orders" 
                                    className="block text-gray-600 hover:text-violet-600 transition-colors text-sm"
                                >
                                    Orders
                                </a>
                            ) : (
                                <>
                                    <a 
                                        href="/orders" 
                                        className="block text-gray-600 hover:text-violet-600 transition-colors text-sm"
                                    >
                                        My Orders
                                    </a>
                                    <a 
                                        href="/wishlist" 
                                        className="block text-gray-600 hover:text-violet-600 transition-colors text-sm"
                                    >
                                        Wishlist
                                    </a>
                                </>
                            )}
                            
                            <a 
                                href="/contact" 
                                className="block text-gray-600 hover:text-violet-600 transition-colors text-sm"
                            >
                                Contact
                            </a>
                        </div>
                    </div>

                    {/* Third Section: Social Media */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Connect With Us</h3>
                        <p className="text-gray-600 text-sm mb-3">
                            Follow us for updates and offers
                        </p>
                        <div className="flex gap-3">
                            <a 
                                href="https://instagram.com/smalshop" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-full text-white hover:scale-110 transition-transform"
                                aria-label="Instagram"
                            >
                                <FaInstagram className="text-lg" />
                            </a>
                            <a 
                                href="https://wa.me/91XXXXXXXXXX" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-green-600 p-2 rounded-full text-white hover:scale-110 transition-transform"
                                aria-label="WhatsApp"
                            >
                                <FaWhatsapp className="text-lg" />
                            </a>
                            <a 
                                href="https://facebook.com/smalshop" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-blue-600 p-2 rounded-full text-white hover:scale-110 transition-transform"
                                aria-label="Facebook"
                            >
                                <FaFacebook className="text-lg" />
                            </a>
                            <a 
                                href="https://twitter.com/smalshop" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-gray-800 p-2 rounded-full text-white hover:scale-110 transition-transform"
                                aria-label="Twitter"
                            >
                                <FaTwitter className="text-lg" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-300 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-xs text-gray-600">
                        &copy; {new Date().getFullYear()} SmalShop. All rights reserved.
                    </div>
                    <div className="flex space-x-4 mt-2 md:mt-0">
                        <a href="/privacy" className="text-gray-600 hover:text-violet-600 transition-colors text-xs">
                            Privacy Policy
                        </a>
                        <a href="/terms" className="text-gray-600 hover:text-violet-600 transition-colors text-xs">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;