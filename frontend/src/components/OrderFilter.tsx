import React from "react";

interface OrderFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts?: Record<string, number>;
}

const OrderFilter: React.FC<OrderFilterProps> = ({
  activeFilter,
  onFilterChange,
  counts = {},
}) => {
  const filters = [
    { id: "all", name: "All Orders" },
    { id: "pending", name: "Pending" },
    { id: "preparing", name: "Preparing" },
    { id: "ready", name: "Ready" },
    { id: "out for delivery", name: "Out for Delivery" },
    { id: "cancelled", name: "Cancelled" },
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-3 py-1.5 text-sm rounded-full ${
              activeFilter === filter.id
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {filter.name}
            {counts && counts[filter.id] > 0 && (
              <span className="ml-2 bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded-full text-xs">
                {counts[filter.id]}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrderFilter;
