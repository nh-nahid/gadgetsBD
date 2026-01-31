"use client";

import React, { useEffect, useRef, useState } from "react";
import CheckoutMain from "@/components/payment/CheckoutMain";
import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import EditOrderModal from "@/components/payment/EditOrderModal"; // <-- new modal component

const PaymentPage = () => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const buyNowProductId = searchParams.get("productId");
  const buyNowQty = Number(searchParams.get("qty") || 1);
  const [cartItems, setCartItems] = useState([]);
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const hasFetched = useRef(false);

  const userId = session?.user?.id;

  if (status === "unauthenticated") redirect("/login");

  // ---------------- QUANTITY UPDATE ----------------
const handleQtyChange = async (productId, qty) => {
  // Update local state first
  if (buyNowProduct?.productId === productId) {
    setBuyNowProduct(prev => ({ ...prev, quantity: qty }));
  } else {
    setCartItems(prev =>
      prev.map(item =>
        String(item.productId) === String(productId)
          ? { ...item, quantity: qty }
          : item
      )
    );
  }

  // Determine product info
  let product;
  if (buyNowProduct?.productId === productId) {
    product = buyNowProduct;
  } else {
    product = cartItems.find(item => item.productId === productId);
  }

  if (!product) {
    console.error("Product info not found for cart update");
    return;
  }

  // Persist to Mongo
  try {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        productId,
        quantity: qty,
        title: product.name,
        price: product.price,
        shopName: product.seller || "Unknown",
        image: product.image || "",
      }),
    });
  } catch (err) {
    console.error("Failed to update cart", err);
  }
};


  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return;
    if (hasFetched.current) return;

    hasFetched.current = true;

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
          items = items.map(item => ({
            ...item,
            productId: item.productId || item.id,
            image: item.image || "",
            name: item.title,
            seller: item.shopName
          }));
        }

        // Remove buy-now product from cart
        let filteredCart = items;
        if (buyNowProductId) {
          filteredCart = items.filter(
            item => item.productId !== buyNowProductId
          );
        }
        setCartItems(filteredCart);

        // 2️⃣ Fetch Buy-Now product
        if (buyNowProductId) {
          const resProduct = await fetch(`/api/products/${buyNowProductId}`);
          if (resProduct.ok) {
            const productData = await resProduct.json();
            setBuyNowProduct({
              id: productData.id,
              productId: productData.id,
              name: productData.title,
              price: productData.price,
              image:
                productData.images?.find(img => img.isMain)?.url ||
                productData.images?.[0]?.url ||
                "",
              seller: productData.shop?.shopName || "Unknown Seller",
              quantity: buyNowQty
            });
          }
        }

        // 3️⃣ Fetch user address
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
  }, [status, session?.user?.email, buyNowProductId, buyNowQty]);

  if (loading) return <p className="text-center py-10">Loading checkout...</p>;
  if (!cartItems.length && !buyNowProduct)
    return <p className="text-center py-10">Your cart is empty.</p>;


  return (
    <>
      <CheckoutMain
        cartItems={cartItems}
        buyNowProduct={buyNowProduct}
        userAddress={shippingAddress}
        onQtyChange={handleQtyChange}
        userEmail={session.user.email}
        userId={userId}
        onAddressChange={setShippingAddress}
      />

      {/* ---------------- Edit Modal ---------------- */}
      {isEditModalOpen && (
        <EditOrderModal
          cartItems={cartItems}
          buyNowProduct={buyNowProduct}
          shippingAddress={shippingAddress}
          userEmail={session.user.email}   
          onClose={() => setIsEditModalOpen(false)}
          onQtyChange={handleQtyChange}
          onAddressChange={setShippingAddress}
          userId={userId}
        />

      )}

      {/* Edit button */}
      <button
        onClick={() => setIsEditModalOpen(true)}
        className="fixed bottom-6 right-6 bg-amazon-yellow hover:bg-amazon-yellow_hover text-black py-2 px-4 rounded shadow-md"
      >
        Edit Order Details
      </button>
    </>
  );
};

export default PaymentPage;
