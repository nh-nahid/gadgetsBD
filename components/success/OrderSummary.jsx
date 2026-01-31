export default function OrderSummary({ summary }) {
  return (
    <div className="pt-4 border-t border-gray-200">
      <div className="max-w-sm ml-auto space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>৳{summary.subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery Fee:</span>
          <span className="text-green-600 font-bold">
            {summary.deliveryFee}
          </span>
        </div>

        <div className="flex justify-between border-b border-gray-200 pb-2">
          <span>Service Fee:</span>
          <span>৳{summary.serviceFee}</span>
        </div>

        <div className="flex justify-between text-lg font-bold text-amazon-orange">
          <span>Total:</span>
          <span>৳{summary.total}</span>
        </div>
      </div>
    </div>
  );
}
