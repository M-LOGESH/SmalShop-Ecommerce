import React from 'react';

function Footer() {
    return (
        <footer className="mt-auto hidden bg-gray-800 py-6 text-gray-200 lg:block">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-4 sm:px-6 md:flex-row lg:px-8">
                {/* Left Section */}
                <div className="text-sm">
                    &copy; {new Date().getFullYear()} SmalShop. All rights reserved.
                </div>

                {/* Center / Links */}
                <div className="mt-4 flex space-x-6 md:mt-0">
                    <a href="/privacy" className="transition-colors hover:text-white">
                        Privacy Policy
                    </a>
                    <a href="/terms" className="transition-colors hover:text-white">
                        Terms of Service
                    </a>
                    <a href="/contact" className="transition-colors hover:text-white">
                        Contact
                    </a>
                </div>

                {/* Right / Social Icons */}
                <div className="mt-4 flex space-x-4 md:mt-0">
                    <a href="#" className="transition-colors hover:text-white">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 4.56c-.88.39-1.82.65-2.8.77 1-.6 1.76-1.55 2.12-2.68-.93.55-1.97.95-3.08 1.17a5.3 5.3 0 0 0-9 4.84A15 15 0 0 1 1.67 3.15a5.3 5.3 0 0 0 1.64 7.06c-.82-.03-1.59-.25-2.27-.63v.06a5.3 5.3 0 0 0 4.25 5.19c-.38.1-.77.15-1.17.15-.29 0-.57-.03-.84-.08a5.3 5.3 0 0 0 4.95 3.67A10.63 10.63 0 0 1 0 19.54a15 15 0 0 0 8.13 2.38c9.75 0 15.09-8.08 15.09-15.09 0-.23-.01-.46-.02-.68A10.78 10.78 0 0 0 24 4.56z" />
                        </svg>
                    </a>
                    <a href="#" className="transition-colors hover:text-white">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.27 4.27 0 0 0 1.88-2.36 8.49 8.49 0 0 1-2.7 1.03 4.26 4.26 0 0 0-7.26 3.88 12.1 12.1 0 0 1-8.78-4.45 4.26 4.26 0 0 0 1.32 5.69 4.22 4.22 0 0 1-1.93-.53v.05a4.27 4.27 0 0 0 3.42 4.18 4.3 4.3 0 0 1-1.92.07 4.27 4.27 0 0 0 3.98 2.97A8.53 8.53 0 0 1 2 19.54a12.05 12.05 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19-.01-.38-.02-.57A8.66 8.66 0 0 0 24 4.59a8.38 8.38 0 0 1-2.54.7z" />
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
