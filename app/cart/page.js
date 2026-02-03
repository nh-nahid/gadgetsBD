"use client";

import CartHeader from "@/components/cart/CartHeader";
import CartItemList from "@/components/cart/CartItemList";
import OrderSummary from "@/components/payment/OrderSummary";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchCart() {
      try {
        const res = await fetch(`/api/cart/${userId}`);
        const carts = await res.json();

        // You have ONE cart per user
        const items = carts[0]?.items || [];

        // ✅ Map 1:1 with Mongo model
        setCartItems(
          items.map((item) => ({
            id: item._id || item.id,
            productId: item.productId,
            title: item.title,
            slug: item.slug,
            image: item.image,
            price: item.price,        // number
            quantity: item.quantity,
            stock: item.stock,
            shopName: item.shopName,
            freeShipping: item.freeShipping,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, [status, userId]);

if (!loading && cartItems.length === 0) {
  return (
    <main className="max-w-[1500px] mx-auto w-full p-4">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-24 h-24 mb-6 text-gray-300">
          🛒
        </div>

        <h2 className="text-2xl font-semibold text-gray-800">
          Your cart is empty
        </h2>

        <p className="mt-2 text-gray-500 max-w-md">
          Looks like you haven’t added anything yet.  
          Start shopping to see items here.
        </p>

        <Link
          href="/products"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-black px-6 py-3 text-white hover:bg-gray-800 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}


  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <main className="max-w-[1500px] mx-auto w-full p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <CartHeader />
          <CartItemList items={cartItems} />
        </div>

        <div className="lg:w-80">
          <OrderSummary
            subtotal={subtotal}
            itemCount={cartItems.length}
          />
        </div>
      </div>
    </main>
  );
}
