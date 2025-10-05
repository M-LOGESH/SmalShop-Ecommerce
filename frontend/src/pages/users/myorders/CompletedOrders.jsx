import React from 'react';
import { FaCheckCircle, FaChevronRight } from 'react-icons/fa';

export default function CompletedOrders({ orders }) {
  const completedOrders = orders.filter((order) => order.status === 'completed');

  if (!completedOrders.length)
    return <p className="text-gray-500">No completed orders.</p>;

  const formatDateTime = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="flex flex-col gap-2">
      {completedOrders.map((order) => (
        <div
          key={order.id}
          className="relative rounded-lg bg-white p-3 shadow-md sm:p-5 flex items-center justify-between hover:bg-gray-50"
        >
          {/* Left section */}
          <div className="flex flex-col w-full">
            <p className="text-sm font-semibold">{order.order_number}</p>

            {/* Items count and Total price on same line */}
            <div className="flex-row sm:items-center w-full">
              <span className="text-gray-600 text-sm font-medium">
                {order.items.length} item(s)
              </span>
              <span className="text-gray-800 text-sm sm:text-base font-bold sm:absolute sm:left-1/2 sm:translate-x-[-50%]">
               {' '} ₹{order.total_price}
              </span>
            </div>

            {/* Picked at */}
            <p className="mt-1 flex items-center gap-1 text-sm text-gray-700">
              <FaCheckCircle className="text-green-600" />
              <span>Picked at: {formatDateTime(order.updated_at)}</span>
            </p>
          </div>

          {/* Right Chevron */}
          <FaChevronRight className="ml-2" />
        </div>
      ))}
    </div>
  );
}
