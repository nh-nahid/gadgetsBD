import { generateAccessToken, generateRefreshToken } from "@/lib/token";
import { userModel } from "@/models/user-model";
import { shopModel } from "@/models/shop-model";
import { dbConnect } from "@/services/mongo";
import { NextResponse } from "next/server";
import { replaceMongoIdInObject } from "@/utils/data-util";
import slugify from "slugify";

export const POST = async (req) => {
  try {
    const { name, email, password, role, shopName, mobile, city } = await req.json();
    await dbConnect();

    // 1️⃣ Check if email exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // 2️⃣ Create new user
    const newUser = await userModel.create({
      name,
      email,
      password, // hashed automatically by pre-save hook
      role: role || "USER",
      shopName: role === "SHOP_OWNER" ? shopName : null,
      mobile,
    });

    // 3️⃣ If user is a shop owner, create a shop
    let shop = null;
    if (role === "SHOP_OWNER") {
      const baseSlug = slugify(shopName || name, { lower: true });
      let shopSlug = baseSlug;
      let i = 1;

      // Ensure slug is unique
      while (await shopModel.findOne({ shopSlug })) {
        shopSlug = `${baseSlug}-${i++}`;
      }

      shop = await shopModel.create({
        name: shopName || name,
        shopSlug,
        ownerId: newUser._id,
        city: city || "Unknown",
        coverImage: "/default-shop.jpg",
        specialization: "General",
        rating: 0,
        totalRatings: 0,
      });
    }

    // 4️⃣ Generate tokens
    const accessToken = generateAccessToken({
      userId: newUser._id.toString(),
      role: newUser.role,
    });

    const refreshToken = generateRefreshToken({
      userId: newUser._id.toString(),
    });

    // 5️⃣ Save refresh token in MongoDB
    newUser.refreshToken = refreshToken;
    await newUser.save();

    // 6️⃣ Clean user object for frontend
    const cleanUser = replaceMongoIdInObject(newUser.toObject());

    // 7️⃣ Return response
    return NextResponse.json(
      {
        message: "User created successfully",
        user: cleanUser,
        shop: shop ? replaceMongoIdInObject(shop.toObject()) : null,
        accessToken,
        refreshToken,
        expiresIn: 30 * 60, // 30 minutes
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
