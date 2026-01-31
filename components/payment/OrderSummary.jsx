// components/OrderSummary.jsx
import React from "react";

export default function OrderSummary({ cartItems = [], buyNowProduct = null }) {
  // Combine buyNowProduct with cart items
  const productsToShow = buyNowProduct
    ? [buyNowProduct, ...cartItems.filter(item => item.productId !== buyNowProduct.productId)]
    : cartItems;

  // Calculate totals
  let totalItems = 0;
  let subtotal = 0;

  productsToShow.forEach(item => {
    const qty = item.quantity || 1;
    subtotal += item.price * qty;
    totalItems += qty;
  });

  const deliveryFee = subtotal > 50000 ? 0 : 500;
  const serviceFee = 500;
  const orderTotal = subtotal + deliveryFee + serviceFee;

  return (
    <div className="w-full lg:w-[300px]">
      <div className="box p-4 sticky top-10">
        {/* Place Order Button */}
        <button
          className="w-full py-2 mb-4 rounded-md btn-primary text-sm font-normal shadow-sm"
        >
          Place your order
        </button>

        {/* Terms Notice */}
        <p className="text-[10px] text-gray-500 text-center mb-4 border-b border-gray-300 pb-4 leading-tight">
          By placing your order, you agree to Gadgets BD's{" "}
          <a href="#" className="text-amazon-blue text-xs hover:underline hover:text-amazon-orange">
            privacy notice
          </a>{" "}
          and{" "}
          <a href="#" className="text-amazon-blue text-xs hover:underline hover:text-amazon-orange">
            conditions of use
          </a>.
        </p>

        {/* Order Summary */}
        <h3 className="font-bold text-lg mb-4">Order Summary</h3>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Items ({totalItems}):</span>
            <span>৳{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee:</span>
            <span className="text-green-600 font-bold">
              {deliveryFee === 0 ? "FREE" : `৳${deliveryFee.toLocaleString()}`}
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span>Service Fee:</span>
            <span>৳{serviceFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-amazon-orange text-lg font-bold pt-2">
            <span>Order Total:</span>
            <span>৳{orderTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Delivery & Security Info */}
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
