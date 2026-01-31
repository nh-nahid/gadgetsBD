"use client";
import React from "react";
import CheckoutSteps from "./CheckoutSteps";
import OrderSummary from "./OrderSummary";

export default function CheckoutMain({ cartItems, buyNowProduct, userAddress, onQtyChange, userEmail, userId, onAddressChange }) {
  const productsToShow = buyNowProduct
    ? [buyNowProduct, ...cartItems.filter(item => item.id !== buyNowProduct.id)]
    : cartItems;

  if (!productsToShow.length) return <p className="text-center py-10">Your cart is empty.</p>;

  return (
    <main className="checkout-container flex-1 py-10 px-4 flex flex-col lg:flex-row gap-8">
      {/* LEFT: Checkout Steps */}
      <div className="flex-1 space-y-6">
        <CheckoutSteps 
          cartItems={productsToShow}
          buyNowProduct={buyNowProduct}
          userAddress={userAddress}
          onQtyChange={onQtyChange}
          userEmail={userEmail}
          userId={userId}
          onAddressChange={onAddressChange}
        />
      </div>

      {/* RIGHT: Order Summary */}
      <OrderSummary cartItems={productsToShow} buyNowProduct={buyNowProduct} userId={userId} userEmail={userEmail} shippingAddress={userAddress} />
    </main>
  );
}
