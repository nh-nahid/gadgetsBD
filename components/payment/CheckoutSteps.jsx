import PaymentMethod from "./PaymentMethod";
import ProductList from "./ProductList";
import ShippingAddress from "./ShipingAddress";



export default function CheckoutSteps({ cartItems = [], buyNowProduct = null, userAddress= null, onQtyChange, userEmail, userId, onAddressChange }) {
  
  return (
    <>
      
      <ShippingAddress 
        address={userAddress} 
        userEmail={userEmail}
        userId={userId}
        onAddressChange={onAddressChange}
      />

  
      <ProductList cartItems={cartItems} buyNowProduct={buyNowProduct} onQtyChange={onQtyChange}/>

      <PaymentMethod />
    </>
  );
}
