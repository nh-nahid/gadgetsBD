import { NextResponse } from "next/server";
import { reviewModel } from "@/models/review-model";
import orderModel from "@/models/order-model";
import { dbConnect } from "@/services/mongo";
import mongoose from "mongoose";



export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    if (!productId)
      return NextResponse.json({ message: "Missing productId" }, { status: 400 });

    const skip = (page - 1) * limit;

    const reviews = await reviewModel
      .find({ productId, hidden: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const formatted = reviews.map((r) => ({
      id: r._id.toString(),
      userId: r.userId.toString(),
      initials: r.initials,
      name: r.name,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      verified: r.verified,
      date: r.createdAt,
    }));

    return NextResponse.json({ reviews: formatted });
  } catch (err) {
    console.error("GET /api/reviews error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const { productId, userId, name, rating, title, comment } = body;

    if (!productId || !userId || !rating || !title || !comment || !name) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const existing = await reviewModel.findOne({ productId, userId });
    if (existing)
      return NextResponse.json(
        { message: "You already reviewed this product" },
        { status: 400 }
      );

    const hasPurchased = await orderModel.exists({
      userId,
      "payment.status": "paid",
      "items.productId": new mongoose.Types.ObjectId(productId),
    });

    if (!hasPurchased)
      return NextResponse.json(
        { message: "Only verified buyers can review" },
        { status: 403 }
      );


    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 3)
      .toUpperCase();

    const newReview = await reviewModel.create({
      productId,
      userId,
      name,
      initials,
      rating,
      title,
      comment,
      verified: true,
      hidden: false,
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: "Review added successfully",
      review: {
        id: newReview._id.toString(),
        userId: newReview.userId.toString(),
        initials: newReview.initials,
        name: newReview.name,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        verified: newReview.verified,
        date: newReview.createdAt,
      },
    });
  } catch (err) {
    console.error("POST /api/reviews error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
