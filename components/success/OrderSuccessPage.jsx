import OrderSuccessBanner from "./OrderSuccessBanner";
import OrderDetails from "./OrderDetails";

export default function OrderSuccessPage({ order }) {
  return (
    <main className="max-w-[800px] mx-auto w-full p-8 py-12">
      <OrderSuccessBanner order={order} />
      <OrderDetails order={order} />
    </main>
  );
}
