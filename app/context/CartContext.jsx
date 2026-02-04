"use client";

import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = async (userId) => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/cart?userId=${userId}`);
      const cart = await res.json();
      const items = cart?.items || [];
      setCartCount(items.length); // product count, not quantity
    } catch (err) {
      console.error(err);
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
