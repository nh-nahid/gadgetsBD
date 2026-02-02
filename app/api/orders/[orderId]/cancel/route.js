// app/api/orders/[orderId]/cancel/route.js
import { NextResponse } from "next/server";
import orderModel from "@/models/order-model";
import { dbConnect } from "@/services/mongo";

await dbConnect();

export async function POST(req, { params }) {
  try {
    const { orderId } = params;
    const body = await req.json();
    const { productId } = body;

    if (!orderId || !productId) {
      return NextResponse.json({ message: "Missing orderId or productId" }, { status: 400 });
    }

    // Find the order
    const order = await orderModel.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }


    let updated = false;
    order.items = order.items.map((item) => {
      if (item.productId.toString() === productId) {
        if (item.status === "cancelled") return item; 
        item.status = "cancelled";
        updated = true;
      }
      return item;
    });

    if (!updated) {
      return NextResponse.json({ message: "Product not found in order or already cancelled" }, { status: 400 });
    }

    await order.save();

    return NextResponse.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    console.error("Cancel order error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
