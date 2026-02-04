"use client";
import React, { useState } from "react";
import EditAddressModal from "./EditAddressModal";

export default function ShippingAddress({
  address,
  userEmail,
  userId,
  onAddressChange,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasAddress = Boolean(address);

  return (
    <>
      <div className="hover:bg-gray-50 border-b border-gray-300 pb-6 flex justify-between items-start transition-colors">
        <div>
          <span className="section-number mr-4">1</span>
          <span className="font-bold text-lg">Shipping address</span>
        </div>

        <div className="text-sm flex-1 ml-10">
          {hasAddress ? (
            <>
              <p>{address.name}</p>
              <p>{address.street}</p>
              <p>
                {address.city}, {address.postalCode}
              </p>
              <p>{address.country}</p>
              <p className="mt-1 text-gray-600">Phone: {address.phone}</p>
            </>
          ) : (
            <p className="text-gray-500 italic">
              No shipping address saved yet.
            </p>
          )}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="text-amazon-blue text-xs hover:underline hover:text-amazon-orange"
        >
          {hasAddress ? "Change" : "Add address"}
        </button>
      </div>

      {isModalOpen && (
        <EditAddressModal
          shippingAddress={address || null}
          userEmail={userEmail}
          userId={userId}
          onClose={() => setIsModalOpen(false)}
          onAddressChange={onAddressChange}
        />
      )}
    </>
  );
}
