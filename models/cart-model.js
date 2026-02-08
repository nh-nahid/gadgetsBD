import mongoose, { Schema } from "mongoose";

const cartItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "products", required: true },
    title: { type: String, required: true },
    slug: { type: String },
    price: { type: Number, required: true },
    currency: { type: String, default: "BDT" },
    image: { type: String }, 
    quantity: { type: Number, default: 1 },
    stock: { type: Number, default: 0 },
    shopName: { type: String, required: true },
    freeShipping: { type: Boolean, default: false },
  },
 
);

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true, unique: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export const cartModel =
  mongoose.models.carts || mongoose.model("carts", cartSchema);
