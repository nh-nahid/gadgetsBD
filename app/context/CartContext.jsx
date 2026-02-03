"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  // Update count from server
  const refreshCartCount = async (userId) => {
    if (!userId) return;

    try {
      const res = await fetch(`/api/cart/${userId}`);
      const carts = await res.json();
      const cart = carts?.[0];
      const count =
        cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount(count);
    } catch (err) {
      console.error("Failed to fetch cart count", err);
      setCartCount(0);
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, refreshCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
