"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const { data: session, status } = useSession();
  const [shop, setShop] = useState(null);

  // Fetch shop info whenever session is authenticated and user is SHOP_OWNER
  useEffect(() => {
    if (status !== "authenticated" || session?.user?.role !== "SHOP_OWNER") {
      setShop(null);
      return;
    }

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
  }, [status, session?.user?.id]);

  return (
    <ShopContext.Provider value={{ shop, setShop }}>
      {children}
    </ShopContext.Provider>
  );
}

// Hook to access shop context
export const useShop = () => useContext(ShopContext);
