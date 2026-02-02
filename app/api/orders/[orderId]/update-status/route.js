import { NextResponse } from "next/server";
import orderModel from "@/models/order-model";
import { dbConnect } from "@/services/mongo";
import mongoose from "mongoose";

await dbConnect();

export async function POST(req, { params }) {
  try {
    const { orderId } = params; // /api/orders/:orderId/update-status
    const { productId, status } = await req.json();

    if (!orderId || !productId || !status) {
      return NextResponse.json(
        { message: "Missing orderId, productId, or status" },
        { status: 400 }
      );
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Prevent cancelling shipped/delivered items
    if (status === "cancelled") {
      const item = order.items.find((i) => i.productId.toString() === productId);
      if (!item) {
        return NextResponse.json({ message: "Product not found in order" }, { status: 404 });
      }
      if (item.status === "shipped" || item.status === "delivered") {
        return NextResponse.json(
          { message: "Cannot cancel shipped or delivered product" },
          { status: 400 }
        );
      }
    }

    // Update the item's status
    const updatedOrder = await orderModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(orderId), "items.productId": productId },
      { $set: { "items.$.status": status } },
      { new: true }
    );

    // ✅ If there's only one item, update the main order status to match the product
    if (updatedOrder.items.length === 1) {
      updatedOrder.status = status;
      await updatedOrder.save();
    }

    return NextResponse.json({ message: "Status updated successfully", order: updatedOrder });
  } catch (err) {
    console.error("Update status error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
