"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import CheckoutMain from "./CheckoutMain";

export default function PaymentClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const buyNowProductId = searchParams.get("productId");
  const buyNowQty = Number(searchParams.get("qty") || 1);

  const [cartItems, setCartItems] = useState([]);
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  const hasFetched = useRef(false);
  const userId = session?.user?.id;

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // 📦 Fetch checkout data
  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return;
    if (hasFetched.current) return;

    hasFetched.current = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1️⃣ Cart
        const resCart = await fetch(`/api/cart/${session.user.id}`);
        let items = [];
        if (resCart.ok) {
          const cartData = await resCart.json();
          items = cartData.flatMap(c => c.items || []).map(item => ({
            ...item,
            productId: item.productId || item.id,
            name: item.title,
            seller: item.shopName,
            image: item.image || "",
          }));
        }

        // Remove buy-now item from cart
        if (buyNowProductId) {
          items = items.filter(i => i.productId !== buyNowProductId);
        }
        setCartItems(items);

        // 2️⃣ Buy now product
        if (buyNowProductId) {
          const resProduct = await fetch(`/api/products/${buyNowProductId}`);
          if (resProduct.ok) {
            const p = await resProduct.json();
            setBuyNowProduct({
              productId: p.id,
              name: p.title,
              price: p.price,
              quantity: buyNowQty,
              image:
                p.images?.find(img => img.isMain)?.url ||
                p.images?.[0]?.url ||
                "",
              seller: p.shop?.shopName || "Unknown Seller",
            });
          }
        }

        // 3️⃣ Address
        const resUser = await fetch(`/api/users/${session.user.email}`);
        if (resUser.ok) {
          const userData = await resUser.json();
          setShippingAddress(userData.addresses?.[0] || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, session?.user?.email, session?.user?.id, buyNowProductId, buyNowQty]);

  if (loading) return <p className="text-center py-10">Loading checkout...</p>;

  return (
    <CheckoutMain
      cartItems={cartItems}
      buyNowProduct={buyNowProduct}
      userAddress={shippingAddress}
      userEmail={session.user.email}
      userId={userId}
      onAddressChange={setShippingAddress}
      onQtyChange={() => {}}
    />
  );
}
