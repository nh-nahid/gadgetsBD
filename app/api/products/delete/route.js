import { dbConnect } from "@/services/mongo";
import { productModel } from "@/models/product-model";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    console.log("[Delete Product] API called");

    const body = await req.json();
    console.log("[Delete Product] Request body:", body);

    const { productId, userId } = body;

    if (!userId) {
      console.error("[Delete Product] Unauthorized: No userId provided");
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    if (!productId) {
      console.error("[Delete Product] No productId provided");
      return new Response(JSON.stringify({ error: "Product ID is required" }), { status: 400 });
    }

    await dbConnect();
    console.log("[Delete Product] Mongo connected");

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.error("[Delete Product] Invalid ObjectId:", productId);
      return new Response(JSON.stringify({ error: "Invalid Product ID" }), { status: 400 });
    }

    // Find the product owned by this user
    const product = await productModel.findOne({ _id: productId, "shop.shopOwnerId": userId });
    if (!product) {
      console.error("[Delete Product] Product not found or not owned by user");
      return new Response(JSON.stringify({ error: "Product not found or not yours" }), { status: 404 });
    }

    await productModel.deleteOne({ _id: productId });
    console.log("[Delete Product] Product deleted:", productId);

    return new Response(JSON.stringify({ message: "Product deleted successfully" }), { status: 200 });
  } catch (err) {
    console.error("[Delete Product] Error:", err);
    return new Response(JSON.stringify({ error: err.message || "Failed to delete product" }), { status: 500 });
  }
}
