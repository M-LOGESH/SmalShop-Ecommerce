import React, { useState } from 'react';
import { FiUser, FiLock } from 'react-icons/fi';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function Login({ onClose, onLoginSuccess, onSwitchToRegister }) {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' }); // clear error on typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // reset errors
        setIsLoading(true);
        setIsSuccess(false);

        try {
            const response = await fetch(`${API_BASE}/api/users/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                // backend sends { "username": [...], "password": [...] }
                setErrors({
                    username: data.username?.[0] || '',
                    password: data.password?.[0] || '',
                });
                setIsLoading(false);
                return;
            }

            // Show success state briefly before closing
            setIsSuccess(true);
            
            // Wait a moment to show success animation
            setTimeout(() => {
                onLoginSuccess({
                    username: data.username,
                    email: data.email,
                    is_staff: data.is_staff,
                    is_superuser: data.is_superuser,
                    access: data.access,
                    refresh: data.refresh,
                    profile: data.profile || {}, 
                });
                onClose();
            }, 600);
            
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
                        {isSuccess ? 'Welcome Back!' : 'Log In'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className={`text-sm transition-colors ${
                            isLoading ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:text-violet-700'
                        }`}
                    >
                        ✖
                    </button>
                </div>

                {/* Success Animation */}
                {isSuccess && (
                    <div className="mb-4 flex justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <svg 
                                className="h-6 w-6 text-green-600" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={3} 
                                    d="M5 13l4 4L19 7" 
                                />
                            </svg>
                        </div>
                    </div>
                )}

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
                            placeholder="Username or Email"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={isLoading || isSuccess}
                            className={`w-full rounded border-2 px-3 py-2 pl-10 transition-all focus:outline-none ${
                                errors.username
                                    ? 'border-red-500'
                                    : isLoading || isSuccess
                                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                    : 'border-gray-300 focus:border-violet-600'
                            }`}
                            autoComplete="username"
                            required
                        />
                    </div>
                    {errors.username && (
                        <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                    )}
                </div>

                {/* Password */}
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
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading || isSuccess}
                            className={`w-full rounded border-2 px-3 py-2 pl-10 transition-all focus:outline-none ${
                                errors.password
                                    ? 'border-red-500'
                                    : isLoading || isSuccess
                                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                    : 'border-gray-300 focus:border-violet-600'
                            }`}
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                    )}
                </div>

                {/* General error */}
                {errors.general && (
                    <p className="mb-4 text-center text-red-500">{errors.general}</p>
                )}

                <button
                    type="submit"
                    disabled={isLoading || isSuccess}
                    className={`w-full rounded py-2 text-white font-medium transition-all duration-300 ${
                        isLoading
                            ? 'bg-violet-400 cursor-not-allowed'
                            : isSuccess
                            ? 'bg-green-500 cursor-default'
                            : 'bg-violet-600 hover:bg-violet-700 active:scale-95'
                    } ${!isLoading && !isSuccess ? 'hover:shadow-lg transform hover:-translate-y-0.5' : ''}`}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                            Signing In...
                        </div>
                    ) : isSuccess ? (
                        <div className="flex items-center justify-center">
                            <svg 
                                className="h-4 w-4 text-white mr-2" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={3} 
                                    d="M5 13l4 4L19 7" 
                                />
                            </svg>
                            Success!
                        </div>
                    ) : (
                        'Sign In'
                    )}
                </button>

                <p className={`mt-4 text-center transition-opacity ${
                    isLoading || isSuccess ? 'text-gray-400' : 'text-gray-600'
                }`}>
                    Don't have an account?{' '}
                    <span
                        onClick={() => {
                            if (!isLoading && !isSuccess) {
                                onClose();
                                onSwitchToRegister();
                            }
                        }}
                        className={`cursor-pointer font-medium transition-colors ${
                            isLoading || isSuccess
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-violet-600 hover:underline hover:text-violet-700'
                        }`}
                    >
                        Register
                    </span>
                </p>

                {/* Loading overlay for the entire form */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded bg-white/80">
                        <div className="flex flex-col items-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
                            <p className="mt-2 text-sm text-gray-600">Authenticating...</p>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}

export default Login;