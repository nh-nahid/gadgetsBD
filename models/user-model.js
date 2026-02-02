import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ----------------- Address Schema -----------------
const addressSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },      // recipient name
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    isDefault: { type: Boolean, default: false }, // default shipping address
  },
  { _id: false }
);

// ----------------- User Schema -----------------
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    // Password can be null for OAuth users
    password: { type: String, default: null },

    role: { type: String, enum: ["USER", "SHOP_OWNER"], default: "USER" },
    shopName: { type: String, default: null },
    mobile: { type: String, default: null },
    image: { type: String, default: null },

    // JWT refresh token
    refreshToken: { type: String, default: null },

    // OAuth flag
    isOAuth: { type: Boolean, default: false },

    // Reset password
    resetToken: { type: String, default: null },
    resetTokenExpire: { type: Date, default: null },

    // Email verification
    emailVerified: { type: Date, default: null },

    // Addresses
    addresses: { type: [addressSchema], default: [] },
  },
  { timestamps: true }
);

// ----------------- Password Hashing -----------------
// Only hash password if modified
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ----------------- Helper to normalize OAuth emailVerified -----------------
userSchema.statics.normalizeEmailVerified = function (emailVerified) {
  if (!emailVerified) return null;
  if (emailVerified instanceof Date) return emailVerified;
  if (typeof emailVerified === "boolean" && emailVerified === true) return new Date();
  return null;
};

// ----------------- Export Model -----------------
export const userModel =
  mongoose.models.users || mongoose.model("users", userSchema);
