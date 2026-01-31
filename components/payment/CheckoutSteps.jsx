import React from "react";

import ProductList from "./ProductList";
import PaymentMethod from "./PaymentMethod";
import ShippingAddress from "./ShipingAddress";

export default function CheckoutSteps({ cartItems, buyNowProduct, userAddress, onQtyChange, userEmail, userId, onAddressChange, cardName, setCardName, cardNumber, setCardNumber, cvv, setCvv, expMonth, setExpMonth, expYear, setExpYear }) {
  return (
    <>
      <ShippingAddress 
        address={userAddress}
        userEmail={userEmail}
        userId={userId}
        onAddressChange={onAddressChange}
      />
      <ProductList cartItems={cartItems} buyNowProduct={buyNowProduct} onQtyChange={onQtyChange} />
      <PaymentMethod 
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
    </>
  );
}
