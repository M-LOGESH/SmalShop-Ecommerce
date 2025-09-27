import React, { useState, useEffect } from 'react';
import MobileHeader from '../../components/MobileHeader';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

function Profile({ onCancel }) {
    const { user, fetchWithAuth, login } = useAuth();

    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        email: '',
        dob: '',
        gender: '',
        mobile: '',
        address: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user?.profile?.full_name || '',
                username: user?.username || '',
                email: user?.email || '',
                dob: user?.profile?.dob || '',
                gender: user?.profile?.gender || '',
                mobile: user?.profile?.mobile || '',
                address: user?.profile?.address || '',
            });
        }
    }, [user]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
                'http://127.0.0.1:8000/api/users/profile/update/',
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();
            if (!response.ok) {
                console.error('Update error:', data);
                toast.error('Failed to update profile!'); // error toast
                return;
            }

            login({
                ...user,
                username: data.username,
                email: data.email,
                profile: data.profile,
            });

            toast.success('Profile updated successfully!'); // success toast
        } catch (error) {
            console.error('Network error:', error);
            toast.error('Network error occurred!');
        }
    };

    const inputClass =
        'w-full bg-violet-50/50 border border-gray-300 rounded-lg px-4 py-3 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition duration-200';

    return (
        <div className="min-h-screen bg-gray-50">
            <MobileHeader title="Profile" />
            <div className="mx-auto max-w-4xl">
                <div className="2md:bg-white 2md:rounded-2xl 2md:shadow-lg p-6 md:p-10">
                    <h2 className="mb-6 text-2xl font-bold text-gray-800">Personal Information</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col">
                            <label htmlFor="full_name" className="mb-1 text-xs text-gray-600">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                id="full_name"
                                name="full_name"
                                autoComplete="name"
                                value={formData.full_name}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="username" className="mb-1 text-xs text-gray-600">
                                Username *
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                autoComplete="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="email" className="mb-1 text-xs text-gray-600">
                                Email ID *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="dob" className="mb-1 text-xs text-gray-600">
                                Date of Birth *
                            </label>
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
                            <label htmlFor="gender" className="mb-1 text-xs text-gray-600">
                                Gender *
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                autoComplete="sex"
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
                            <label htmlFor="mobile" className="mb-1 text-xs text-gray-600">
                                Mobile No *
                            </label>
                            <input
                                type="tel"
                                id="mobile"
                                name="mobile"
                                autoComplete="tel"
                                value={formData.mobile}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col md:col-span-2">
                            <label htmlFor="address" className="mb-1 text-xs text-gray-600">
                                Address *
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                autoComplete="street-address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={3}
                                className={inputClass}
                                maxLength={200}
                            />
                        </div>

                        <div className="mt-4 flex justify-end gap-4 md:col-span-2">
                            <button
                                type="submit"
                                disabled={!isFormComplete()}
                                className={`rounded-xl px-6 py-2 font-medium transition ${
                                    isFormComplete()
                                        ? 'bg-violet-600 text-white hover:bg-violet-700'
                                        : 'cursor-not-allowed bg-gray-300 text-gray-600'
                                }`}
                            >
                                Update
                            </button>
                            {onCancel && (
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="rounded-xl bg-gray-200 px-6 py-2 text-gray-800 transition hover:bg-gray-300"
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
