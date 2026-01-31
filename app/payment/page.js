"use client";

import React, { useEffect, useState } from "react";
import CheckoutMain from "@/components/payment/CheckoutMain";
import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";

const PaymentPage = () => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();

if (status === "unauthenticated") {
  redirect("/login");
}
  const buyNowProductId = searchParams.get("productId");
  const buyNowQty = Number(searchParams.get("qty") || 1);

  const [cartItems, setCartItems] = useState([]);
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        // 1️⃣ Fetch cart
        const resCart = await fetch(`/api/cart/${session.user.id}`);
        let items = [];
        if (resCart.ok) {
          const cartData = await resCart.json();
          items = cartData.reduce((acc, cart) => {
            if (cart.items) acc.push(...cart.items);
            return acc;
          }, []);

          // Normalize cart items
          items = items.map(item => ({
            ...item,
            image: item.image || "",
            name: item.title,
            seller: item.shopName
          }));
        }
        
        setCartItems(items);

        // 2️⃣ Fetch Buy Now product
        if (buyNowProductId) {
          const resProduct = await fetch(`/api/products/${buyNowProductId}`);
          if (resProduct.ok) {
            const productData = await resProduct.json();

            const buyNow = {
              id: productData.id,
              name: productData.title,
              price: productData.price,
              image:
                productData.images?.find(img => img.isMain)?.url ||
                productData.images?.[0]?.url ||
                "",
              seller: productData.shop?.shopName || "Unknown Seller",
              quantity: buyNowQty
            };

            setBuyNowProduct(buyNow);
          }
        }

        // 3️⃣ Fetch user shipping address
        const resUser = await fetch(`/api/users/${session.user.email}`);
        if (resUser.ok) {
          const userData = await resUser.json();
        
          
          // Pick the first address as default, or null if none
          const defaultAddress = userData.addresses?.[0] || null;
          
          
          setShippingAddress(defaultAddress);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, session?.user?.id, session?.user?.email, buyNowProductId, buyNowQty]);

  if (loading) return <p className="text-center py-10">Loading checkout...</p>;

  if (!cartItems.length && !buyNowProduct)
    return <p className="text-center py-10">Your cart is empty.</p>;


  return (
    <CheckoutMain
      cartItems={cartItems}
      buyNowProduct={buyNowProduct}
      userAddress={shippingAddress}
    />
  );
};

export default PaymentPage;
