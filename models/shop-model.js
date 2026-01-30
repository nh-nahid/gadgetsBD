import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
      trim: true,
    },
    isOfficial: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 0, // average rating
    },
    reviewCount: {
      type: Number,
      default: 0, // total reviews across products
    },
    productsCount: {
      type: Number,
      default: 0, // total active products
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    responseTime: {
      type: String,
      default: "Within 24 hours",
    },
    policies: [
      {
        type: String,
      },
    ],
    freeDelivery: {
      type: Boolean,
      default: false,
    },
    shopSlug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true, collection: "shops" }
);

// Export model
export const shopModel = mongoose.models.Shop || mongoose.model("Shop", shopSchema);
