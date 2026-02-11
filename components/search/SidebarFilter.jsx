"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { slugify } from "@/utils/slugify";

export default function SidebarFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const categories = [
    "Laptops & Computers",
    "Smartphones & Tablets",
    "Audio & Headphones",
    "Gaming Accessories",
    "Cameras & Photography",
    "Wearables & Smartwatches",
  ];
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

  const [selectedCategories, setSelectedCategories] = useState(["all"]);
  const [selectedBrands, setSelectedBrands] = useState(["all"]);
  const [selectedPrices, setSelectedPrices] = useState(["all"]);
  const [selectedConditions, setSelectedConditions] = useState(["all"]);
  const [selectedAvailability, setSelectedAvailability] = useState(["all"]);
  const [selectedReviews, setSelectedReviews] = useState(["all"]);

  useEffect(() => {
    if (pathname !== "/products") return;

    const getSelected = (key) => {
      const values = searchParams.getAll(key).filter((v) => v.toLowerCase() !== "all");
      return values.length ? values : ["all"];
    };

    setSelectedCategories(getSelected("category"));
    setSelectedBrands(getSelected("brand"));
    setSelectedPrices(getSelected("price"));
    setSelectedConditions(getSelected("condition"));
    setSelectedAvailability(getSelected("availability"));
    setSelectedReviews(getSelected("review"));
  }, [searchParams?.toString(), pathname]);

  const handleToggle = (stateArray, setState, key, value) => {
    let newSelected;

    if (value === "all") {
      newSelected = ["all"];
    } else {
      newSelected = stateArray.includes(value)
        ? stateArray.filter((v) => v !== value)
        : [...stateArray.filter((v) => v !== "all"), value];
      if (newSelected.length === 0) newSelected = ["all"];
    }

    setState(newSelected);

    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    newSelected.forEach((v) => params.append(key, v));

    router.push(`/products?${params.toString()}`);
  };

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
            checked={stateArray.includes(value)}
            onChange={() => handleToggle(stateArray, setState, key, value)}
          />
          <span className="text-sm">{item}</span>
        </label>
      );
    });

  const priceSlug = (p) => {
    switch (p) {
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
        return slugify(p);
    }
  };
  const categorySlug = (c) => slugify(c);
  const reviewSlug = (r) => {
    if (r.startsWith("★★★★")) return "4-star-up";
    if (r.startsWith("★★★")) return "3-star-up";
    return slugify(r);
  };
  const availabilitySlug = (a) => slugify(a);
  const conditionSlug = (c) => slugify(c);

  return (
    <div className="w-64 hidden lg:block flex-shrink-0 border-r pr-4 space-y-6">
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

      <div className="border-t pt-4">
        <h3 className="font-bold text-base mb-3">Brand</h3>
        <div className="space-y-2">
          {renderCheckboxList(brands, selectedBrands, setSelectedBrands, "brand")}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-bold text-base mb-3">Customer Reviews</h3>
        <div className="space-y-2">
          {renderCheckboxList(reviews, selectedReviews, setSelectedReviews, "review", reviewSlug)}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-bold text-base mb-3">Price</h3>
        <div className="space-y-2">
          {renderCheckboxList(prices, selectedPrices, setSelectedPrices, "price", priceSlug)}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-bold text-base mb-3">Availability</h3>
        <div className="space-y-2">
          {renderCheckboxList(
            availability,
            selectedAvailability,
            setSelectedAvailability,
            "availability",
            availabilitySlug
          )}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-bold text-base mb-3">Condition</h3>
        <div className="space-y-2">
          {renderCheckboxList(conditions, selectedConditions, setSelectedConditions, "condition", conditionSlug)}
        </div>
      </div>
    </div>
  );
}
