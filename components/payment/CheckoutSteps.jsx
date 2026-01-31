import PaymentMethod from "./PaymentMethod";
import ProductList from "./ProductList";
import ShippingAddress from "./ShipingAddress";



export default function CheckoutSteps({ cartItems = [], buyNowProduct = null, userAddress= null, onQtyChange}) {
  return (
    <>
      {/* Step 1: Shipping Address */}
      <ShippingAddress address={userAddress} />

      {/* Step 2: Review Items */}
      <ProductList cartItems={cartItems} buyNowProduct={buyNowProduct} onQtyChange={onQtyChange}/>

      {/* Step 3: Payment Method */}
      <PaymentMethod />
    </>
  );
}
