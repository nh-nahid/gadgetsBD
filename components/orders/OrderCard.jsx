import Link from "next/link";
import OrderProduct from "./OrderProduct";

const OrderCard = ({ order, role }) => {
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const orderTotal = order.summary?.total?.toLocaleString("en-US") || "0";
  const shipTo = order.shippingAddress?.name || "N/A";


  const orderLink =
    role === "SHOP_OWNER"
      ? `/orders/${order._id}`        
      : `/orders/${order.orderNumber}`; 

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-100 p-4 flex flex-wrap justify-between items-center text-xs text-gray-600 border-b border-gray-300">
        <div className="flex gap-10">
          <div>
            <div className="uppercase tracking-tighter">Order Placed</div>
            <div className="text-sm text-gray-900 mt-1">{orderDate}</div>
          </div>

          <div>
            <div className="uppercase tracking-tighter">Total</div>
            <div className="text-sm text-gray-900 mt-1">৳{orderTotal}</div>
          </div>

          <div>
            <div className="uppercase tracking-tighter">Ship to</div>
            <div className="text-sm text-amazon-blue mt-1 hover:underline cursor-pointer">
              {shipTo}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="uppercase tracking-tighter mb-1">Order # {order.orderNumber}</div>
          <Link href={orderLink} className="text-amazon-blue hover:underline">
            View order details
          </Link>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {order.items.map((product, idx) => (
          <OrderProduct
            key={product._id?.toString() || idx}
            product={product}
            isFirst={idx === 0}
            role={role}
            orderId={order.id?.toString()}        
            orderNumber={order.orderNumber}        
          />
        ))}
      </div>
    </div>
  );
};

export default OrderCard;
