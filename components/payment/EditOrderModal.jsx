"use client";
import React, { useState } from "react";

export default function EditOrderModal({
  cartItems,
  buyNowProduct,
  shippingAddress,
  userEmail,
  userId,
  onClose,
  onQtyChange,
  onAddressChange,
}) {
  const [address, setAddress] = useState(shippingAddress);
  const [saving, setSaving] = useState(false);

  const handleFieldChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      // ---------------- 1️⃣ Save address ----------------
      if (address) {
        const resAddress = await fetch(`/api/users/${userEmail}/address`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(address),
        });
        if (!resAddress.ok) {
          const msg = await resAddress.text();
          throw new Error("Address save failed: " + msg);
        }
        const savedAddress = await resAddress.json();
        onAddressChange(savedAddress);
      }

      // ---------------- 2️⃣ Save Buy-Now product quantity ----------------
      if (buyNowProduct) {
        const resBuyNow = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            productId: buyNowProduct.productId,
            quantity: buyNowProduct.quantity,
            title: buyNowProduct.name,
            price: buyNowProduct.price,
            image: buyNowProduct.image || "",
            shopName: buyNowProduct.seller || "Unknown",
          }),
        });
        if (!resBuyNow.ok) throw new Error(await resBuyNow.text());
      }

      // ---------------- 3️⃣ Save cart items quantities ----------------
      for (const item of cartItems) {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            productId: item.productId,
            quantity: item.quantity,
            title: item.name,
            price: item.price || 0,
            image: item.image || "",
            shopName: item.seller || "Unknown",
          }),
        });
        if (!res.ok) throw new Error(await res.text());
      }

      alert("Order updated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save changes: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md w-11/12 max-w-lg p-6 relative">
        <h2 className="text-xl font-bold mb-4">Edit Order Details</h2>

        {/* Products */}
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {buyNowProduct && (
            <div className="flex justify-between items-center">
              <span>{buyNowProduct.name}</span>
              <input
                type="number"
                min={1}
                value={buyNowProduct.quantity}
                onChange={(e) =>
                  onQtyChange(buyNowProduct.productId, Number(e.target.value))
                }
                className="w-16 border border-gray-300 rounded px-2"
              />
            </div>
          )}

          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between items-center"
            >
              <span>{item.name}</span>
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  onQtyChange(item.productId, Number(e.target.value))
                }
                className="w-16 border border-gray-300 rounded px-2"
              />
            </div>
          ))}
        </div>

        {/* Shipping Address */}
        {address && (
          <div className="mt-4 space-y-2">
            <label className="block font-bold mb-1">Shipping Address:</label>

            <input
              type="text"
              placeholder="Name"
              value={address.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
            />

            <input
              type="text"
              placeholder="Street"
              value={address.street}
              onChange={(e) => handleFieldChange("street", e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
            />

            <input
              type="text"
              placeholder="City"
              value={address.city}
              onChange={(e) => handleFieldChange("city", e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
            />

            <input
              type="text"
              placeholder="Postal Code"
              value={address.postalCode}
              onChange={(e) =>
                handleFieldChange("postalCode", e.target.value)
              }
              className="w-full border border-gray-300 rounded px-2 py-1"
            />

            <input
              type="text"
              placeholder="Country"
              value={address.country}
              onChange={(e) => handleFieldChange("country", e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
            />

            <input
              type="text"
              placeholder="Phone"
              value={address.phone}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 bg-amazon-yellow hover:bg-amazon-yellow_hover rounded"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
