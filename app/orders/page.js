import OrderFilter from "@/components/orders/OrderFilter";
import OrderBreadcrumb from "@/components/orders/OrderBreadcrumb";
import OrderList from "@/components/orders/OrderList";
import { getOrdersByUser, getOrdersForShopOwner } from "@/database/queries";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const OrdersPage = async () => {
  const session = await auth();

  // Redirect if not logged in
  if (!session?.user?._id && !session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user._id || session.user.id;
  const role = session.user.role;

  let orders = [];

  if (role === "USER") {
    // Fetch only user's orders
    orders = await getOrdersByUser(userId);
  } else if (role === "SHOP_OWNER") {
    // Fetch orders containing shop owner's products
    orders = await getOrdersForShopOwner(userId);
    
  }

  console.log("Fetched orders:", orders.items);

  return (
    <main className="max-w-[1000px] mx-auto w-full p-4 py-6">
      <OrderBreadcrumb />
      <h1 className="text-3xl font-normal mb-6">
        {role === "USER" ? "Your Orders" : "Orders for Your Shop"}
      </h1>
      <OrderFilter orderCount={orders.length} />
      <OrderList orders={orders} role={role} />
    </main>
  );
};

export default OrdersPage;
