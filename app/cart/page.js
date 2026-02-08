"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import CartHeader from "@/components/cart/CartHeader";
import CartItemList from "@/components/cart/CartItemList";
import CartOrderSummary from "@/components/cart/CartOrderSummary";

export default function CartPage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/cart?userId=${userId}`);
        const cart = await res.json();
        const items = cart?.items || [];
        setCartItems(items);

  
        const allSelected = {};
        items.forEach(i => (allSelected[i.productId] = true));
        setSelectedItems(allSelected);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [status, userId]);

  const toggleSelect = (productId) => {
    setSelectedItems(prev => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleQtyChange = (productId, qty) => {
    setCartItems(prev =>
      prev.map(item => item.productId === productId ? { ...item, quantity: qty } : item)
    );
  };

  const handleRemove = (productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
    setSelectedItems(prev => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const selectedItemsArray = cartItems.filter(item => selectedItems[item.productId]);
  const subtotal = selectedItemsArray.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!loading && cartItems.length === 0)
    return <p className="text-center py-10">Your cart is empty.</p>;

  return (
    <main className="max-w-[1500px] mx-auto w-full p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <CartHeader />
          <CartItemList
            items={cartItems}
            selectedItems={selectedItems}
            toggleSelect={toggleSelect}
            onQtyChange={handleQtyChange}
            onRemove={handleRemove}
            userId={userId}
          />
        </div>

        <div className="lg:w-80">
          <CartOrderSummary
            userId={userId}
            cartItems={cartItems}
            selectedItems={selectedItems}
            subtotal={subtotal}
            itemCount={selectedItemsArray.length}
          />
        </div>
      </div>
    </main>
  );
}
