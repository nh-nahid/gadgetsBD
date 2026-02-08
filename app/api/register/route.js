import { generateAccessToken, generateRefreshToken } from "@/lib/token";
import { userModel } from "@/models/user-model";
import { shopModel } from "@/models/shop-model";
import { dbConnect } from "@/services/mongo";
import { NextResponse } from "next/server";
import { replaceMongoIdInObject } from "@/utils/data-util";
import { slugify } from "@/utils/slugify";

export const POST = async (req) => {
  try {
    const {
      name,
      email,
      password,
      role,
      shopName,
      mobile,
      city,
      country,
      description,
      specializesIn,
      address,
      yearEstablished,
      employees,
      brands,
      website,
      coverImage,
    } = await req.json();

    await dbConnect();


    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });


    const newUser = await userModel.create({
      name,
      email,
      password, 
      role: role || "USER",
      shopName: role === "SHOP_OWNER" ? shopName : null,
      mobile,
    });


    let shop = null;
    if (role === "SHOP_OWNER") {
      const baseSlug = slugify(shopName || name, { lower: true });
      let shopSlug = baseSlug;
      let i = 1;

      while (await shopModel.findOne({ shopSlug })) {
        shopSlug = `${baseSlug}-${i++}`;
      }

      shop = await shopModel.create({
        shopOwnerId: newUser._id, 
        name: shopName || name,
        shopSlug,
        ownerName: name,
        email,
        phone: mobile || "",
        description: description || "No description provided",
        coverImage: coverImage || "/placeholder.png",
        location: {
          city: city || "Unknown",
          country: country || "Bangladesh",
        },
        address: address || "",
        rating: { average: 0, count: 0 },
        specializesIn: specializesIn || ["General"],
        yearEstablished: yearEstablished || new Date().getFullYear(),
        employees: employees || 0,
        brands: brands || [],
        website: website || "",
      });
    }

    const accessToken = generateAccessToken({
      userId: newUser._id.toString(),
      role: newUser.role,
    });

    const refreshToken = generateRefreshToken({
      userId: newUser._id.toString(),
    });


    newUser.refreshToken = refreshToken;
    await newUser.save();


    const cleanUser = replaceMongoIdInObject(newUser.toObject());


    return NextResponse.json(
      {
        message: "User and shop created successfully",
        user: cleanUser,
        shop: shop ? replaceMongoIdInObject(shop.toObject()) : null,
        accessToken,
        refreshToken,
        expiresIn: 30 * 60,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user/shop:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
