import OrderSuccessPage from "@/components/success/OrderSuccessPage";
import { getOrderById } from "@/database/queries";


export default async function SuccessPage({ params }) {
  const { orderId } = params;

  // Fetch the order from MongoDB
  const order = await getOrderById(orderId);
console.log(order);

  if (!order) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <p className="text-gray-600 mt-2">Please check your order number.</p>
      </div>
    );
  }

  // Render the success component with fetched order
  return <OrderSuccessPage order={order} />;
}
