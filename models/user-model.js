import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new Schema({
  name: { type: String, required: true },           // recipient name
  street: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false },     // mark default shipping address
}, { _id: false });

const userSchema = new Schema({
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

  emailVerified: { type: Date, default: null },

  // ----------------- NEW -----------------
  addresses: { type: [addressSchema], default: [] }, // array of addresses
}, { timestamps: true });

// Hash password only if modified
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const userModel = mongoose.models.users || mongoose.model("users", userSchema);
