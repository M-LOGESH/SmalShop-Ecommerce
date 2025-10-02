import React from 'react';

function Footer() {
    return (
        <footer className="bg-gray-800 py-6 text-gray-200 hidden lg:block">
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
                            <path
                                d="M23.954 4.569c-.885.389-1.83.654-2.825.775 
           1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184
           -.897-.959-2.178-1.555-3.594-1.555-2.717 0-4.92 2.203-4.92 4.917 
           0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 
           0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.247-2.229-.616v.061c0 2.385 1.693 4.374 3.946 4.827
           -.413.111-.849.171-1.296.171-.317 0-.626-.03-.927-.086.627 1.956 2.444 3.377 4.6 3.417 
           -1.68 1.319-3.809 2.105-6.102 2.105-.396 0-.788-.023-1.175-.069 2.179 1.397 4.768 2.213 7.548 2.213
           9.051 0 14.002-7.496 14.002-13.986 0-.21 0-.423-.015-.637.962-.689 1.8-1.56 2.46-2.548l-.047-.02z"
                            />
                        </svg>
                    </a>
                    <a href="#" className="transition-colors hover:text-white">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                d="M23.954 4.569c-.885.389-1.83.654-2.825.775 
           1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184
           -.897-.959-2.178-1.555-3.594-1.555-2.717 0-4.92 2.203-4.92 4.917 
           0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 
           0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.247-2.229-.616v.061c0 2.385 1.693 4.374 3.946 4.827
           -.413.111-.849.171-1.296.171-.317 0-.626-.03-.927-.086.627 1.956 2.444 3.377 4.6 3.417 
           -1.68 1.319-3.809 2.105-6.102 2.105-.396 0-.788-.023-1.175-.069 2.179 1.397 4.768 2.213 7.548 2.213
           9.051 0 14.002-7.496 14.002-13.986 0-.21 0-.423-.015-.637.962-.689 1.8-1.56 2.46-2.548l-.047-.02z"
                            />
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
