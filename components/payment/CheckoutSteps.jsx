import React from "react";

import ProductList from "./ProductList";
import PaymentMethod from "./PaymentMethod";
import ShippingAddress from "./ShipingAddress";

export default function CheckoutSteps({ cartItems, buyNowProduct, userAddress, onQtyChange, userEmail, userId, onAddressChange }) {
  return (
    <>
      <ShippingAddress 
        address={userAddress}
        userEmail={userEmail}
        userId={userId}
        onAddressChange={onAddressChange}
      />
      <ProductList cartItems={cartItems} buyNowProduct={buyNowProduct} onQtyChange={onQtyChange} />
      <PaymentMethod />
    </>
  );
}
