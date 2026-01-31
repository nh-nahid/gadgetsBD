"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function BuyBox({ product }) {
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(1);
  const [inCart, setInCart] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---------------- SYNC CART STATE ----------------
  useEffect(() => {
    if (!session?.user?.id) return;

    const checkCart = async () => {
      try {
        const res = await fetch(`/api/cart?userId=${session.user.id}`);
        if (!res.ok) return;

        const cart = await res.json();
        const exists = cart?.items?.some(
          (item) => item.productId.toString() === product.id
        );

        if (exists) setInCart(true);
      } catch (err) {
        console.error("Failed to sync cart", err);
      }
    };

    checkCart();
  }, [session?.user?.id, product.id]);

 // ---------------- ADD OR UPDATE CART ----------------
const handleAddToCart = async () => {
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
    } else {
      const data = await res.text();
      alert("Failed to add product: " + data);
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

      if (res.ok) setInCart(false);
      else alert("Failed to remove product");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- HANDLE QUANTITY CHANGE ----------------
  const handleQuantityChange = (e) => {
    const selectedQty = Math.min(Number(e.target.value), product.stock);
    setQuantity(selectedQty);
  };

  // ---------------- BUY NOW ----------------
  const buyNow = () => {
    if (!session?.user?.email) {
      alert("Please login to purchase items.");
      return;
    }
    alert(`Buying ${quantity} of ${product.title}…`);
  };

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
  disabled={product.stock === 0} // disable if no stock
>
  {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => i + 1).map(
    (n) => (
      <option key={n} value={n}>{n}</option>
    )
  )}
</select>
      </div>

      {/* 🔥 TOGGLE BUTTON */}
      <button
  onClick={inCart ? handleRemoveFromCart : handleAddToCart}
  disabled={loading || product.stock === 0} // disable if no stock
  className={`w-full py-2 rounded-md shadow-sm mb-2 text-sm font-medium border ${
    inCart
      ? "bg-red-500 text-white border-red-500"
      : "bg-amazon-yellow hover:bg-amazon-yellow_hover border-amazon-secondary"
  }`}
>
  {loading
    ? "Processing..."
    : inCart
    ? "Remove from Cart"
    : product.stock === 0
    ? "Out of Stock"
    : "Add to Cart"}
</button>

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
