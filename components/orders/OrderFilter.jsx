"use client";

import { useEffect, useState } from "react";

const OrderFilter = ({ orders = [], onFilter }) => {
  const [filter, setFilter] = useState("past-3-months");
  const [filteredCount, setFilteredCount] = useState(orders.length);

  useEffect(() => {
    const now = new Date();

    const filtered = orders.filter((order) => {
      const date = new Date(order.createdAt);

      if (filter === "past-3-months") {
        const past = new Date();
        past.setMonth(now.getMonth() - 3);
        return date >= past;
      }

      if (filter === "2024") {
        return date.getFullYear() === 2024;
      }

      if (filter === "2023") {
        return date.getFullYear() === 2023;
      }

      return true;
    });

    setFilteredCount(filtered.length);
    onFilter(filtered);
  }, [filter, orders, onFilter]);

  return (
    <div className="text-sm mb-6 flex items-center gap-1">
      <span className="font-bold">
        {filteredCount} order{filteredCount !== 1 ? "s" : ""}
      </span>
      <span>from</span>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="bg-gray-100 border border-gray-300 rounded shadow-sm px-2 py-1 text-xs outline-none hover:bg-gray-200"
      >
        <option value="past-3-months">past 3 months</option>
        <option value="2024">2024</option>
        <option value="2023">2023</option>
      </select>
    </div>
  );
};

export default OrderFilter;
