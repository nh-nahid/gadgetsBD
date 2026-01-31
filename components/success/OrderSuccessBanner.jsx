import { Check } from "lucide-react";
import OrderActions from "./OrderActions";

export default function OrderSuccessBanner({ order }) {
  return (
    <div className="flex items-start gap-4 p-6 border border-gray-300 rounded shadow-sm">
      <div className="bg-white border border-green-600 rounded-full p-1 mt-1">
        <Check className="w-6 h-6 text-green-600 stroke-[3]" />
      </div>

      <div className="space-y-4 flex-1">
        <h1 className="text-xl font-bold text-green-700">
          Order placed, thank you!
        </h1>

        <p className="text-sm">
          Confirmation will be sent to your email.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <div className="flex-1 text-sm bg-gray-50 p-4 border border-gray-200 rounded">
            <span className="font-bold block mb-1">
              Shipping to {order?.shippingAddress?.name}
            </span>
            <p className="text-gray-600">
              {order?.shippingAddress?.city}
            </p>
          </div>

          <div className="flex-1 text-sm bg-gray-50 p-4 border border-gray-200 rounded">
            <span className="font-bold block mb-1">Order Number</span>
            <p className="text-gray-600 font-mono">{order.orderNumber}</p>
            <p className="text-xs text-gray-500 mt-2">
              Placed on {new Date(order.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}

            </p>
          </div>

        </div>

        <OrderActions />
      </div>
    </div>
  );
}
