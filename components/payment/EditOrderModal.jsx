"use client";
import React, { useEffect, useState } from "react";

export default function EditOrderModal({
  cartItems,
  buyNowProduct,
  shippingAddress,
  userEmail,
  userId,
  onClose,
  onQtyChange,
  onAddressChange,
  onRemoveItem, // 🔑 parent callback
}) {
  const [address, setAddress] = useState(shippingAddress);
  const [saving, setSaving] = useState(false);

  // 🔑 Local modal state
  const [localCartItems, setLocalCartItems] = useState(cartItems);
  const [localBuyNow, setLocalBuyNow] = useState(buyNowProduct);
  const [removedItems, setRemovedItems] = useState([]); // track for DB deletion

  // Sync modal local state if parent updates
  useEffect(() => setLocalCartItems(cartItems), [cartItems]);
  useEffect(() => setLocalBuyNow(buyNowProduct), [buyNowProduct]);

  const handleFieldChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  // Remove from modal UI + track for save
  const handleRemoveItem = (productId) => {
    // 1️⃣ Update local modal state
    setLocalCartItems(prev => prev.filter(item => item.productId !== productId));
    if (localBuyNow?.productId === productId) setLocalBuyNow(null);

    // 2️⃣ Track for DB deletion
    setRemovedItems(prev => [...prev, productId]);

    // 3️⃣ Immediately update parent so UI updates instantly
    onRemoveItem(productId);
  };

  const handleQtyChange = (productId, qty) => {
    if (localBuyNow?.productId === productId) {
      setLocalBuyNow({ ...localBuyNow, quantity: qty });
    } else {
      setLocalCartItems(prev =>
        prev.map(item =>
          item.productId === productId ? { ...item, quantity: qty } : item
        )
      );
    }

    // Notify parent
    onQtyChange(productId, qty);
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      // ---------------- 1️⃣ Save address ----------------
      if (address) {
        const res = await fetch(`/api/users/${userEmail}/address`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(address),
        });
        if (!res.ok) throw new Error(await res.text());
        const saved = await res.json();
        onAddressChange(saved);
      }

      // ---------------- 2️⃣ Delete removed items ----------------
      for (const productId of removedItems) {
        const res = await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, productId }),
        });
        if (!res.ok) throw new Error(await res.text());
      }

      // ---------------- 3️⃣ Save Buy-Now product ----------------
      if (localBuyNow) {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            productId: localBuyNow.productId,
            quantity: localBuyNow.quantity,
            title: localBuyNow.name,
            price: localBuyNow.price,
            image: localBuyNow.image || "",
            shopName: localBuyNow.seller || "Unknown",
          }),
        });
        if (!res.ok) throw new Error(await res.text());
      }

      // ---------------- 4️⃣ Save remaining cart items ----------------
      for (const item of localCartItems) {
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
      <div className="bg-white rounded-md w-11/12 max-w-lg p-6">
        <h2 className="text-xl font-bold mb-4">Edit Order Details</h2>

        {/* PRODUCTS */}
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {localBuyNow && (
            <div className="flex items-center gap-2">
              <span className="flex-1">{localBuyNow.name}</span>
              <input
                type="number"
                min={1}
                value={localBuyNow.quantity}
                onChange={(e) =>
                  handleQtyChange(localBuyNow.productId, Number(e.target.value))
                }
                className="w-16 border rounded px-2"
              />
              <button
                onClick={() => handleRemoveItem(localBuyNow.productId)}
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          )}

          {localCartItems.map(item => (
            <div key={item.productId} className="flex items-center gap-2">
              <span className="flex-1">{item.name}</span>
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => handleQtyChange(item.productId, Number(e.target.value))}
                className="w-16 border rounded px-2"
              />
              <button
                onClick={() => handleRemoveItem(item.productId)}
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* ADDRESS */}
        {address && (
          <div className="mt-4 space-y-2">
            <input
              value={address.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className="w-full border px-2 py-1"
              placeholder="Name"
            />
            <input
              value={address.street}
              onChange={(e) => handleFieldChange("street", e.target.value)}
              className="w-full border px-2 py-1"
              placeholder="Street"
            />
            <input
              value={address.city}
              onChange={(e) => handleFieldChange("city", e.target.value)}
              className="w-full border px-2 py-1"
              placeholder="City"
            />
            <input
              value={address.postalCode}
              onChange={(e) => handleFieldChange("postalCode", e.target.value)}
              className="w-full border px-2 py-1"
              placeholder="Postal Code"
            />
            <input
              value={address.country}
              onChange={(e) => handleFieldChange("country", e.target.value)}
              className="w-full border px-2 py-1"
              placeholder="Country"
            />
            <input
              value={address.phone}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              className="w-full border px-2 py-1"
              placeholder="Phone"
            />
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className="px-4 py-2 bg-amazon-yellow rounded"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
