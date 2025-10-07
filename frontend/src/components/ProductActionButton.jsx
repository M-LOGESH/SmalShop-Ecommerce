import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function ProductActionButton({
  product,
  cartItem,
  addToCart,
  updateCartQuantity,
  size = "normal", // new prop: "normal" or "small"
  className = "",
}) {
  const { user } = useAuth(); // Get user from auth context
  
  const baseBtn =
    size === "small"
      ? "px-2 py-1 text-xs gap-2 max-w-21"
      : "px-2 py-1 text-sm"; // adjusts padding & text size

  // If user is staff, show disabled state
  if (user?.is_staff) {
    return (
      <button
        disabled
        className={`w-full cursor-not-allowed rounded bg-gray-400 font-semibold text-white ${baseBtn} ${className}`}
      >
        Staff View
      </button>
    );
  }

  // Out of stock
  if (product.stock_status === "out_of_stock") {
    return (
      <button
        disabled
        className={`w-full cursor-not-allowed rounded bg-gray-400 font-semibold text-white ${baseBtn} ${className}`}
      >
        Out of Stock
      </button>
    );
  }

  // Already in cart
  if (cartItem) {
    return (
      <div
        className={`flex items-center justify-between rounded bg-violet-900 font-bold text-white ${baseBtn} ${className}`}
      >
        <button
          onClick={() => updateCartQuantity(cartItem.id, cartItem.quantity - 1)}
          className="flex items-center justify-center"
        >
          <FaMinus size={size === "small" ? 10 : 12} />
        </button>
        <span className="px-1">{cartItem.quantity}</span>
        <button
          onClick={() => updateCartQuantity(cartItem.id, cartItem.quantity + 1)}
          className="flex items-center justify-center"
        >
          <FaPlus size={size === "small" ? 10 : 12} />
        </button>
      </div>
    );
  }

  // Not in cart
  return (
    <button
      className={`w-full rounded bg-violet-900 font-semibold text-white hover:bg-violet-800 ${baseBtn} ${className}`}
      onClick={() => addToCart(product.id)}
    >
      Add
    </button>
  );
}