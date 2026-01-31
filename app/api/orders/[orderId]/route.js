import { NextResponse } from "next/server";
import { dbConnect } from "@/services/mongo";
import orderModel from "@/models/order-model";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { orderId } = params;
    const order = await orderModel.findById(orderId).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        placedAt: order.createdAt,
        shippingAddress: order.shippingAddress,
        items: order.items,
        summary: order.summary,
        payment: order.payment,
      },
    });
  } catch (err) {
    console.error("GET order error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
