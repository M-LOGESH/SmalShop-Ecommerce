import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Header from "./components/Header.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import Account from "./pages/Account.jsx";
import Home from "./pages/Home.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import ScrollToTop from "./ScrollToTop";


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
            <ScrollToTop />
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

            {/* Routes directly without <main> */}
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/account"
                        element={
                            <ProtectedRoute>
                                <Account user={user} onLogout={logout} />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>

        </Router>
    );
}

export default App;
