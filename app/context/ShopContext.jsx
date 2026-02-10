"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [shop, setShop] = useState(null);


  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await fetch("/api/profile/shop");
        if (!res.ok) throw new Error("Failed to fetch shop");
        const data = await res.json();
        if (data.shop) setShop(data.shop);
      } catch (err) {
        console.error("Failed to fetch shop:", err);
      }
    };

    fetchShop();
  }, []);

  return (
    <ShopContext.Provider value={{ shop, setShop }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
