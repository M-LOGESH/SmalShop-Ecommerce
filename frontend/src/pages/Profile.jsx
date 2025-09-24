import React from "react";
import { useNavigate } from "react-router-dom";

function UserOptions({ user, onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate("/"); // redirect to homepage after logout
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-6">
            <h2 className="text-2xl font-bold mb-6">Hello, {user.username}</h2>

            {!user.is_staff ? (
                <div className="flex flex-col space-y-4 w-full max-w-xs">
                    <button
                        className="bg-violet-600 text-white py-2 rounded hover:bg-violet-700"
                        onClick={() => navigate("/my-account")}
                    >
                        View Profile
                    </button>
                    <button
                        className="bg-violet-600 text-white py-2 rounded hover:bg-violet-700"
                        onClick={() => navigate("/orders")}
                    >
                        My Orders
                    </button>
                </div>
            ) : (
                <div className="flex flex-col space-y-4 w-full max-w-xs">
                    <button
                        className="bg-violet-600 text-white py-2 rounded hover:bg-violet-700"
                        onClick={() => navigate("/manage-items")}
                    >
                        Manage Items
                    </button>
                    <button
                        className="bg-violet-600 text-white py-2 rounded hover:bg-violet-700"
                        onClick={() => navigate("/view-orders")}
                    >
                        View Orders
                    </button>
                </div>
            )}

            <button
                className="mt-6 bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
}

export default UserOptions;
