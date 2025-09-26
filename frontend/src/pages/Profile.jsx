import React, { useState, useEffect } from "react";
import MobileHeader from "../components/MobileHeader";
import { useAuth } from "../context/AuthContext";

function Profile({ onCancel }) {
    const { user, fetchWithAuth, login } = useAuth();

    const [formData, setFormData] = useState({
        full_name: "",
        username: "",
        email: "",
        dob: "",
        gender: "",
        mobile: "",
        address: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user?.profile?.full_name || "",
                username: user?.username || "",
                email: user?.email || "",
                dob: user?.profile?.dob || "",
                gender: user?.profile?.gender || "",
                mobile: user?.profile?.mobile || "",
                address: user?.profile?.address || "",
            });
        }
    }, [user]);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const isFormComplete = () => Object.values(formData).every((v) => v.trim());

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormComplete()) return;

        try {
            const payload = {
                username: formData.username,
                email: formData.email,
                profile: {
                    full_name: formData.full_name,
                    dob: formData.dob || null,
                    gender: formData.gender,
                    mobile: formData.mobile,
                    address: formData.address,
                },
            };

            const response = await fetchWithAuth(
                "http://127.0.0.1:8000/api/users/profile/update/",
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();
            if (!response.ok) {
                console.error("Update error:", data);
                return;
            }

            login({
                ...user,
                username: data.username,
                email: data.email,
                profile: data.profile,
            });

            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Network error:", error);
        }
    };

   const inputClass =
    "w-full bg-violet-50/50 border border-gray-300 rounded-lg px-4 py-3 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition duration-200";


    return (
        <div className="min-h-screen bg-gray-50">
            <MobileHeader title="Profile" />
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Personal Information
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label htmlFor="full_name" className="text-gray-600 mb-1 text-xs">Full Name *</label>
                            <input
                                type="text"
                                id="full_name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="username" className="text-gray-600 mb-1 text-xs">Username *</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-gray-600 mb-1 text-xs">Email ID *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="dob" className="text-gray-600 mb-1 text-xs">Date of Birth *</label>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="gender" className="text-gray-600 mb-1 text-xs">Gender *</label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="mobile" className="text-gray-600 mb-1 text-xs">Mobile No *</label>
                            <input
                                type="tel"
                                id="mobile"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col md:col-span-2">
                            <label htmlFor="address" className="text-gray-600 mb-1 text-xs">Address *</label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={3}
                                className={inputClass}
                            />
                        </div>

                        <div className="md:col-span-2 flex gap-4 mt-4 justify-end">
                            <button
                                type="submit"
                                disabled={!isFormComplete()}
                                className={`px-6 py-2 rounded-xl font-medium transition ${
                                    isFormComplete()
                                        ? "bg-violet-600 text-white hover:bg-violet-700"
                                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                }`}
                            >
                                Update
                            </button>
                            {onCancel && (
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="px-6 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Profile;
