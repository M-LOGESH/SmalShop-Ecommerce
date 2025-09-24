import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import Profile from "./pages/Profile.jsx";
import Home from "./pages/Home.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function App() {
    // Initialize state from localStorage
    const [showRegister, setShowRegister] = useState(() => {
        return localStorage.getItem("showRegister") === "true";
    });
    const [showLogin, setShowLogin] = useState(() => {
        return localStorage.getItem("showLogin") === "true";
    });

    const { user, login, register, logout } = useAuth();

    // Persist state to localStorage whenever it changes
    const handleSetShowRegister = (val) => {
        setShowRegister(val);
        localStorage.setItem("showRegister", val);
    };

    const handleSetShowLogin = (val) => {
        setShowLogin(val);
        localStorage.setItem("showLogin", val);
    };

    return (
        <Router>
            <Header user={user} onLoginClick={() => handleSetShowLogin(true)} />


            {showRegister && (
                <Register
                    onClose={() => handleSetShowRegister(false)}
                    onRegisterSuccess={(u) => {
                        register(u);
                        handleSetShowRegister(false);
                    }}
                    onSwitchToLogin={() => {
                        handleSetShowRegister(false);
                        handleSetShowLogin(true);
                    }}
                />
            )}

            {showLogin && (
                <Login
                    onClose={() => handleSetShowLogin(false)}
                    onLoginSuccess={(u) => {
                        login(u);
                        handleSetShowLogin(false);
                    }}
                    onSwitchToRegister={() => {
                        handleSetShowLogin(false);
                        handleSetShowRegister(true);
                    }}
                />
            )}

            {/* Always show mobile bottom navbar */}
            <Navbar user={user} />

            <main className="pt-28 sm:pt-20 px-3">   {/* pushes content below header */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile user={user} onLogout={logout} />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </main>

        </Router>
    );
}


export default App;
