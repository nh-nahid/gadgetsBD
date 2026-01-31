"use client";
import React, { useState } from "react";

export default function EditAddressModal({ shippingAddress, userEmail, onClose, onAddressChange }) {
  const [address, setAddress] = useState(shippingAddress);
  const [saving, setSaving] = useState(false);

  const handleFieldChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${userEmail}/address`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(address),
      });
      if (!res.ok) throw new Error(await res.text());
      const savedAddress = await res.json();
      onAddressChange(savedAddress);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save address: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md w-11/12 max-w-md p-6 relative">
        <h2 className="text-xl font-bold mb-4">Edit Shipping Address</h2>

        <div className="space-y-2">
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
            onChange={(e) => handleFieldChange("postalCode", e.target.value)}
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

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
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
