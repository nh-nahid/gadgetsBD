"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { slugify } from "@/utils/slugify";
import { debounce } from "lodash";

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

  const initialQuery = searchParams.get("q") || "";
  const initialCategorySlug = searchParams.get("category") || "all";
  const initialCategoryLabel =
    categoryMap.find((c) => slugify(c.full) === initialCategorySlug)?.label || "All";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryLabel);

  const firstRender = useRef(true);

  const performSearch = useMemo(
    () =>
      debounce((q, label) => {
        const catObj = categoryMap.find((c) => c.label === label);

        if (!q && (!catObj || catObj.label === "All")) return;

        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (catObj && catObj.label !== "All") params.set("category", slugify(catObj.full));

        router.push(`/products?${params.toString()}`);
      }, 800),
    [router]
  );

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    performSearch(query, selectedCategory);
    return () => performSearch.cancel();
  }, [query, selectedCategory, performSearch]);

const handleCategoryChange = (e) => {
  const value = e.target.value;
  setSelectedCategory(value);

  const catObj = categoryMap.find((c) => c.label === value);
  const params = new URLSearchParams(searchParams.toString());

  params.delete("category");

  if (catObj && catObj.label !== "All") {
    params.set("category", slugify(catObj.full));
  }

  router.push(`/products?${params.toString()}`);
};


  return (
    <div className="flex-1 flex h-10 rounded-md overflow-hidden focus-within:ring-3 focus-within:ring-amazon-secondary">
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

      <input
        type="text"
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Gadgets, Laptops, Phones..."
        className="flex-1 px-3 text-black outline-none"
      />

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
