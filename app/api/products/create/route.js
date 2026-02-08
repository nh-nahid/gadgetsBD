// /api/products/create/route.js
import { dbConnect } from "@/services/mongo";
import { productModel } from "@/models/product-model";
import { shopModel } from "@/models/shop-model";
import { NextResponse } from "next/server";
import { replaceMongoIdInObject } from "@/utils/data-util";

export const POST = async (req) => {
  try {
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json({ error: "Product title is required" }, { status: 400 });
    }
    if (!body.shop?.shopId) {
      return NextResponse.json({ error: "Shop ID is required" }, { status: 400 });
    }

    await dbConnect();
    const shop = await shopModel.findById(body.shop.shopId);
    if (!shop) {
      return NextResponse.json({ error: "Cannot find your shop" }, { status: 404 });
    }

    const slug = body.slug || body.title.toLowerCase().replace(/\s+/g, "-");

    const images = (body.images || []).map((img, idx) => ({
      ...img,
      isMain: idx === 0 ? true : !!img.isMain,
    }));

    const newProduct = await productModel.create({
      title: body.title,
      slug,
      description: body.description || "",
      category: body.category || "",
      brand: body.brand || "",
      price: body.price || 0,
      currency: body.currency || "BDT",
      taxIncluded: body.taxIncluded !== undefined ? body.taxIncluded : true,
      stock: body.stock || 0,
      availability: body.availability || "In Stock",
      condition: body.condition || "New",
      warranty: body.warranty || "",
      freeDelivery: body.freeDelivery !== undefined ? body.freeDelivery : true,
      deliveryText: body.deliveryText || "Tomorrow",
      returnPolicyDays: body.returnPolicyDays || 14,
      features: body.features || [],
      specs: body.specs || {},
      images,
      shop: {
        shopId: shop._id,
        shopName: shop.name,
        isOfficial: shop.isOfficial || false,
        shopOwnerId: shop.shopOwnerId,
      },
      isActive: body.isActive !== undefined ? body.isActive : true,
      averageRating: 0,
      totalReviews: 0,
      purchaseCount: 0,
    });

    const cleanProduct = replaceMongoIdInObject(newProduct.toObject());

    return NextResponse.json(
      { message: "Product created successfully ✅", product: cleanProduct },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating product:", err);
    return NextResponse.json({ error: err.message || "Failed to create product" }, { status: 500 });
  }
};
