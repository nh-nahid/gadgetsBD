"use client";
import React, { useEffect, useState } from "react";
import ShopProfilePage from "@/components/profile/ShopProfilePage";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return; 

    const fetchShop = async () => {
      try {
        const res = await fetch("/api/profile/shop");
        if (!res.ok) throw new Error("Failed to fetch shop");
        const data = await res.json();
        setShop(data.shop || null);
      } catch (err) {
        console.error("Error fetching shop:", err);
        setShop(null);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [session]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amazon-blue mb-4"></div>
        <p className="text-gray-700 text-lg font-medium">Loading shop details...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-700 text-lg font-medium">You don&apos;t have a shop yet.</p>
      </div>
    );
  }

  return <ShopProfilePage shop={shop} setShop={setShop} />;
}
