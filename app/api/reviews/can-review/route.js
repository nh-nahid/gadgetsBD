import { NextResponse } from "next/server";
import orderModel from "@/models/order-model";
import { reviewModel } from "@/models/review-model";
import { dbConnect } from "@/services/mongo";
import mongoose from "mongoose";

await dbConnect();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const userId = searchParams.get("userId"); // pass userId from client

    if (!productId || !userId) {
      return NextResponse.json({ canReview: false });
    }

    // 1️⃣ Already reviewed?
    const existingReview = await reviewModel.exists({ productId, userId });
    if (existingReview) return NextResponse.json({ canReview: false });

    // 2️⃣ Has purchased?
    const hasPurchased = await orderModel.exists({
      userId,
      "payment.status": "paid",
      "items.productId": new mongoose.Types.ObjectId(productId),
    });

    return NextResponse.json({ canReview: !!hasPurchased });
  } catch (err) {
    console.error("GET /api/reviews/can-review error:", err);
    return NextResponse.json({ canReview: false }, { status: 500 });
  }
}
