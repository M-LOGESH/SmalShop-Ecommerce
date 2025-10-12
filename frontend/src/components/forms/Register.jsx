import React, { useState } from 'react';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function Register({ onClose, onRegisterSuccess, onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' }); // clear error on typing
    };

    // Frontend password validation mirroring Django AlphaNumericValidator
    const validatePassword = (password) => {
        if (password.length < 8) return 'Password must be at least 8 alphanumeric characters.';
        if ((password.match(/[A-Za-z]/g) || []).length < 4)
            return 'Password must contain at least 4 letters.';
        if ((password.match(/\d/g) || []).length < 3)
            return 'Password must contain at least 3 numbers.';
        return ''; // No error
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // reset errors
        setIsLoading(true);

        const { username, email, password, confirmPassword } = formData;

        // Check if passwords match
        if (password !== confirmPassword) {
            setErrors({ confirmPassword: 'Passwords do not match!' });
            setIsLoading(false);
            return;
        }

        // Validate password frontend rules
        const passwordError = validatePassword(password);
        if (passwordError) {
            setErrors({ password: passwordError });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/api/users/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Convert all backend error arrays to strings
                const formattedErrors = {};
                Object.keys(data).forEach((key) => {
                    formattedErrors[key] = Array.isArray(data[key])
                        ? data[key].join(', ')
                        : data[key];
                });
                setErrors(formattedErrors);
                setIsLoading(false);
                return;
            }

            onRegisterSuccess({
                username: data.username,
                email: data.email,
                is_staff: data.is_staff,
                is_superuser: data.is_superuser,
                access: data.access,
                refresh: data.refresh,
            });
            onClose();
        } catch (error) {
            console.error('Network error:', error);
            setErrors({ general: 'Error connecting to server.' });
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <form
                onSubmit={handleSubmit}
                className="relative mx-4 w-full max-w-md rounded bg-white p-6 shadow-md sm:mx-auto sm:p-8"
            >
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="flex-1 text-center text-2xl font-bold text-violet-600">
                        Create Account
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className={`text-sm transition-colors ${
                            isLoading
                                ? 'cursor-not-allowed text-gray-400'
                                : 'text-gray-500 hover:text-violet-700'
                        }`}
                    >
                        ✖
                    </button>
                </div>

                {/* Username */}
                <div className="mb-4">
                    <div className="relative">
                        <FiUser
                            className={`absolute top-1/2 left-3 -translate-y-1/2 ${
                                isLoading ? 'text-gray-300' : 'text-gray-400'
                            }`}
                            size={20}
                        />
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={`w-full rounded border-2 px-3 py-2 pl-10 transition-all focus:outline-none ${
                                errors.username
                                    ? 'border-red-500'
                                    : isLoading
                                      ? 'cursor-not-allowed border-gray-200 bg-gray-50'
                                      : 'border-gray-400 focus:border-violet-600'
                            }`}
                            autoComplete="username"
                            required
                        />
                    </div>
                    {errors.username && (
                        <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                    )}
                </div>

                {/* Email */}
                <div className="mb-4">
                    <div className="relative">
                        <FiMail
                            className={`absolute top-1/2 left-3 -translate-y-1/2 ${
                                isLoading ? 'text-gray-300' : 'text-gray-400'
                            }`}
                            size={20}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={`w-full rounded border-2 px-3 py-2 pl-10 transition-all focus:outline-none ${
                                errors.email
                                    ? 'border-red-500'
                                    : isLoading
                                      ? 'cursor-not-allowed border-gray-200 bg-gray-50'
                                      : 'border-gray-400 focus:border-violet-600'
                            }`}
                            autoComplete="email"
                            required
                        />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="mb-4">
                    <div className="relative">
                        <FiLock
                            className={`absolute top-1/2 left-3 -translate-y-1/2 ${
                                isLoading ? 'text-gray-300' : 'text-gray-400'
                            }`}
                            size={20}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={`w-full rounded border-2 px-3 py-2 pl-10 transition-all focus:outline-none ${
                                errors.password
                                    ? 'border-red-500'
                                    : isLoading
                                      ? 'cursor-not-allowed border-gray-200 bg-gray-50'
                                      : 'border-gray-400 focus:border-violet-600'
                            }`}
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                    <div className="relative">
                        <FiLock
                            className={`absolute top-1/2 left-3 -translate-y-1/2 ${
                                isLoading ? 'text-gray-300' : 'text-gray-400'
                            }`}
                            size={20}
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={`w-full rounded border-2 px-3 py-2 pl-10 transition-all focus:outline-none ${
                                errors.confirmPassword
                                    ? 'border-red-500'
                                    : isLoading
                                      ? 'cursor-not-allowed border-gray-200 bg-gray-50'
                                      : 'border-gray-400 focus:border-violet-600'
                            }`}
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                </div>

                {/* General error */}
                {errors.general && (
                    <p className="mb-4 text-center text-red-500">{errors.general}</p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full rounded py-2 font-medium text-white transition-colors duration-300 ${
                        isLoading
                            ? 'cursor-not-allowed bg-violet-400'
                            : 'bg-violet-600 hover:bg-violet-700 active:scale-95'
                    }`}
                >
                    Sign Up
                </button>

                <p
                    className={`mt-4 text-center transition-opacity ${
                        isLoading ? 'text-gray-400' : 'text-gray-600'
                    }`}
                >
                    Already have an account?{' '}
                    <span
                        onClick={() => {
                            if (!isLoading) {
                                onClose();
                                onSwitchToLogin();
                            }
                        }}
                        className={`cursor-pointer font-medium transition-colors ${
                            isLoading
                                ? 'cursor-not-allowed text-gray-400'
                                : 'text-violet-600 hover:text-violet-700 hover:underline'
                        }`}
                    >
                        Log In
                    </span>
                </p>

                {/* Loading overlay for the entire form */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded bg-white/80">
                        <div className="flex flex-col items-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
                            <p className="mt-2 text-sm text-gray-600">Creating Account...</p>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}

export default Register;
