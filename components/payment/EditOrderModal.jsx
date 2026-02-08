"use client";
import React, { useEffect, useState } from "react";

export default function EditOrderModal({
  cartItems = [],
  buyNowProduct = null,
  shippingAddress = {},
  userEmail,
  userId,
  onClose,
  onQtyChange,
  onAddressChange,
  onRemoveItem,
}) {
  const [address, setAddress] = useState(shippingAddress);
  const [saving, setSaving] = useState(false);


  const [localCartItems, setLocalCartItems] = useState(cartItems);
  const [localBuyNow, setLocalBuyNow] = useState(buyNowProduct);
  const [removedItems, setRemovedItems] = useState([]);


  useEffect(() => setLocalCartItems(cartItems), [cartItems]);
  useEffect(() => setLocalBuyNow(buyNowProduct), [buyNowProduct]);
  useEffect(() => setAddress(shippingAddress), [shippingAddress]);

  const handleFieldChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleRemoveItem = (productId) => {
    setLocalCartItems(prev => prev.filter(item => item.productId !== productId));
    if (localBuyNow?.productId === productId) setLocalBuyNow(null);

    setRemovedItems(prev => {
      if (!prev.includes(productId)) return [...prev, productId];
      return prev;
    });

    onRemoveItem(productId);
  };

  const handleQtyChange = (productId, qty) => {
    if (qty < 1) return;

    if (localBuyNow?.productId === productId) {
      setLocalBuyNow(prev => ({ ...prev, quantity: qty }));
    } else {
      setLocalCartItems(prev =>
        prev.map(item => item.productId === productId ? { ...item, quantity: qty } : item)
      );
    }

    onQtyChange(productId, qty);
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      
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

     
      for (const productId of removedItems) {
        await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, productId }),
        });
      }

    
      if (localBuyNow) {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            productId: localBuyNow.productId,
            quantity: localBuyNow.quantity,
            title: localBuyNow.title,
            price: localBuyNow.price,
            image: localBuyNow.image || "",
            shopName: localBuyNow.seller || "Unknown",
            currency: "BDT",
            freeShipping: localBuyNow.freeShipping || false,
          }),
        });
      }

     
      for (const item of localCartItems) {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            productId: item.productId,
            quantity: item.quantity,
            title: item.title,
            price: item.price || 0,
            image: item.image || "",
            shopName: item.seller || "Unknown",
            currency: "BDT",
            freeShipping: item.freeShipping || false,
          }),
        });
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
      <div className="bg-white rounded-md w-11/12 max-w-lg p-6 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Order Details</h2>

        {/* PRODUCTS */}
        <div className="space-y-3">
          {localBuyNow && (
            <div className="flex items-center gap-2">
              <span className="flex-1">{localBuyNow.title}</span>
              <input
                type="number"
                min={1}
                value={localBuyNow.quantity}
                onChange={e => handleQtyChange(localBuyNow.productId, Number(e.target.value))}
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
              <span className="flex-1">{item.title}</span>
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={e => handleQtyChange(item.productId, Number(e.target.value))}
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

        
        {address && (
          <div className="mt-4 space-y-2">
            {["name", "street", "city", "postalCode", "country", "phone"].map(field => (
              <input
                key={field}
                value={address[field] || ""}
                onChange={e => handleFieldChange(field, e.target.value)}
                className="w-full border px-2 py-1"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              />
            ))}
          </div>
        )}

        
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
