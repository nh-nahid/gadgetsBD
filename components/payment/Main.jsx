// components/Main.jsx
import React from "react";
import CheckoutSteps from "./CheckoutSteps";
import OrderSummary from "./OrderSummary";

export default function Main() {
  return (
    <>
      <div className="flex-1 space-y-6">
        <CheckoutSteps />
      </div>
      <OrderSummary />
    </>
  );
}
