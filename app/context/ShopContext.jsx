"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const ShopContext = createContext(null);

export function ShopProvider({ children, initialShop = null }) {
  const { data: session, status } = useSession();
  const [shop, setShop] = useState(initialShop);

  // If session changes (like login/logout), fetch the shop again
  useEffect(() => {
    if (status !== "authenticated" || session?.user?.role !== "SHOP_OWNER") {
      setShop(null);
      return;
    }

    // Only fetch if we don't already have initial shop
    if (initialShop) return;

    const fetchShop = async () => {
      try {
        const res = await fetch("/api/profile/shop", {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch shop");

        const data = await res.json();
        setShop(data.shop || null);
      } catch (err) {
        console.error("Failed to fetch shop:", err);
      }
    };

    fetchShop();
  }, [status, session?.user?.id, initialShop]);

  return (
    <ShopContext.Provider value={{ shop, setShop }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
