// components/ShippingAddress.jsx
import React from "react";

export default function ShippingAddress({ address }) {
  // fallback if no address provided
  const defaultAddress = {
    name: "John Doe",
    street: "123 Main St, Apartment 4B",
    city: "Dhaka",
    postalCode: "1212",
    country: "Bangladesh",
    phone: "+880 1712-345678",
  };

  const addr = address || defaultAddress;

  return (
    <div className="hover:bg-gray-50 border-b border-gray-300 pb-6 flex justify-between items-start transition-colors cursor-pointer">
      <div>
        <span className="section-number mr-4">1</span>
        <span className="font-bold text-lg">Shipping address</span>
      </div>
      <div className="text-sm flex-1 ml-10">
        <p>{addr.name}</p>
        <p>{addr.street}</p>
        <p>{addr.city}, {addr.postalCode}</p>
        <p>{addr.country}</p>
        <p className="mt-1 text-gray-600">Phone: {addr.phone}</p>
      </div>
      <a href="#" className="text-amazon-blue text-xs hover:underline hover:text-amazon-orange">
        Change
      </a>
    </div>
  );
}
