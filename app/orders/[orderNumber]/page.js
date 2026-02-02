// app/orders/[orderId]/page.jsx
import OrderProduct from "@/components/orders/OrderProduct";
import OrderInvoiceButton from "@/components/orders/OrderInvoiceButton";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {  getOrderByNumber } from "@/database/queries";


const statusOrder = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default async function OrderDetailsPage({ params }) {
  const { orderNumber } = params;

  const session = await auth();
  const userId = session?.user?.id;
  const role = session?.user?.role;

  const order = await getOrderByNumber(orderNumber);
console.log("detaisl order", order);

  if (!order) {
    redirect("/orders");
  }


  if (role === "USER" && String(order.userId) !== String(userId)) {
    redirect("/orders"); 
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Order Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
        <p className="text-sm text-gray-600">
          Placed on: {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">Total: BDT {order.summary?.total}</p>
        {role === "USER" && <OrderInvoiceButton orderId={order.orderNumber} />}
      </div>

      {/* Shipping & Payment Info */}
      <div className="p-4 border rounded-md bg-gray-50 space-y-1">
        <p className="text-sm font-semibold">Shipping Address:</p>
        <p className="text-sm text-gray-700">
          {order.shippingAddress?.name}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}, Phone: {order.shippingAddress?.phone}
        </p>

        <p className="text-sm font-semibold mt-2">Payment Method:</p>
        <p className="text-sm text-gray-700">{order.payment?.method} ({order.payment?.status})</p>
      </div>

      {/* Status Timeline */}
      <div className="flex items-center gap-4 mt-4 overflow-x-auto">
        {statusOrder.map((status, idx) => {
          const completed = statusOrder.indexOf(order.status) >= idx;
          return (
            <div key={status} className="flex flex-col items-center text-center">
              <div
                className={`w-6 h-6 rounded-full border-2 ${
                  completed ? "bg-green-500 border-green-500" : "border-gray-300"
                }`}
              />
              <span className="text-xs mt-1 capitalize">{status}</span>
              {idx < statusOrder.length - 1 && (
                <div
                  className={`flex-1 h-1 mt-2 ${
                    completed ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Products List */}
      <div className="space-y-6 mt-4">
        {order.items.map((product, index) => (
          <OrderProduct
            key={product.productId}
            product={{
              ...product,
              productId: product.productId,
              name: product.title, 
            }}
            isFirst={index === 0}
            role={role}
            orderNumber={orderNumber}
          />
        ))}
      </div>
    </div>
  );
}
