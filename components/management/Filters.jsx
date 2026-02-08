"use client";

import { useState, useEffect } from "react";

export default function Filters({ onFilter }) {
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    brand: "",
    search: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const timeout = setTimeout(() => onFilter?.(filters), 300);
    return () => clearTimeout(timeout);
  }, [filters]);

  return (
    <div className="bg-white border border-gray-300 rounded shadow-sm p-4 mb-6 flex flex-wrap items-center gap-4 text-sm">
      
      <div className="flex items-center gap-2">
        <span className="font-bold">Status:</span>
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="border border-gray-300 py-1 px-2 rounded outline-none focus:ring-1 focus:ring-amazon-blue"
        >
          <option value="">All</option>
          <option value="In Stock">In Stock</option>   
          <option value="Low Stock">Low Stock</option> 
          <option value="Out of Stock">Out of Stock</option> 
        </select>
      </div>

      <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
        <span className="font-bold">Category:</span>
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="border border-gray-300 py-1 px-2 rounded outline-none focus:ring-1 focus:ring-amazon-blue"
        >
          <option value="">All Categories</option>
          <option>Laptops & Computers</option>
          <option>Smartphones & Tablets</option>
          <option>Audio & Headphones</option>
          <option>Gaming Accessories</option>
        </select>
      </div>

      <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
        <span className="font-bold">Brand:</span>
        <select
          name="brand"
          value={filters.brand}
          onChange={handleChange}
          className="border border-gray-300 py-1 px-2 rounded outline-none focus:ring-1 focus:ring-amazon-blue"
        >
          <option value="">All Brands</option>
          <option>Apple</option>
          <option>Samsung</option>
          <option>Dell</option>
          <option>HP</option>
        </select>
      </div>

      <div className="flex-1 flex items-center gap-2 border-l border-gray-300 pl-4">
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search by SKU or Name"
          className="w-full max-w-sm pl-3 pr-2 py-1 border border-gray-300 rounded outline-none focus:ring-1 focus:ring-amazon-blue"
        />
      </div>
    </div>
  );
}
