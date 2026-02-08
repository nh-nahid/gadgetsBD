"use client";
import React, { useEffect, useRef, useState } from "react";
import CheckoutMain from "@/components/payment/CheckoutMain";
import EditOrderModal from "@/components/payment/EditOrderModal";
import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";

const PaymentClient = () => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();

  // ✅ BUY NOW → use slug instead of productId
  const buyNowSlug = searchParams.get("slug");
  const buyNowQty = Number(searchParams.get("qty") || 1);
  const fromCart = searchParams.get("fromCart") === "true";

  const [cartItems, setCartItems] = useState([]);
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const hasFetched = useRef(false);
  const userId = session?.user?.id;

  if (status === "unauthenticated") redirect("/login");

  const handleQtyChange = (productId, qty) => {
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
  };

  const handleRemoveItem = (productId) => {
    setCartItems(prev => prev.filter(item => String(item.productId) !== String(productId)));
    setBuyNowProduct(prev => (prev?.productId === productId ? null : prev));
  };

  useEffect(() => {
    if (status !== "authenticated" || !userId || hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 🛒 CART
        const resCart = await fetch(`/api/cart/${userId}`);
        let items = [];

        if (resCart.ok) {
          const cartData = await resCart.json();
          items =
            cartData[0]?.items?.map(item => ({
              productId: String(item.productId || item.id),
              id: String(item.id || item._id),
              title: item.title,
              price: item.price,
              quantity: item.quantity,
              image: item.image || "",
              seller: item.shopName || "Unknown Seller",
              stock: item.stock,
              freeShipping: item.freeShipping,
              slug: item.slug,
            })) || [];
        }

        // ⚡ BUY NOW (slug-based)
        if (buyNowSlug && !fromCart) {
          const resProduct = await fetch(`/api/products/${buyNowSlug}`);
          if (resProduct.ok) {
            const productData = await resProduct.json();

            setBuyNowProduct({
              productId: String(productData.id),
              id: String(productData.id),
              title: productData.title,
              price: productData.price,
              image: productData.images?.[0]?.url || "",
              seller: productData.shop?.shopName || "Unknown Seller",
              quantity: Math.min(buyNowQty, productData.stock),
              stock: productData.stock,
              slug: productData.slug,
              freeShipping: productData.freeDelivery || false,
            });

            // remove from cart if exists
            items = items.filter(i => i.slug !== buyNowSlug);
          }
        }

        // 🧺 FROM CART CHECKOUT
        if (fromCart) {
          const productIds = searchParams.getAll("productId").map(String);
          const qtys = searchParams.getAll("qty").map(Number);

          const selected = items.filter(item =>
            productIds.includes(String(item.productId))
          );

          selected.forEach(item => {
            const idx = productIds.indexOf(String(item.productId));
            item.quantity = qtys[idx] || 1;
          });

          setCartItems(selected);
        } else {
          setCartItems(items);
        }

        // 📦 ADDRESS
        const resUser = await fetch(`/api/users/${session.user.email}`);
        if (resUser.ok) {
          const data = await resUser.json();
          setShippingAddress(data.addresses?.[0] || null);
        }
      } catch (err) {
        console.error("Payment fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, userId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amazon-blue mb-4"></div>
        <p className="text-gray-700 text-lg font-medium">
          Loading your checkout...
        </p>
      </div>
    );
  }

  if (!cartItems.length && !buyNowProduct) {
    return <p className="text-center py-10">Your cart is empty.</p>;
  }

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
        onRemoveItem={handleRemoveItem}
      />

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
          onRemoveItem={handleRemoveItem}
        />
      )}

      <button
        onClick={() => setIsEditModalOpen(true)}
        className="fixed bottom-6 right-6 bg-amazon-yellow hover:bg-amazon-yellow_hover text-black py-2 px-4 rounded shadow-md"
      >
        Edit Order Details
      </button>
    </>
  );
};

export default PaymentClient;
