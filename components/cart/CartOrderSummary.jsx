"use client";
import { useRouter } from "next/navigation";

export default function CartOrderSummary({ subtotal, itemCount, userId, cartItems, selectedItems }) {
  const router = useRouter();

  const handleCheckout = () => {
    if (!userId) {
      alert("Please login to proceed to checkout.");
      return;
    }

    const itemsToCheckout = cartItems.filter(item => selectedItems[item.productId]);
    if (!itemsToCheckout.length) {
      alert("Please select at least one item to proceed.");
      return;
    }

    const queryParams = itemsToCheckout.map(item => `productId=${item.productId}&qty=${item.quantity}`).join("&");
    router.push(`/payment?fromCart=true&${queryParams}`);
  };

  return (
    <div className="bg-white p-4 border border-gray-300 rounded sticky top-20">
      <div className="mb-4">
        {itemCount > 0 && (
          <p className="text-sm mb-2">
            <i className="w-4 h-4 inline text-green-600 mr-1">✔</i>
            <span className="text-green-700 font-medium">Your order qualifies for FREE Shipping!</span>
          </p>
        )}
      </div>

      <div className="mb-4">
        <p className="text-lg mb-1">
          Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""}):{" "}
          <span className="font-bold text-amazon-orange">৳{subtotal.toLocaleString()}</span>
        </p>

        <div className="flex items-start gap-2 text-xs">
          <input type="checkbox" id="gift" className="mt-0.5" />
          <label htmlFor="gift" className="text-gray-700">This order contains a gift</label>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        className={`w-full py-2 border rounded-md text-sm font-bold shadow-sm mb-2 ${
          itemCount === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-amazon-yellow hover:bg-amazon-yellow_hover border-amazon-secondary text-black"
        }`}
        disabled={itemCount === 0}
      >
        Proceed to Checkout
      </button>

      <div className="text-xs text-gray-600 mt-4">
        <p className="mb-2"><i className="w-3 h-3 inline mr-1">🔒</i> Secure transaction</p>
        <p><i className="w-3 h-3 inline mr-1">🚚</i> Ships from Gadgets BD</p>
      </div>
    </div>
  );
}
