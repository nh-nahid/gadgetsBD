import OrderCard from "./OrderCard";

const OrderList = ({ orders, role }) => (
  <div className="space-y-6">
    {orders.map((order) => (
      <OrderCard key={order._id || order.id} order={order} role={role} />
    ))}
  </div>
);

export default OrderList;
