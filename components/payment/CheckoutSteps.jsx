// components/CheckoutSteps.jsx

import PaymentMethod from "./PaymentMethod";
import ProductList from "./ProductList";
import ShippingAddress from "./ShipingAddress";

export default function CheckoutSteps() {
  return (
    <>
      <ShippingAddress />
      <ProductList />
      <PaymentMethod />
    </>
  );
}
