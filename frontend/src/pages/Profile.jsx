// src/components/Profile.jsx
import React from "react";
import MobileHeader from "../components/MobileHeader";

function Profile({ user }) {
    return (
        <div>
            {/* Mobile Header */}
            <MobileHeader title="profile" />
            <div className="p-4 md:p-8">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="space-y-4">
                <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{user.username}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Email ID</p>
                    <p className="font-medium">{user.email}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Mobile No</p>
                    <p className="font-medium">{user.mobile}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Default Address</p>
                    <p className="font-medium">Not Added</p>
                </div>
            </div>
            <button className="mt-6 bg-violet-600 text-white py-2 px-6 rounded-lg hover:bg-violet-700">
                Edit
            </button>
            </div>
        </div>
    );
}

export default Profile;
