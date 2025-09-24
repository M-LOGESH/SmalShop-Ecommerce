import React, { useState } from "react";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

function Register({ onClose, onRegisterSuccess, onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({}); // field-wise errors

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" }); // clear error on typing
    };

    // Frontend password validation mirroring Django AlphaNumericValidator
    const validatePassword = (password) => {
        if (password.length < 8) return "Password must be at least 8 alphanumeric characters.";
        if ((password.match(/[A-Za-z]/g) || []).length < 4) return "Password must contain at least 4 letters.";
        if ((password.match(/\d/g) || []).length < 3) return "Password must contain at least 3 numbers.";
        return ""; // No error
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // reset errors

        const { username, email, password, confirmPassword } = formData;

        // Check if passwords match
        if (password !== confirmPassword) {
            setErrors({ confirmPassword: "Passwords do not match!" });
            return;
        }

        // Validate password frontend rules
        const passwordError = validatePassword(password);
        if (passwordError) {
            setErrors({ password: passwordError });
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/users/register/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Convert all backend error arrays to strings
                const formattedErrors = {};
                Object.keys(data).forEach((key) => {
                    formattedErrors[key] = Array.isArray(data[key])
                        ? data[key].join(", ")
                        : data[key];
                });
                setErrors(formattedErrors);
                return;
            }

            onRegisterSuccess({
                username: data.username,
                email: data.email,
                is_staff: data.is_staff,
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
                        Create Account
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
                        <FiUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`w-full pl-10 px-3 py-2 border-2 rounded focus:outline-none ${errors.username ? "border-red-500" : "border-gray-400 focus:border-violet-600"}`}
                            autoComplete="username"
                            required
                        />
                    </div>
                    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                </div>

                {/* Email */}
                <div className="mb-4">
                    <div className="relative">
                        <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full pl-10 px-3 py-2 border-2 rounded focus:outline-none ${errors.email ? "border-red-500" : "border-gray-400 focus:border-violet-600"}`}
                            autoComplete="email"
                            required
                        />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="mb-4">
                    <div className="relative">
                        <FiLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full pl-10 px-3 py-2 border-2 rounded focus:outline-none ${errors.password ? "border-red-500" : "border-gray-400 focus:border-violet-600"}`}
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                    <div className="relative">
                        <FiLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full pl-10 px-3 py-2 border-2 rounded focus:outline-none ${errors.confirmPassword ? "border-red-500" : "border-gray-400 focus:border-violet-600"}`}
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* General error */}
                {errors.general && <p className="text-red-500 text-center mb-4">{errors.general}</p>}

                <button
                    type="submit"
                    className="w-full bg-violet-600 text-white py-2 rounded hover:bg-violet-700 transition"
                >
                    Sign Up
                </button>

                <p className="mt-4 text-center text-gray-600">
                    Already have an account?{" "}
                    <span
                        onClick={() => {
                            onClose();
                            onSwitchToLogin();
                        }}
                        className="text-violet-600 font-medium cursor-pointer hover:underline"
                    >
                        Log In
                    </span>
                </p>
            </form>
        </div>
    );
}

export default Register;
