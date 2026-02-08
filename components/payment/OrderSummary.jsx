"use client";

import { useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false); // <-- Loading state

  const productsToShow = buyNowProduct
    ? [buyNowProduct, ...cartItems.filter(item => item.productId !== buyNowProduct.productId)]
    : cartItems;

  // Totals
  let subtotal = 0;
  let totalItems = 0;
  productsToShow.forEach(item => {
    subtotal += Number(item.price) * Number(item.quantity);
    totalItems += Number(item.quantity);
  });

  const deliveryFee = subtotal > 50000 ? 0 : 500;
  const serviceFee = 500;
  const orderTotal = subtotal + deliveryFee + serviceFee;

  const handlePlaceOrder = async () => {
    if (!userId || !userEmail) return alert("User not logged in!");
    if (!shippingAddress) return alert("Select shipping address!");
    if (!productsToShow.length) return alert("No products to order!");
    if (!cardName || !cardNumber || !cvv || !expMonth || !expYear)
      return alert("Complete payment details!");

    const items = productsToShow.map(p => ({
      productId: p.productId,
      title: p.title,
      image: p.image,
      price: Number(p.price),
      quantity: Number(p.quantity),
      seller: p.seller,
      shopOwnerId: p.shopOwnerId || null,
      status: "pending",
      reviewGiven: false,
      _id: p._id || undefined,
    }));
    ;
console.log("Order items to send:");
items.forEach(item => {
  console.log("Title:", item.title, "shopOwnerId:", item.shopOwnerId);
});

    try {
      setIsLoading(true); // <-- Start loading
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userEmail,
          items,
          shippingAddress,
          summary: { subtotal, deliveryFee, serviceFee, total: orderTotal },
          payment: { method: "Card", status: "paid", cardName, cardNumber, cvv, expMonth, expYear },
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Order failed");

      router.push(`/success/${data.orderId}`);
    } catch (err) {
      console.error("Order placement error:", err);
      alert(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false); // <-- Stop loading
    }
  };

  if (!productsToShow.length) return <p className="text-center py-4">No products in your order.</p>;

  return (
    <div className="w-full lg:w-[300px]">
      <div className="box p-4 sticky top-10">
        <button
          onClick={handlePlaceOrder}
          disabled={isLoading} // <-- Disable button while loading
          className={`w-full py-2 mb-4 rounded-md btn-primary text-sm font-normal shadow-sm ${isLoading ? "opacity-60 cursor-not-allowed" : ""
            }`}
        >
          {isLoading ? "Placing your order..." : "Place your order"} {/* <-- Show loading text */}
        </button>

        <h3 className="font-bold text-lg mb-4">Order Summary</h3>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex justify-between">
            Items ({totalItems}): <span>৳{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            Delivery Fee:{" "}
            <span className="text-green-600 font-bold">
              {deliveryFee === 0 ? "FREE" : `৳${deliveryFee.toLocaleString()}`}
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            Service Fee: <span>৳{serviceFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-amazon-orange text-lg font-bold pt-2">
            Order Total: <span>৳{orderTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
