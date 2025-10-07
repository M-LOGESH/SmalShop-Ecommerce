import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const STATUS_STEPS = ["pending", "preparing", "ready"];

function OrderPage() {
  const { fetchWithAuth } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Prep");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await fetchWithAuth("http://127.0.0.1:8000/api/orders/");
      if (res.ok) {
        setOrders(await res.json());
      }
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

const updateStatus = async (orderId, newStatus) => {
  try {
    const res = await fetchWithAuth(`http://127.0.0.1:8000/api/orders/${orderId}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      loadOrders();
      // Removed auto-switch to Pickup tab
    } else {
      alert("Failed to update status");
    }
  } catch (err) {
    console.error("Error updating status:", err);
  }
};


  if (loading) return <p className="p-4 text-gray-500 min-h-screen">Loading orders...</p>;


// Filter logic + sort by first order first
// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split("T")[0];

const filteredOrders = orders
  .filter((order) => {
    if (category === "Prep") return ["pending", "preparing"].includes(order.status);
    if (category === "Pickup") return order.status === "ready";
    if (category === "cancelled") {
      // Only today's cancelled orders
      const orderDate = order.created_at?.split("T")[0]; // adjust the field name if different
      return order.status === "cancelled" && orderDate === today;
    }
    return true;
  })
  .sort((a, b) => a.id - b.id);



  return (
    <div className="max-w-4xl min-h-screen mx-auto">
      <div className="p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["Prep", "Pickup", "cancelled"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                category === cat
                  ? "bg-violet-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {cat === "Prep" && "Prep Orders"}
              {cat === "Pickup" && "Pickup Orders"}
              {cat === "cancelled" && "Cancelled Orders"}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <p className="text-gray-500">No {category} orders.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white shadow rounded-lg p-4 md:p-6">
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                  <div>
                    <p className="font-semibold text-lg">{order.order_number}</p>
                    <p className="text-gray-500 text-sm">
                      {order.items.length} item(s) - ₹{order.total_price}
                    </p>
                  </div>

                {/* Pickup Orders → Mark as Completed & Cancel buttons */}
                {category === "Pickup" && order.status === "ready" && (
                <div className="flex gap-2 mt-2 md:mt-0">
                    <button
                    onClick={() => updateStatus(order.id, "completed")}
                    className="px-3 py-1.5 bg-violet-600 text-white rounded hover:bg-violet-700 text-sm"
                    >
                    Mark as Completed
                    </button>
                    <button
                    onClick={() => updateStatus(order.id, "cancelled")}
                    className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                    Cancel
                    </button>
                </div>
                )}
                </div>

                {/* Prep Orders → Progress Bar */}
                {category === "Prep" && (
                <div className="relative flex items-center justify-between mb-8">
                    {/* Base line */}
                    <div className="absolute top-2/7 sm:top-2/6 left-5 right-5 h-0.5 bg-gray-300"></div>

                    {/* Progress line */}
                    <div
                    className="absolute top-2/7 sm:top-2/6 left-5 h-0.5 bg-violet-600 transition-all duration-500"
                    style={{
                        width: `calc(${
                        (STATUS_STEPS.indexOf(order.status) / (STATUS_STEPS.length - 1)) * 100
                        }% - 0px)`,
                    }}
                    ></div>

                    {STATUS_STEPS.map((step, idx) => {
                    const isActive = STATUS_STEPS.indexOf(order.status) >= idx;
                    return (
                        <div
                        key={step}
                        onClick={() => updateStatus(order.id, step)}
                        className="flex flex-col items-center text-sm font-medium cursor-pointer relative z-10"
                        >
                        <div
                            className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border-2 transition ${
                            isActive
                                ? "bg-violet-600 border-violet-600 text-white"
                                : "border-gray-300 bg-white text-gray-400"
                            }`}
                        >
                            {idx + 1}
                        </div>
                        <span
                            className={`mt-2 capitalize ${
                            isActive ? "text-violet-600" : "text-gray-400"
                            }`}
                        >
                            {step}
                        </span>
                        </div>
                    );
                    })}
                </div>
                )}

                {/* Products */}
                <ul className="mb-4 border-t border-gray-200 pt-3 space-y-4">
                  {order.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-wrap justify-between items-center gap-2"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-[150px]">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-200 flex items-center justify-center">
                          {item.product_detail.image ? (
                            <img
                              src={item.product_detail.image}
                              alt={item.product_detail.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-gray-400">No Img</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{item.product_detail.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.product_detail.quantity}
                          </p>
                        </div>
                      </div>

                      {/* Center: quantity */}
                      <div className="hidden sm:block text-center font-medium w-12">
                        {item.quantity}
                      </div>

                      {/* Right: price × quantity */}
                      <div className="text-right text-sm md:text-base font-medium flex-1">
                        ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-between font-bold border-t border-gray-200 pt-3 text-lg">
                  <span>Total</span>
                  <span>₹{order.total_price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderPage;
