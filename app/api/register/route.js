import { generateAccessToken, generateRefreshToken } from "@/lib/token";
import { userModel } from "@/models/user-model";
import { dbConnect } from "@/services/mongo";
import { NextResponse } from "next/server";
import { replaceMongoIdInObject } from "@/utils/data-util";

export const POST = async (req) => {
  try {
    const { name, email, password, role, shopName, mobile } = await req.json();
    await dbConnect();

    // 1️⃣ Check if email exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
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

    // 3️⃣ Generate tokens
    const accessToken = generateAccessToken({
      userId: newUser._id.toString(),
      role: newUser.role,
    });

    const refreshToken = generateRefreshToken({
      userId: newUser._id.toString(),
    });

    // 4️⃣ Save refresh token in MongoDB
    newUser.refreshToken = refreshToken;
    await newUser.save();

    // 5️⃣ Clean user object for frontend
    const cleanUser = replaceMongoIdInObject(newUser.toObject());

    // 6️⃣ Return response
    return NextResponse.json(
      {
        message: "User created successfully",
        user: cleanUser,
        accessToken,
        refreshToken,
        expiresIn: 30 * 60, // 30 minutes in seconds
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
};
