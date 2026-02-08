import OrderBreadcrumb from "@/components/orders/OrderBreadcrumb";
import OrdersClient from "@/components/orders/OrdersClient";
import { getOrdersByUser, getOrdersForShopOwner } from "@/database/queries";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const OrdersPage = async () => {
  const session = await auth();

  if (!session?.user?._id && !session?.user?.id) {
    redirect("/login");
  }

  const userId = session?.user?.id 
  const role = session?.user?.role;

  let orders = [];

  if (role === "USER") {
    orders = await getOrdersByUser(userId);
  } else if (role === "SHOP_OWNER") {
    orders = await getOrdersForShopOwner(userId);
    console.log(orders);
    
  }

  return (
    <main className="max-w-[1000px] mx-auto w-full p-4 py-6">
      <OrderBreadcrumb />
      <h1 className="text-3xl font-normal mb-6">
        {role === "USER" ? "Your Orders" : "Orders for Your Shop"}
      </h1>

      <OrdersClient orders={orders} role={role} />
    </main>
  );
};

export default OrdersPage;
