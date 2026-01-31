"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function BuyBox({ product }) {
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(1);
  const [originalQty, setOriginalQty] = useState(1); // Track original quantity
  const [inCart, setInCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ---------------- SYNC CART STATE ----------------
  useEffect(() => {
    if (!session?.user?.id) return;

    const checkCart = async () => {
      try {
        const res = await fetch(`/api/cart?userId=${session.user.id}`);
        if (!res.ok) return;

        const cart = await res.json();
        const existingItem = cart?.items?.find(
          (item) => item.productId.toString() === product.id
        );

        if (existingItem) {
          setInCart(true);
          setQuantity(existingItem.quantity);
          setOriginalQty(existingItem.quantity);
        }
      } catch (err) {
        console.error("Failed to sync cart", err);
      }
    };

    checkCart();
  }, [session?.user?.id, product.id]);

  // ---------------- HANDLE QUANTITY CHANGE ----------------
  const handleQuantityChange = (e) => {
    const selectedQty = Math.min(Number(e.target.value), product.stock);
    setQuantity(selectedQty);
  };

  // ---------------- ADD / UPDATE CART ----------------
  const handleCartAction = async () => {
    if (!session?.user?.id) {
      alert("Please login to add items to your cart.");
      return;
    }

    if (product.stock === 0) {
      alert("Sorry, this product is out of stock.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          userId: session.user.id,
          title: product.title,
          slug: product.slug,
          price: product.price,
          currency: product.currency || "BDT",
          image: product.images.find(img => img.isMain)?.url || "",
          stock: product.stock,
          shopName: product?.shop?.shopName || "Unknown Shop",
          freeShipping: product.freeDelivery || false,
        }),
      });

      if (res.ok) {
        setInCart(true);
        setOriginalQty(quantity);
      } else {
        const data = await res.text();
        alert("Failed to add/update product: " + data);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- REMOVE FROM CART ----------------
  const handleRemoveFromCart = async () => {
    if (!session?.user?.id) return;

    setLoading(true);

    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          productId: product.id,
        }),
      });

      if (res.ok) {
        setInCart(false);
        setQuantity(1);
        setOriginalQty(1);
      } else {
        alert("Failed to remove product");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- BUY NOW ----------------
  const buyNow = () => {
    if (!session?.user?.id) {
      alert("Please login to purchase items.");
      return;
    }

    if (product.stock === 0) {
      alert("Product out of stock");
      return;
    }

    router.push(
      `/payment?buyNow=true&productId=${product.id}&qty=${quantity}`
    );
  };

  // ---------------- DETERMINE CART BUTTON ----------------
  const cartButtonLabel = !inCart
    ? "Add to Cart"
    : quantity !== originalQty
    ? "Update Cart"
    : "In Cart";

  const cartButtonDisabled =
    loading || product.stock === 0 || (inCart && quantity === originalQty);

  const cartButtonColor = !inCart
    ? "bg-amazon-yellow hover:bg-amazon-yellow_hover border-amazon-secondary"
    : quantity !== originalQty
    ? "bg-green-500 hover:bg-green-600 border-green-500 text-white"
    : "bg-gray-300 text-gray-600 border-gray-300";

  return (
    <div className="lg:col-span-3 border border-gray-200 rounded p-4">
      <div className="text-3xl text-amazon-orange mb-2">৳{product.price}</div>

      <p className="text-sm mb-3">
        <span className="font-bold">FREE delivery</span>{" "}
        <strong>{product.deliveryText}</strong>
      </p>

      <p className="text-green-600 font-bold text-sm mb-4">
        {product.stock} In Stock
      </p>

      <div className="mb-4">
        <label className="text-sm font-bold block mb-2">Quantity:</label>
        <select
          className="border border-gray-300 rounded px-3 py-1 text-sm w-20"
          value={quantity}
          onChange={handleQuantityChange}
          disabled={product.stock === 0}
        >
          {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => i + 1).map(
            (n) => (
              <option key={n} value={n}>{n}</option>
            )
          )}
        </select>
      </div>

      {/* 🔥 ADD / UPDATE CART BUTTON */}
      <button
        onClick={handleCartAction}
        disabled={cartButtonDisabled}
        className={`w-full py-2 rounded-md shadow-sm mb-2 text-sm font-medium border ${cartButtonColor}`}
      >
        {loading ? "Processing..." : cartButtonLabel}
      </button>

      {/* 🔥 REMOVE BUTTON */}
      {inCart && quantity === originalQty && (
        <button
          onClick={handleRemoveFromCart}
          disabled={loading}
          className="w-full py-2 rounded-md shadow-sm mb-2 text-sm font-medium border bg-red-500 hover:bg-red-600 text-white border-red-500"
        >
          Remove from Cart
        </button>
      )}

      <button
        onClick={buyNow}
        disabled={product.stock === 0}
        className="w-full bg-amazon-secondary hover:bg-amazon-secondary_hover py-2 rounded-md shadow-sm text-sm font-medium text-white"
      >
        Buy Now
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600">
        <p className="mb-1">Secure transaction</p>
        <p className="mb-1">Ships from {product.shop.shopName}</p>
        <p>Sold by {product.shop.shopName}</p>
      </div>
    </div>
  );
}
