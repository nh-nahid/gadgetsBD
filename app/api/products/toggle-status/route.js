import { dbConnect } from "@/services/mongo";
import { productModel } from "@/models/product-model";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    console.log("[Toggle Status] API called");

    const body = await req.json();
    console.log("[Toggle Status] Request body:", body);

    const { productId, userId } = body;

  
    if (!userId) {
      console.error("[Toggle Status] Unauthorized: No userId provided");
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }


    if (!productId) {
      console.error("[Toggle Status] No productId provided");
      return new Response(JSON.stringify({ error: "Product ID is required" }), { status: 400 });
    }

  
    await dbConnect();
    console.log("[Toggle Status] Mongo connected");

  
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.error("[Toggle Status] Invalid ObjectId:", productId);
      return new Response(JSON.stringify({ error: "Invalid Product ID" }), { status: 400 });
    }


    const product = await productModel.findOne({
      _id: productId,
      "shop.shopOwnerId": userId,
    });

    if (!product) {
      console.error("[Toggle Status] Product not found or not owned by user");
      return new Response(JSON.stringify({ error: "Product not found or not yours" }), { status: 404 });
    }


    product.isActive = !product.isActive;
    await product.save();

    console.log(
      `[Toggle Status] Product ${productId} status changed to:`,
      product.isActive ? "Published" : "Unpublished"
    );

    return new Response(
      JSON.stringify({
        message: `Product ${product.isActive ? "Published" : "Unpublished"} successfully`,
        isActive: product.isActive,
      }),
      { status: 200 }
    );

  } catch (err) {
    console.error("[Toggle Status] Error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Failed to update product status" }),
      { status: 500 }
    );
  }
}
