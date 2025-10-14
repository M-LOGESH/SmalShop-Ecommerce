import React from 'react';
import { FaShoppingBasket } from 'react-icons/fa';

function About() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-6xl px-4 pt-4 text-center">
                <h1 className="mb-2 text-2xl font-bold sm:mb-4 md:text-3xl">About Us</h1>
                <p className="text-md md:text-xl">Bringing Essentials Closer to You!</p>
            </div>

            {/* Main Content */}
            <div className="mx-auto max-w-6xl px-5 py-5 sm:py-10">
                <div className="mb-16 grid items-center gap-12 md:grid-cols-2">
                    <div>
                        <h2 className="mb-6 text-xl font-bold text-gray-900 md:text-2xl">
                            SmalShop
                        </h2>
                        <div className="space-y-4 text-lg text-gray-700">
                            <p>
                                SmalShop started as a small dream to serve our local community in
                                Solaiaglgupuram, Madurai. What began as a humble neighborhood store
                                has grown into a beloved local institution, serving generations of
                                families with quality products and personalized service.
                            </p>
                            <p>
                                For years, we've been more than just a shop - we're a part of your
                                daily life. We know our customers by name, understand their
                                preferences, and take pride in being your trusted local grocery
                                partner.
                            </p>
                            <p>
                                Our commitment has always been simple: provide fresh, quality
                                products at fair prices while maintaining the personal touch that
                                big supermarkets can't offer.
                            </p>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                        <div className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-purple-200">
                            <FaShoppingBasket className="text-6xl text-violet-600 opacity-80" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
