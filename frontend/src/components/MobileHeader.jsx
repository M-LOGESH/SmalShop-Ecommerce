import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiShoppingCart } from "react-icons/fi";

function MobileHeader({ title }) {
    const navigate = useNavigate();
    return (
        <div className="sm:hidden flex items-center justify-between bg-violet-600 text-white px-4 py-3 shadow">
            <button onClick={() => navigate(-1)} className="flex items-center">
                <FiArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-medium">{title}</h1>
            <button onClick={() => navigate("/cart")}>
                <FiShoppingCart size={20} />
            </button>
        </div>
    );
}

export default MobileHeader;
