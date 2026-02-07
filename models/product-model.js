import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

const imageSchema = new Schema({
  url: { type: String, required: true },
  isMain: { type: Boolean, default: false },
});

const shopSchema = new Schema({
  shopOwnerId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  shopName: { type: String, required: true },
  isOfficial: { type: Boolean, default: false },
});

const productSchema = new Schema(
  {
    // 🔹 Basic info
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    features: [{ type: String }],

    // 🔹 Pricing
    price: { type: Number, required: true },
    currency: { type: String, default: "BDT" },
    taxIncluded: { type: Boolean, default: true },

    // 🔹 Inventory
    stock: { type: Number, required: true, default: 0 },
    isInStock: { type: Boolean, default: true },
    stockStatus: {
      type: String,
      enum: ["inStock", "lowStock", "outOfStock"],
      default: "inStock",
      index: true,
    },

    // 🔹 Category & brand
    category: { type: String, required: true, index: true },
    brand: { type: String, required: true },

    // 🔹 Images
    images: [imageSchema],

    // 🔹 Shop info
    shop: shopSchema,

    // 🔹 Delivery & policy
    freeDelivery: { type: Boolean, default: true },
    deliveryText: { type: String, default: "Tomorrow" },
    returnPolicyDays: { type: Number, default: 14 },
    warranty: { type: String, default: "1 year official warranty" },

    // 🔹 Reviews & rating
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },

    // 🔹 Purchase tracking
    purchaseCount: { type: Number, default: 0 },

    // 🔹 Flags
    isActive: { type: Boolean, default: true },
    published: { type: Boolean, default: true, index: true }, // ✅ New field for publish/unpublish
  },
  { timestamps: true }
);

// ---------------- Auto Calculations ----------------
productSchema.pre("save", function (next) {
  // Stock sync
  this.isInStock = this.stock > 0;

  // Stock status calculation
  if (this.stock === 0) {
    this.stockStatus = "outOfStock";
  } else if (this.stock <= 5) {
    this.stockStatus = "lowStock";
  } else {
    this.stockStatus = "inStock";
  }

  // Rating sync
  if (this.reviews.length > 0) {
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    this.averageRating = Number((total / this.reviews.length).toFixed(1));
    this.totalReviews = this.reviews.length;
  } else {
    this.averageRating = 0;
    this.totalReviews = 0;
  }

  next();
});

// ---------------- Virtual for shopOwnerId ----------------
productSchema.virtual("shopOwnerId").get(function () {
  return this.shop?.shopOwnerId;
});

export const productModel =
  mongoose.models.products || mongoose.model("products", productSchema);
