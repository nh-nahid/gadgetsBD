import { productModel } from "@/models/product-model";
import { dbConnect } from "@/services/mongo";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    console.log("[Update Product] API called");

    const body = await req.json();
    console.log("[Update Product] Request body:", body);

    const { productId, userId, ...updates } = body;

    if (!productId) {
      console.error("[Update Product] No productId provided");
      return new Response(JSON.stringify({ error: "Product ID is required" }), { status: 400 });
    }

    if (!userId) {
      console.error("[Update Product] No userId provided from client");
      return new Response(JSON.stringify({ error: "Unauthorized: No userId" }), { status: 401 });
    }


    await dbConnect();
    console.log("[Update Product] Mongo connected");


    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.error("[Update Product] Invalid ObjectId:", productId);
      return new Response(JSON.stringify({ error: "Invalid Product ID" }), { status: 400 });
    }


    const product = await productModel.findOne({ _id: productId, "shop.shopOwnerId": userId });
    if (!product) {
      console.error("[Update Product] Product not found or not owned by user");
      return new Response(JSON.stringify({ error: "Product not found or not yours" }), { status: 404 });
    }


    Object.assign(product, updates);


    if (updates.published !== undefined) {
      product.isActive = updates.published;
    }

    await product.save();

    console.log("[Update Product] Product updated:", productId);
    return new Response(
      JSON.stringify({ message: "Product updated successfully", product }),
      { status: 200 }
    );

  } catch (err) {
    console.error("[Update Product] Error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Failed to update product" }),
      { status: 500 }
    );
  }
}
