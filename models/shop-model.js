import mongoose, { Schema } from "mongoose";

const shopSchema = new Schema(
  {
    shopOwnerId: { type: Schema.Types.ObjectId, ref: "users", required: true }, // matches your JSON
    name: { type: String, required: true },
    shopSlug: { type: String, required: true, unique: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    description: { type: String, default: "No description provided" },
    coverImage: { type: String, default: "/default-shop.jpg" },
    location: {
      city: { type: String, required: true, default: "Unknown" },
      country: { type: String, default: "Bangladesh" },
    },
    address: { type: String, default: "Not provided" },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    specializesIn: { type: [String], default: ["General"] },
    yearEstablished: { type: Number, default: new Date().getFullYear() },
    employees: { type: Number, default: 0 },
    brands: { type: [String], default: [] },
    website: { type: String, default: "" },
  },
  { timestamps: true }
);

// ✅ Clear cached model to prevent old schema usage
delete mongoose.models.shops;

export const shopModel =
  mongoose.models.shops || mongoose.model("shops", shopSchema);
