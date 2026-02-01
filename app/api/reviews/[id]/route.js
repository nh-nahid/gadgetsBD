import { NextResponse } from "next/server";
import { reviewModel } from "@/models/review-model";
import orderModel from "@/models/order-model";
import { dbConnect } from "@/services/mongo";
import mongoose from "mongoose";

await dbConnect();

export async function PUT(req, { params }) {
  try {
    const reviewId = params.id;
    const body = await req.json();
    const { userId, rating, title, comment } = body;

    if (!reviewId || !userId || !rating || !title || !comment) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const review = await reviewModel.findById(reviewId);
    if (!review) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }

    if (review.userId.toString() !== userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    review.rating = rating;
    review.title = title;
    review.comment = comment;
    await review.save();

    return NextResponse.json({
      message: "Review updated successfully",
      review: {
        id: review._id.toString(),
        userId: review.userId.toString(),
        initials: review.initials,
        name: review.name,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        verified: review.verified,
        date: review.createdAt,
      },
    });
  } catch (err) {
    console.error("PUT /api/reviews error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const reviewId = params.id;
    const body = await req.json();
    const { userId } = body;

    if (!reviewId || !userId) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const review = await reviewModel.findById(reviewId);
    if (!review) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }

    if (review.userId.toString() !== userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await review.deleteOne();

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/reviews error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
