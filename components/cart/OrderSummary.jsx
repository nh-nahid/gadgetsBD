export default function OrderSummary({ subtotal, itemCount }) {
  return (
    <div className="bg-white p-4 border border-gray-300 rounded">
      <div className="mb-4">
        <p className="text-sm mb-2">
          <i className="w-4 h-4 inline text-green-600 mr-1">✔</i>
          <span className="text-green-700 font-medium">
            Your order qualifies for FREE Shipping!
          </span>
        </p>
      </div>

      <div className="mb-4">
        <p className="text-lg mb-1">
          Subtotal ({itemCount} items):{" "}
          <span className="font-bold text-amazon-orange">৳{subtotal.toLocaleString()}</span>
        </p>
        <div className="flex items-start gap-2 text-xs">
          <input type="checkbox" id="gift" className="mt-0.5" />
          <label htmlFor="gift" className="text-gray-700">
            This order contains a gift
          </label>
        </div>
      </div>

      <button
        onClick={() => window.location.href = 'paymentProcess.html'}
        className="w-full py-2 bg-amazon-yellow hover:bg-amazon-yellow_hover border border-amazon-secondary rounded-md text-sm font-bold shadow-sm transition-colors mb-2"
      >
        Proceed to Checkout
      </button>

      <div className="text-xs text-gray-600 mt-4">
        <p className="mb-2">
          <i className="w-3 h-3 inline mr-1">🔒</i> Secure transaction
        </p>
        <p>
          <i className="w-3 h-3 inline mr-1">🚚</i> Ships from Gadgets BD
        </p>
      </div>
    </div>
  );
}
