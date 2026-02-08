"use client";
import React, { useState } from "react";
import CheckoutSteps from "./CheckoutSteps";
import OrderSummary from "./OrderSummary";

export default function CheckoutMain({
  cartItems = [],
  buyNowProduct = null,
  userAddress,
  onQtyChange,
  userEmail,
  userId,
  onAddressChange,
}) {

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");

  const productsToShow = buyNowProduct
    ? [buyNowProduct, ...cartItems.filter(item => item.productId !== buyNowProduct.productId)]
    : cartItems;

  if (!productsToShow.length)
    return <p className="text-center py-10">Your cart is empty.</p>;

  return (
    <main className="checkout-container flex-1 py-10 px-4 flex flex-col lg:flex-row gap-8">
      
      <div className="flex-1 space-y-6">
        <CheckoutSteps
          cartItems={productsToShow}
          buyNowProduct={buyNowProduct}
          userAddress={userAddress}
          onQtyChange={onQtyChange}
          userEmail={userEmail}
          userId={userId}
          onAddressChange={onAddressChange}

          cardName={cardName}
          setCardName={setCardName}
          cardNumber={cardNumber}
          setCardNumber={setCardNumber}
          cvv={cvv}
          setCvv={setCvv}
          expMonth={expMonth}
          setExpMonth={setExpMonth}
          expYear={expYear}
          setExpYear={setExpYear}
        />
      </div>

      <div className="lg:w-[300px]">
        <OrderSummary
          cartItems={cartItems}
          buyNowProduct={buyNowProduct}
          userId={userId}
          userEmail={userEmail}
          shippingAddress={userAddress}
          cardName={cardName}
          cardNumber={cardNumber}
          cvv={cvv}
          expMonth={expMonth}
          expYear={expYear}
        />
      </div>
    </main>
  );
}
