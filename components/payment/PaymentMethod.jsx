// components/PaymentMethod.jsx
import React from "react";

export default function PaymentMethod() {
  return (
    <div className="pb-6">
      <div className="flex items-center mb-6">
        <span className="section-number mr-4">3</span>
        <span className="font-bold text-lg text-amazon-orange">Choose a payment method</span>
      </div>
      <form
        action="success.html"
        method="POST"
        id="paymentForm"
        className="box p-6 space-y-6 shadow-sm"
      >
        <div className="space-y-4">
          <label className="flex items-start gap-3 p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-amazon-background transition-colors bg-gray-50 border-amazon-orange ring-1 ring-amazon-orange">
            <div>
              <span className="font-bold block text-sm">Credit or Debit Card</span>
              <div className="flex gap-2 mt-2">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                  className="h-4"
                  alt="Visa"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                  className="h-4"
                  alt="Mastercard"
                />
              </div>
            </div>
          </label>

          <div id="cardInputs" className="pl-8 space-y-4">
            <div>
              <label className="text-xs font-bold block mb-1">Name on card</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full max-w-sm px-2 py-1 border border-gray-400 rounded-sm text-sm outline-none focus:ring-1 focus:ring-amazon-blue"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs font-bold block mb-1">Card number</label>
                <input
                  type="text"
                  placeholder="#### #### #### ####"
                  className="w-full px-2 py-1 border border-gray-400 rounded-sm text-sm outline-none focus:ring-1 focus:ring-amazon-blue"
                />
              </div>
              <div className="w-24">
                <label className="text-xs font-bold block mb-1">CVV</label>
                <input
                  type="password"
                  placeholder="***"
                  className="w-full px-2 py-1 border border-gray-400 rounded-sm text-sm outline-none focus:ring-1 focus:ring-amazon-blue"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Expiration date</label>
              <div className="flex gap-2">
                <select className="bg-gray-100 border border-gray-300 rounded p-1 text-xs">
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1}>{String(i + 1).padStart(2, "0")}</option>
                  ))}
                </select>
                <select className="bg-gray-100 border border-gray-300 rounded p-1 text-xs">
                  {Array.from({ length: 6 }, (_, i) => 2025 + i).map((year) => (
                    <option key={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-200"></div>
        </div>
      </form>
    </div>
  );
}
