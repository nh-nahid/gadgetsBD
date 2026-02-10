"use client";

import { useState } from "react";
import ShopView from "./ShopView";
import ShopEdit from "./ShopEdit";
import { useShop } from "@/app/context/ShopContext";

export default function ShopProfilePage() {
  const { shop, setShop } = useShop(); // use context directly
  const [isEditMode, setIsEditMode] = useState(false);

  if (!shop) return null; // wait until shop is loaded

  // Merge defaults with context shop
  const defaultShop = {
    name: "",
    shopSlug: "",
    ownerName: "",
    email: "",
    phone: "",
    description: "No description provided",
    coverImage: "/placeholder.png",
    location: { city: "Unknown", country: "Bangladesh" },
    address: "",
    rating: { average: 0, count: 0 },
    specializesIn: ["General"],
    yearEstablished: new Date().getFullYear(),
    employees: 0,
    brands: [],
    website: "",
    ...shop, // context shop is reactive
  };

  return (
    <main className="max-w-[1200px] mx-auto w-full p-6">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-normal">Shop Profile</h1>
          <p className="text-sm text-gray-600">
            Manage your shop information and appearance on Gadgets BD
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditMode(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            View Mode
          </button>
          <button
            onClick={() => setIsEditMode(true)}
            className="px-4 py-2 bg-amazon-yellow hover:bg-amazon-yellow_hover border border-amazon-secondary rounded-md text-sm font-bold transition-colors"
          >
            Edit Mode
          </button>
        </div>
      </div>

      {isEditMode ? (
        <ShopEdit shop={defaultShop} setIsEditMode={setIsEditMode} setShop={setShop} />
      ) : (
        <ShopView shop={defaultShop} />
      )}
    </main>
  );
}
