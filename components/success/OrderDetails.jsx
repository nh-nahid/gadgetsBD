import OrderItem from "./OrderItem";
import OrderSummary from "./OrderSummary";

export default function OrderDetails({ order }) {
  return (
    <div className="mt-12 space-y-6">
      <h2 className="text-2xl font-normal border-b border-gray-200 pb-4">
        Order Details
      </h2>

      {order.items.map(item => (
        <OrderItem key={item.id} item={item} />
      ))}

      <OrderSummary summary={order.summary} />
    </div>
  );
}
