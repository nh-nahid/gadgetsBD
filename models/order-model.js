import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: String,
  image: String,
  price: Number,
  quantity: Number,
  seller: String,
});

const AddressSchema = new mongoose.Schema({
  name: String,
  phone: String,
  addressLine: String,
  city: String,
  postalCode: String,
  country: String,
});

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [OrderItemSchema],

    shippingAddress: AddressSchema,

    payment: {
      method: { type: String, default: "Card" },
      status: { type: String, enum: ["pending", "paid"], default: "paid" },
      transactionId: String,
    },

    summary: {
      subtotal: Number,
      deliveryFee: Number,
      serviceFee: Number,
      total: Number,
    },

    orderNumber: {
      type: String,
      unique: true,
    },

    status: {
      type: String,
      enum: ["processing", "shipped", "delivered"],
      default: "processing",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
