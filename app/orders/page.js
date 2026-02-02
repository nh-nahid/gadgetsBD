import OrderFilter from "@/components/orders/OrderFilter";
import OrderBreadcrumb from "@/components/orders/OrderBreadcrumb";
import OrderList from "@/components/orders/OrderList";
import { getOrdersByUser } from "@/database/queries";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const OrdersPage = async () => {
  const session = await auth();

  if (!session?.user?._id && !session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user._id || session.user.id;
  const orders = await getOrdersByUser(userId);
console.log(orders);

  return (
    <main className="max-w-[1000px] mx-auto w-full p-4 py-6">
      <OrderBreadcrumb />
      <h1 className="text-3xl font-normal mb-6">Your Orders</h1>
      <OrderFilter orderCount={orders.length} />
      <OrderList orders={orders} role={session?.user?.role} />
    </main>
  );
};

export default OrdersPage;
