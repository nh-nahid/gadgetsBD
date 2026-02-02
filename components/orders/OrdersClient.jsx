"use client";

import { useEffect, useState } from "react";
import OrderFilter from "@/components/orders/OrderFilter";
import OrderList from "@/components/orders/OrderList";
import EmptyOrders from "@/components/orders/EmptyOrders";

const OrdersClient = ({ orders, role }) => {
  const [filteredOrders, setFilteredOrders] = useState(orders);

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  if (orders.length === 0) {
    return <EmptyOrders role={role} />;
  }

  return (
    <>
      <OrderFilter orders={orders} onFilter={setFilteredOrders} />

      {filteredOrders.length === 0 ? (
        <EmptyOrders role={role} type="filtered" />
      ) : (
        <OrderList orders={filteredOrders} role={role} />
      )}
    </>
  );
};

export default OrdersClient;
