"use client";
import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";

export default function CartItem({
  item,
  isSelected,
  toggleSelect,
  onQtyChange,
  onRemove,
  userId,
}) {
  const maxQty = item.stock || 20;
  const [updating, setUpdating] = useState(false);
  const { refreshCartCount } = useCart();

  const handleQtyChange = async (e) => {
    e.stopPropagation();
    const qty = Number(e.target.value);
    const prevQty = item.quantity;
    setUpdating(true);

    onQtyChange(item.productId, qty);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId: String(item.productId),
          quantity: qty,
          title: item.title,
          slug: item.slug,
          shopName: item.shopName,
          price: item.price,
          image: item.image,
          currency: item.currency,
          freeShipping: item.freeShipping,
        }),
      });

      if (!res.ok) throw new Error("Failed to update quantity");
      refreshCartCount(userId);
    } catch (err) {
      console.error(err);
      onQtyChange(item.productId, prevQty);
      alert("Failed to update quantity. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async (e) => {
    e.stopPropagation();
    onRemove(item.productId);

    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId: String(item.productId),
        }),
      });

      if (!res.ok) throw new Error("Failed to remove item");
      refreshCartCount(userId);
    } catch (err) {
      console.error(err);
      alert("Failed to remove item. Please try again.");
    }
  };

  return (
    <div
      className={`p-4 border-b border-gray-300 flex gap-4 cursor-pointer hover:bg-gray-50 ${
        isSelected ? "bg-gray-100" : ""
      }`}
      onClick={() => toggleSelect(item.productId)}
    >
      {/* Image */}
      <div className="relative w-32 h-32 flex-shrink-0">
        <Image
          src={item.image || "/placeholder.png"}
          alt={item.title}
          fill
          sizes="128px"
          className="object-cover rounded border"
        />
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="font-medium text-base mb-1">{item.title}</h3>

        <p className="text-sm text-green-700 font-medium">
          {item.stock > 0 ? "In Stock" : "Out of Stock"}
        </p>

        <p className="text-xs text-gray-600 mt-1">
          Sold by: {item.shopName}
        </p>

        {item.freeShipping && (
          <p className="text-xs text-gray-600">
            Eligible for FREE Shipping
          </p>
        )}

        <div className="flex items-center gap-4 mt-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => e.stopPropagation()}
            className="cursor-pointer"
          />

          <span className="text-sm">
            Qty:{" "}
            <select
              value={item.quantity}
              onChange={handleQtyChange}
              disabled={updating}
              className="border border-gray-300 rounded px-2 py-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              {Array.from({ length: maxQty }, (_, i) => i + 1).map(
                (q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                )
              )}
            </select>
          </span>

          <button
            onClick={handleRemove}
            onMouseDown={(e) => e.stopPropagation()}
            className="text-xs text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>

    
      <div className="text-right">
        <p className="text-lg font-bold text-amazon-orange">
          ৳{item.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
