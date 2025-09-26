import React, { useState } from "react";
import { FiUser, FiLock } from "react-icons/fi";

function Login({ onClose, onLoginSuccess, onSwitchToRegister }) {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [errors, setErrors] = useState({}); // field-wise errors

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" }); // clear error on typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // reset errors

        try {
            const response = await fetch("http://127.0.0.1:8000/api/users/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                // backend sends { "username": [...], "password": [...] }
                setErrors({
                    username: data.username?.[0] || "",
                    password: data.password?.[0] || "",
                });
                return;
            }

            onLoginSuccess({
                username: data.username,
                email: data.email,
                is_staff: data.is_staff,
                access: data.access,
                refresh: data.refresh,
                profile: data.profile || {}  // include profile info
            });


            onClose();
        } catch (error) {
            console.error("Network error:", error);
            setErrors({ general: "Error connecting to server." });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 sm:p-8 rounded shadow-md w-full max-w-md mx-4 sm:mx-auto relative"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-center flex-1 text-violet-600">
                        Log In
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-sm text-gray-500 hover:text-violet-700"
                    >
                        ✖
                    </button>
                </div>

                {/* Username */}
                <div className="mb-4">
                    <div className="relative">
                        <FiUser
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            name="username"
                            placeholder="Username or Email"
                            value={formData.username}
                            onChange={handleChange}
                            className={`w-full pl-10 px-3 py-2 border-2 rounded focus:outline-none ${errors.username
                                ? "border-red-500"
                                : "border-gray-300 focus:border-violet-600"
                                }`}
                            autoComplete="username"
                            required
                        />
                    </div>
                    {errors.username && (
                        <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                    )}
                </div>

                {/* Password */}
                <div className="mb-6">
                    <div className="relative">
                        <FiLock
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full pl-10 px-3 py-2 border-2 rounded focus:outline-none ${errors.password
                                ? "border-red-500"
                                : "border-gray-300 focus:border-violet-600"
                                }`}
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                </div>

                {/* General error */}
                {errors.general && (
                    <p className="text-red-500 text-center mb-4">{errors.general}</p>
                )}

                <button
                    type="submit"
                    className="w-full bg-violet-600 text-white py-2 rounded hover:bg-violet-700 transition"
                >
                    Sign In
                </button>

                <p className="mt-4 text-center text-gray-600">
                    Don’t have an account?{" "}
                    <span
                        onClick={() => {
                            onClose();
                            onSwitchToRegister();
                        }}
                        className="text-violet-600 font-medium cursor-pointer hover:underline"
                    >
                        Register
                    </span>
                </p>
            </form>
        </div>
    );
}

export default Login;
