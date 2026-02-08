import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },      
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    isDefault: { type: Boolean, default: false }, 
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

   
    password: { type: String, default: null },

    role: { type: String, enum: ["USER", "SHOP_OWNER"], default: "USER" },
    shopName: { type: String, default: null },
    mobile: { type: String, default: null },
    image: { type: String, default: null },

 
    refreshToken: { type: String, default: null },

    isOAuth: { type: Boolean, default: false },

    resetToken: { type: String, default: null },
    resetTokenExpire: { type: Date, default: null },

    emailVerified: { type: Date, default: null },

    addresses: { type: [addressSchema], default: [] },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


userSchema.statics.normalizeEmailVerified = function (emailVerified) {
  if (!emailVerified) return null;
  if (emailVerified instanceof Date) return emailVerified;
  if (typeof emailVerified === "boolean" && emailVerified === true) return new Date();
  return null;
};

export const userModel =
  mongoose.models.users || mongoose.model("users", userSchema);
