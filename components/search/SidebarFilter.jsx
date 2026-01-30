"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { slugify } from "@/utils/slugify";

export default function SidebarFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --------------------------
  // Filter options
  // --------------------------
  const categories = [
    "Laptops & Computers",
    "Smartphones & Tablets",
    "Audio & Headphones",
    "Gaming Accessories",
    "Cameras & Photography",
    "Wearables & Smartwatches",
  ];

  const categoryMap = {
    "Laptops & Computers": "Laptops",
    "Smartphones & Tablets": "phones",
    "Audio & Headphones": "Audio",
    "Gaming Accessories": "Gaming",
    "Cameras & Photography": "Cameras",
    "Wearables & Smartwatches": "Wearables",
  };

  const brands = ["Apple", "Samsung", "Dell", "HP", "Lenovo", "Sony", "Razer"];
  const prices = [
    "Under ৳10,000",
    "৳10,000 - ৳25,000",
    "৳25,000 - ৳50,000",
    "৳50,000 - ৳1,00,000",
    "Over ৳1,00,000",
  ];
  const conditions = ["New", "Renewed"];
  const availability = ["In Stock", "Pre-Order"];
  const reviews = ["★★★★☆ & Up", "★★★☆☆ & Up"];

  // --------------------------
  // Selected state
  // --------------------------
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [selectedReviews, setSelectedReviews] = useState([]);

  // --------------------------
  // Sync state with URL
  // --------------------------
  useEffect(() => {
    const getSelected = (key) =>
      searchParams.getAll(key).filter((v) => v.toLowerCase() !== "all");

    setSelectedCategories(getSelected("category"));
    setSelectedBrands(getSelected("brand"));
    setSelectedPrices(getSelected("price"));
    setSelectedConditions(getSelected("condition"));
    setSelectedAvailability(getSelected("availability"));
    setSelectedReviews(getSelected("review"));
  }, [searchParams?.toString()]);

  // --------------------------
  // Toggle handler
  // --------------------------
  const handleToggle = (stateArray, setState, key, value) => {
    let newSelected;
    if (stateArray.includes(value)) {
      newSelected = stateArray.filter((v) => v !== value);
    } else {
      newSelected = [...stateArray, value];
    }
    setState(newSelected);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    newSelected.forEach((v) => params.append(key, v));
    router.push(`/products?${params.toString()}`);
  };

  const isSelected = (stateArray, value) => stateArray.includes(value);

  // --------------------------
  // Generic checkbox renderer
  // --------------------------
  const renderCheckboxList = (items, stateArray, setState, key, mapFn) =>
    items.map((item, idx) => {
      const value = mapFn ? mapFn(item) : slugify(item);
      return (
        <label
          key={idx}
          className="flex items-center gap-2 cursor-pointer hover:text-amazon-orange"
        >
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-amazon-secondary focus:ring-amazon-secondary"
            checked={isSelected(stateArray, value)}
            onChange={() => handleToggle(stateArray, setState, key, value)}
          />
          <span className="text-sm">{item}</span>
        </label>
      );
    });

  // --------------------------
  // Price slug helper
  // --------------------------
  const priceSlug = (price) => {
    switch (price) {
      case "Under ৳10,000":
        return "under-10000";
      case "৳10,000 - ৳25,000":
        return "10000-25000";
      case "৳25,000 - ৳50,000":
        return "25000-50000";
      case "৳50,000 - ৳1,00,000":
        return "50000-100000";
      case "Over ৳1,00,000":
        return "over-100000";
      default:
        return slugify(price);
    }
  };

  // --------------------------
  // Category mapping for URL
  // --------------------------
  const categorySlug = (category) => slugify(categoryMap[category] || category);

  // --------------------------
  // Review slug mapping
  // --------------------------
  const reviewSlug = (reviewText) => {
    if (reviewText.startsWith("★★★★")) return "4-star-up";
    if (reviewText.startsWith("★★★")) return "3-star-up";
    return slugify(reviewText);
  };

  return (
    <div className="w-64 hidden lg:block flex-shrink-0 border-r pr-4 space-y-6">
      {/* Category */}
      <div>
        <h3 className="font-bold text-base mb-3">Category</h3>
        <div className="space-y-2">
          {renderCheckboxList(
            categories,
            selectedCategories,
            setSelectedCategories,
            "category",
            categorySlug
          )}
        </div>
      </div>

      {/* Brand */}
      <div className="border-t pt-4">
        <h3 className="font-bold text-base mb-3">Brand</h3>
        <div className="space-y-2">
          {renderCheckboxList(brands, selectedBrands, setSelectedBrands, "brand")}
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="border-t pt-4">
        <h3 className="font-bold text-base mb-3">Customer Reviews</h3>
        <div className="space-y-2">
          {renderCheckboxList(
            reviews,
            selectedReviews,
            setSelectedReviews,
            "review",
            reviewSlug
          )}
        </div>
      </div>

      {/* Price */}
      <div className="border-t pt-4">
        <h3 className="font-bold text-base mb-3">Price</h3>
        <div className="space-y-2">
          {renderCheckboxList(prices, selectedPrices, setSelectedPrices, "price", priceSlug)}
        </div>
      </div>

      {/* Availability */}
      <div className="border-t pt-4">
        <h3 className="font-bold text-base mb-3">Availability</h3>
        <div className="space-y-2">
          {renderCheckboxList(
            availability,
            selectedAvailability,
            setSelectedAvailability,
            "availability"
          )}
        </div>
      </div>

      {/* Condition */}
      <div className="border-t pt-4">
        <h3 className="font-bold text-base mb-3">Condition</h3>
        <div className="space-y-2">
          {renderCheckboxList(
            conditions,
            selectedConditions,
            setSelectedConditions,
            "condition"
          )}
        </div>
      </div>
    </div>
  );
}
