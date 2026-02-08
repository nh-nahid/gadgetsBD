import { NextResponse } from "next/server";
import orderModel from "@/models/order-model";
import { dbConnect } from "@/services/mongo";

export async function POST(req, { params }) {
  try {
    await dbConnect();

    const { orderId } = params;
    const { productId } = await req.json();

    if (!orderId || !productId) {
      return NextResponse.json({ message: "Missing orderId or productId" }, { status: 400 });
    }

    const result = await orderModel.updateOne(
      {
        _id: orderId,
        "items.productId": productId,
        "items.status": { $in: ["pending", "confirmed"] },
      },
      {
        $set: { "items.$.status": "cancelled" },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({
        message: "Cannot cancel shipped, delivered, or already cancelled items",
      }, { status: 400 });
    }

    const order = await orderModel.findById(orderId).lean();
    const allCancelled = order.items.every(i => i.status === "cancelled");
    if (allCancelled) {
      await orderModel.updateOne({ _id: orderId }, { $set: { status: "cancelled" } });
    }

    return NextResponse.json({ message: "Order item cancelled successfully" });
  } catch (err) {
    console.error("Cancel order API error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
