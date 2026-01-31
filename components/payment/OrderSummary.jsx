"use client";

import { useRouter } from "next/navigation";

export default function OrderSummary({
  cartItems = [],
  buyNowProduct = null,
  userId,
  userEmail,
  shippingAddress,
  cardName,
  cardNumber,
  cvv,
  expMonth,
  expYear,
}) {
  const router = useRouter();

  // Combine buyNowProduct with cart items
  const productsToShow = buyNowProduct
    ? [buyNowProduct, ...cartItems.filter(item => item.productId !== buyNowProduct.productId)]
    : cartItems;

  // Calculate totals
  let totalItems = 0;
  let subtotal = 0;

  productsToShow.forEach(item => {
    const qty = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;
    subtotal += price * qty;
    totalItems += qty;
  });

  const deliveryFee = subtotal > 50000 ? 0 : 500;
  const serviceFee = 500;
  const orderTotal = subtotal + deliveryFee + serviceFee;

  // ---------------- PLACE ORDER ----------------
  const handlePlaceOrder = async () => {
    // --- Basic validation ---
    if (!userId || !userEmail) {
      alert("User not logged in!");
      return;
    }

    if (!shippingAddress) {
      alert("Please select a shipping address!");
      return;
    }

    if (!productsToShow.length) {
      alert("No products to order!");
      return;
    }

    // --- Payment validation ---
    if (!cardName || !cardNumber || !cvv || !expMonth || !expYear) {
      alert("Please fill in all payment details!");
      return;
    }

    const orderedItems = productsToShow.map(p => ({
      productId: p.productId,
      title: p.name,
      image: p.image,
      price: Number(p.price),
      quantity: Number(p.quantity),
      seller: p.seller || "Unknown",
    }));

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userEmail,
          items: orderedItems,
          shippingAddress,
          summary: {
            subtotal,
            deliveryFee,
            serviceFee,
            total: orderTotal,
          },
          payment: {
            method: "Card",
            status: "paid",
            cardName,
            cardNumber,
            cvv,
            expMonth,
            expYear,
          },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Order POST failed:", errText);
        alert("Order failed. See console for details.");
        return;
      }

      const data = await res.json();

      if (data.success && data.orderId) {
        router.push(`/success/${data.orderId}`);
      } else {
        console.error("Order API response error:", data);
        alert(data.message || "Order failed. Try again.");
      }
    } catch (err) {
      console.error("Order API error:", err);
      alert("Something went wrong. Try again.");
    }
  };

  if (!productsToShow.length) {
    return <p className="text-center py-4">No products in your order.</p>;
  }

  return (
    <div className="w-full lg:w-[300px]">
      <div className="box p-4 sticky top-10">
        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          className="w-full py-2 mb-4 rounded-md btn-primary text-sm font-normal shadow-sm"
        >
          Place your order
        </button>

        {/* Terms Notice */}
        <p className="text-[10px] text-gray-500 text-center mb-4 border-b border-gray-300 pb-4 leading-tight">
          By placing your order, you agree to Gadgets BD&apos;s{" "}
          <a
            href="#"
            className="text-amazon-blue text-xs hover:underline hover:text-amazon-orange"
          >
            privacy notice
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-amazon-blue text-xs hover:underline hover:text-amazon-orange"
          >
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
