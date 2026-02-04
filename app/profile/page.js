"use client";
import React, { useEffect, useState } from "react";
import ShopProfilePage from "@/components/profile/ShopProfilePage";

export default function ProfilePage() {
  const [shop, setShop] = useState(null);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await fetch("/api/profile/shop");
        if (!res.ok) throw new Error("Failed to fetch shop");
        const data = await res.json();
     
        if (data.shop) setShop(data.shop);
      } catch (err) {
        console.error("Error fetching shop:", err);
      }
    };

    fetchShop();
  }, []);

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amazon-blue mb-4"></div>
        <p className="text-gray-700 text-lg font-medium">
          Loading shop details...
        </p>
      </div>
    );
  }


  return <ShopProfilePage shop={shop} setShop={setShop} />;
}
