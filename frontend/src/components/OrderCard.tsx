import React from "react";
import StatusBadge from "./StatusBadge";

interface OrderCardProps {
  order: any;
  onStatusChange: (orderId: string, status: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusChange }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "pending":
        return "preparing";
      case "preparing":
        return "ready";
      case "ready":
        return "out for delivery";
      case "out for delivery":
        return "delivered";
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus(order.status);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">
              Order #{order._id.substring(0, 8)}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700">Customer Details:</p>
          <p className="text-sm text-gray-600">{order.customerName}</p>
          <p className="text-sm text-gray-600">{order.customerContact}</p>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700">Items:</p>
          <ul className="mt-2 space-y-2">
            {order.items.map((item: any, idx: number) => (
              <li
                key={idx}
                className="text-sm text-gray-600 flex justify-between"
              >
                <span>
                  {item.quantity}x {item.menuItemId?.name || "Unknown Item"}
                </span>
                <span>
                  ${((item.menuItemId?.price || 0) * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <span className="font-medium">
            Total: ${order.totalPrice?.toFixed(2) || "0.00"}
          </span>

          <div className="flex space-x-2">
            {order.status !== "cancelled" && order.status !== "delivered" && (
              <button
                onClick={() => onStatusChange(order._id, "cancelled")}
                className="text-xs px-2 py-1 border border-red-300 text-red-700 rounded hover:bg-red-50"
              >
                Cancel
              </button>
            )}

            {nextStatus && (
              <button
                onClick={() => onStatusChange(order._id, nextStatus)}
                className="text-xs px-2 py-1 bg-black text-white rounded hover:bg-gray-800"
              >
                Mark as{" "}
                {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
