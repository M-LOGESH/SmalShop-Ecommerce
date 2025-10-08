import React from 'react';
import { FaMapMarkerAlt, FaClock, FaPhone, FaEnvelope, FaWhatsapp, FaStore } from 'react-icons/fa';

function Contact() {
    return (
        <div className="min-h-screen bg-gray-50 py-4">
            <div className="mx-auto max-w-6xl px-4">
                {/* Header Section */}
                <div className="mb-5 text-center">
                    <h1 className="mb-4 text-2xl md:text-3xl font-bold text-gray-900">Contact Us</h1>
                    <p className="mx-auto max-w-2xl text-md md:text-xl text-gray-600">
                        Get in touch with us. We're here to help with all your grocery needs.
                    </p>
                </div>

                {/* Store Information */}
                <div className="mb-10 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
                    <div className="grid md:grid-cols-2">
                        {/* Store Details */}
                        <div className="p-8">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900">
                                Visit Our Store
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-violet-600" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Address</h3>
                                        <p className="text-gray-600">
                                            Solaiaglgupuram 1st Street
                                            <br />
                                            Madurai, Tamil Nadu
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <FaClock className="mt-1 flex-shrink-0 text-violet-600" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            Opening Hours
                                        </h3>
                                        <p className="text-gray-600">
                                            Monday - Sunday: 7:00 AM - 10:00 PM
                                            <br />
                                            Open 350 days a year
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <FaPhone className="mt-1 flex-shrink-0 text-violet-600" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Contact</h3>
                                        <p className="text-gray-600">
                                            +91 XXXXX XXXXX
                                            <br />
                                            smalshop.mdu@example.com
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <FaStore className="mt-1 flex-shrink-0 text-violet-600" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            Store Services
                                        </h3>
                                        <p className="text-gray-600">
                                            Place Your Order by Phone
                                            <br />
                                            Ready for Quick Pickup
                                            <br />
                                            No Waiting Time at Store
                                        </p>
                                    </div>
                                </div>

                                {/* Contact Icons at the end of left side content */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="mb-4 font-semibold text-gray-900">
                                        Quick Contact
                                    </h3>
                                    <div className="flex gap-4">
                                        <a
                                            href="tel:+91XXXXXXXXXX"
                                            className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-blue-600 transition-colors hover:bg-blue-100"
                                        >
                                            <FaPhone className="text-sm" />
                                            <span className="hidden text-sm font-medium sm:block">
                                                Call
                                            </span>
                                        </a>
                                        <a
                                            href="https://wa.me/91XXXXXXXXXX"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-green-600 transition-colors hover:bg-green-100"
                                        >
                                            <FaWhatsapp className="text-sm" />
                                            <span className="hidden text-sm font-medium sm:block">
                                                WhatsApp
                                            </span>
                                        </a>
                                        <a
                                            href="mailto:smalshop.mdu@gmail.com"
                                            className="flex items-center gap-2 rounded-lg bg-violet-50 px-4 py-2 text-violet-600 transition-colors hover:bg-violet-100"
                                        >
                                            <FaEnvelope className="text-sm" />
                                            <span className="hidden text-sm font-medium sm:block">
                                                Email
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="flex items-center justify-center bg-gray-100 p-8">
                            <div className="text-center">
                                <FaMapMarkerAlt className="mx-auto mb-4 text-4xl text-violet-600" />
                                <h3 className="mb-2 font-semibold text-gray-900">Our Location</h3>
                                <p className="mb-4 text-sm text-gray-600">
                                    Solaiaglgupuram, Madurai
                                </p>
                                <button className="rounded-lg bg-violet-600 px-6 py-2 text-white transition-colors hover:bg-violet-700">
                                    Get Directions
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
