"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { slugify } from "@/utils/slugify";
import { debounce } from "lodash"; 

const categories = ["All", "Laptops", "Phones", "Accessories", "Gaming"];

const SearchFilter = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Debounced search function
  const performSearch = debounce(() => {
    const params = new URLSearchParams();

    if (query) params.set("q", query);
    if (selectedCategory && selectedCategory !== "all")
      params.set("category", slugify(selectedCategory));

    router.push(`/products?${params.toString()}`);
  }, 1000);

  // Run debounced search on input/category change
  useEffect(() => {
    if (query || selectedCategory) {
      performSearch();
    }
  }, [query, selectedCategory]);

  return (
    <div className="flex-1 flex h-10 rounded-md overflow-hidden focus-within:ring-3 focus-within:ring-amazon-secondary">
      {/* Category Select */}
      <select
        className="bg-gray-100 text-black text-xs px-2 border-r border-gray-300 cursor-pointer hover:bg-gray-200"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categories.map((cat, idx) => (
          <option key={idx} value={cat.toLowerCase()}>
            {cat}
          </option>
        ))}
      </select>

      {/* Search Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Gadgets, Laptops, Phones..."
        className="flex-1 px-3 text-black outline-none"
      />

      {/* Search Button */}
      <button
        onClick={() => performSearch.flush()} // trigger immediate search
        className="bg-amazon-secondary hover:bg-[#fa8900] px-4 flex items-center justify-center"
      >
        <Search className="text-black w-5 h-5" />
      </button>
    </div>
  );
};

export default SearchFilter;
