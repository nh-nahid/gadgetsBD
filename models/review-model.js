import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    initials: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
    verified: { type: Boolean, default: true },
    hidden: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const reviewModel =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);
