// components/OrderSummary.jsx
import React from "react";

export default function OrderSummary() {
  return (
    <div className="w-full lg:w-[300px]">
      <div className="box p-4 sticky top-10">
        <button
          
          className="w-full py-2 mb-4 rounded-md btn-primary text-sm font-normal shadow-sm"
        >
          Place your order
        </button>
        <p className="text-[10px] text-gray-500 text-center mb-4 border-b border-gray-300 pb-4 leading-tight">
          By placing your order, you agree to Gadgets BD's{" "}
          <a href="#" className="text-amazon-blue text-xs hover:underline hover:text-amazon-orange">
            privacy notice
          </a>{" "}
          and{" "}
          <a href="#" className="text-amazon-blue text-xs hover:underline hover:text-amazon-orange">
            conditions of use
          </a>
          .
        </p>

        <h3 className="font-bold text-lg mb-4">Order Summary</h3>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Items (3):</span>
            <span>৳4,02,000</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee:</span>
            <span className="text-green-600 font-bold">FREE</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span>Service Fee:</span>
            <span>৳500</span>
          </div>
          <div className="flex justify-between text-amazon-orange text-lg font-bold pt-2">
            <span>Order Total:</span>
            <span>৳4,02,500</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 text-xs">
          <p className="text-green-600 font-bold mb-2">
            <i data-lucide="truck" className="w-4 h-4 inline mr-1"></i>
            FREE Delivery on orders over ৳50,000
          </p>
          <p className="text-gray-600">
            <i data-lucide="shield-check" className="w-4 h-4 inline mr-1"></i>
            Secure checkout
          </p>
        </div>
      </div>
    </div>
  );
}
