"use client";
import React, { useState } from "react";

export default function EditAddressModal({
  shippingAddress,
  userEmail,
  onClose,
  onAddressChange,
}) {

  const initialAddress = shippingAddress || {
    name: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  };

  const [address, setAddress] = useState(initialAddress);
  const [saving, setSaving] = useState(false);

  const handleFieldChange = (field, value) =>
    setAddress(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!address.name || !address.street) {
      alert("Name and Street are required");
      return;
    }

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

  const autocompleteMap = {
    name: "name",
    street: "street-address",
    city: "address-level2",
    postalCode: "postal-code",
    country: "country",
    phone: "tel",
  };

  const inputTypeMap = {
    phone: "tel",
    postalCode: "text",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
    >
      <form autoComplete="off" className="bg-white rounded-md w-11/12 max-w-md p-6 relative">
        <h2 className="text-xl font-bold mb-4">Edit Shipping Address</h2>
        <div className="space-y-2">
          {["name", "street", "city", "postalCode", "country", "phone"].map(
            field => (
              <input
                key={field}
                type={inputTypeMap[field] || "text"}
                name={field}
                autoComplete={autocompleteMap[field]}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={address[field]}
                onChange={e => handleFieldChange(field, e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1"
              />
            )
          )}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-amazon-yellow hover:bg-amazon-yellow_hover rounded"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
