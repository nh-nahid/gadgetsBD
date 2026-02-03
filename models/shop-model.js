import mongoose, { Schema } from "mongoose";

const shopSchema = new Schema(
  {
    name: { type: String, required: true },
    shopSlug: { type: String, required: true, unique: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    description: { type: String, default: "" },
    city: { type: String, required: true },
    coverImage: { type: String, default: "" },
    specialization: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const shopModel = mongoose.models.shops || mongoose.model("shops", shopSchema);
