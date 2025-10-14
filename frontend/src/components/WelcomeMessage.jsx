import { useState } from 'react';
import { FiUser, FiShield } from 'react-icons/fi';

function WelcomeMessage() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="mx-auto my-2 max-w-6xl px-4">
            {/* Header */}
            <div className="mb-3 text-center sm:mb-6">
                <h2 className="text-xl font-bold text-gray-800 md:text-2xl">
                    Welcome to the SmalShop!
                </h2>
            </div>

            {/* Warning Note */}
            <div className="mb-6 text-center">
                <p className="text-sm text-gray-700 sm:text-lg">
                    <span className="font-bold sm:text-lg">⚠️ Note:</span> Hosted on a free plan.
                    The server may take up to a minute to start if idle.Please be patient while the
                    server spins up!
                </p>
            </div>

            {/* Credentials Section */}
            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                {/* Regular User */}
                <div className="rounded-lg border border-green-200 bg-green-100/50 p-3 md:p-6">
                    <div className="mb-2 flex items-center sm:mb-4">
                        <FiUser className="mx-3 h-4 w-4 text-green-500 sm:h-5 sm:w-5" />
                        <h3 className="text-md font-bold text-green-800 md:text-xl">
                            Customer Account
                        </h3>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between rounded-lg border border-green-100 bg-white p-2 sm:p-3">
                            <span className="sm:text-md text-sm font-medium text-gray-600">
                                Username:{' '}
                                <span className="sm:text-md ml-2 text-sm font-medium text-black">
                                    user
                                </span>
                            </span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-green-100 bg-white p-2 sm:p-3">
                            <span className="sm:text-md text-sm font-medium text-gray-600">
                                Password:{' '}
                                <span className="sm:text-md ml-2 text-sm font-semibold text-black">
                                    user@12345
                                </span>
                            </span>
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-green-700 sm:text-sm">
                        Experience shopping as a regular customer
                    </p>
                </div>

                {/* Staff User */}
                <div className="rounded-lg border border-purple-200 bg-purple-100/50 p-4 md:p-6">
                    <div className="mb-2 flex items-center sm:mb-4">
                        <FiShield className="mx-3 h-4 w-4 text-purple-500 sm:h-5 sm:w-5" />
                        <h3 className="text-md font-bold text-purple-800 md:text-xl">
                            Staff Account
                        </h3>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between rounded-lg border border-purple-100 bg-white p-2 sm:p-3">
                            <span className="sm:text-md text-sm font-medium text-gray-600">
                                Username:{' '}
                                <span className="sm:text-md ml-2 text-sm font-medium text-black">
                                    staff
                                </span>
                            </span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-purple-100 bg-white p-2 sm:p-3">
                            <span className="sm:text-md text-sm font-medium text-gray-600">
                                Password:{' '}
                                <span className="sm:text-md ml-2 text-sm font-medium text-black">
                                    staff@12345
                                </span>
                            </span>
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-purple-700 sm:text-sm">
                        Access admin panel and manage products
                    </p>
                </div>
            </div>
        </div>
    );
}

export default WelcomeMessage;
