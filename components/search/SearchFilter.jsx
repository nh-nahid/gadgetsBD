"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { slugify } from "@/utils/slugify";
import { debounce } from "lodash";

// Mapping: short display name => full category => URL slug
const categoryMap = [
  { label: "All", full: "All" },
  { label: "Laptops", full: "Laptops & Computers" },
  { label: "Phones", full: "Smartphones & Tablets" },
  { label: "Audio", full: "Audio & Headphones" },
  { label: "Gaming", full: "Gaming Accessories" },
  { label: "Cameras", full: "Cameras & Photography" },
  { label: "Wearables", full: "Wearables & Smartwatches" },
];

const SearchFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Initial values from URL
  const initialQuery = searchParams.get("q") || "";
  const initialCategorySlug = searchParams.get("category") || "all";
  const initialCategoryLabel =
    categoryMap.find((c) => slugify(c.full) === initialCategorySlug)?.label || "All";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryLabel);

  const firstRender = useRef(true);

  // --- Debounced search function
  const performSearch = useMemo(
    () =>
      debounce((q, label) => {
        const catObj = categoryMap.find((c) => c.label === label);

        // Skip redirect if no query and category is "All"
        if (!q && (!catObj || catObj.label === "All")) return;

        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (catObj && catObj.label !== "All") params.set("category", slugify(catObj.full));

        router.push(`/products?${params.toString()}`);
      }, 800),
    [router]
  );

  // --- Effect for query changes
  useEffect(() => {
    // Skip on first render to prevent auto redirect
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    performSearch(query, selectedCategory);
    return () => performSearch.cancel();
  }, [query, selectedCategory, performSearch]);

  // --- Category change handler
const handleCategoryChange = (e) => {
  const value = e.target.value;
  setSelectedCategory(value);

  const catObj = categoryMap.find((c) => c.label === value);
  const params = new URLSearchParams(searchParams.toString());

  // Remove existing category param (this clears the filter)
  params.delete("category");

  // Only set category param if not "All"
  if (catObj && catObj.label !== "All") {
    params.set("category", slugify(catObj.full));
  }

  // Always push new URL — even if "All"
  router.push(`/products?${params.toString()}`);
};


  return (
    <div className="flex-1 flex h-10 rounded-md overflow-hidden focus-within:ring-3 focus-within:ring-amazon-secondary">
      {/* Category Select */}
      <select
        className="bg-gray-100 text-black text-xs px-2 border-r border-gray-300 cursor-pointer hover:bg-gray-200"
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        {categoryMap.map((cat, idx) => (
          <option key={idx} value={cat.label}>
            {cat.label}
          </option>
        ))}
      </select>

      {/* Search Input */}
      <input
        type="text"
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Gadgets, Laptops, Phones..."
        className="flex-1 px-3 text-black outline-none"
      />

      {/* Search Button */}
      <button
        onClick={() => performSearch.flush()}
        className="bg-amazon-secondary hover:bg-[#fa8900] px-4 flex items-center justify-center"
      >
        <Search className="text-black w-5 h-5" />
      </button>
    </div>
  );
};

export default SearchFilter;
