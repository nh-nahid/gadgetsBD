import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/services/mongo";
import { shopModel } from "@/models/shop-model";

export async function PUT(req) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const {
      name,
      ownerName,
      description,
      coverImage,
      location, 
      address,
      email,
      phone,
      specializesIn,
      yearEstablished,
      employees,
      brands,
      website,
    } = body;

    await dbConnect();

    const shop = await shopModel.findOne({ shopOwnerId: session.user.id });
    if (!shop)
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });

    // Basic fields
    shop.name = name ?? shop.name;
    shop.ownerName = ownerName ?? shop.ownerName;
    shop.description = description ?? shop.description;

    if (coverImage && coverImage.trim() !== "") {
      shop.coverImage = coverImage;
    }

    shop.address = address ?? shop.address;
    shop.email = email ?? shop.email;
    shop.phone = phone ?? shop.phone;
    shop.website = website ?? "";

    // Location
    shop.location = shop.location || {};
    if (location) {
      shop.location.city = location.city ?? shop.location.city;
      shop.location.country = location.country ?? shop.location.country;
    }

    // SpecializesIn & brands
    shop.specializesIn = Array.isArray(specializesIn)
      ? specializesIn
      : typeof specializesIn === "string"
      ? specializesIn.split(",").map((s) => s.trim())
      : shop.specializesIn;

    shop.brands = Array.isArray(brands)
      ? brands
      : typeof brands === "string"
      ? brands.split(",").map((b) => b.trim())
      : shop.brands;

    // Numbers
    shop.yearEstablished =
      yearEstablished != null ? Number(yearEstablished) : shop.yearEstablished;
    shop.employees =
      employees != null ? Number(employees) : shop.employees;

    await shop.save();

    return NextResponse.json({ success: true, shop });
  } catch (error) {
    console.error("Shop update failed:", error);
    return NextResponse.json(
      { error: "Failed to update shop" },
      { status: 500 }
    );
  }
}
