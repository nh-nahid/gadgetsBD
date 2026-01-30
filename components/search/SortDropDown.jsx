"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "featured";

  const handleChange = (e) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <select
      value={currentSort}
      onChange={handleChange}
      className="text-sm bg-gray-100 border border-gray-300 rounded px-2 py-1 shadow-sm focus:ring-1 focus:ring-amazon-secondary focus:border-amazon-secondary"
    >
      <option value="featured">Featured</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="rating">Avg. Customer Review</option>
      <option value="newest">Newest Arrivals</option>
    </select>
  );
}
