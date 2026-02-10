"use client";

import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0); // distinct items
  const [cartItems, setCartItems] = useState([]);

  // wrap in useCallback to avoid infinite loop
  const refreshCartCount = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/cart?userId=${userId}`);
      const cart = await res.json();
      const items = cart?.items || [];
      setCartCount(items.length); // distinct items
      setCartItems(items);
    } catch (err) {
      console.error(err);
      setCartCount(0);
      setCartItems([]);
    }
  }, []);

  // Derived values
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        refreshCartCount,
        cartItems,
        totalQuantity,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
