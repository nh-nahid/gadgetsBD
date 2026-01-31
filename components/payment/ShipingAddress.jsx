// components/ShippingAddress.jsx
import React from "react";

export default function ShippingAddress() {
  return (
    <div className="hover:bg-gray-50 border-b border-gray-300 pb-6 flex justify-between items-start transition-colors cursor-pointer">
      <div>
        <span className="section-number mr-4">1</span>
        <span className="font-bold text-lg">Shipping address</span>
      </div>
      <div className="text-sm flex-1 ml-10">
        <p>John Doe</p>
        <p>123 Main St, Apartment 4B</p>
        <p>Dhaka, 1212</p>
        <p>Bangladesh</p>
        <p className="mt-1 text-gray-600">Phone: +880 1712-345678</p>
      </div>
      <a href="#" className="text-amazon-blue text-xs hover:underline hover:text-amazon-orange">
        Change
      </a>
    </div>
  );
}
