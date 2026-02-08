import mongoClientPromise from "@/database/mongoClientPromise";
import { ObjectId } from "mongodb";
export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const userId = searchParams.get("userId"); 
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    if (!userId) return new Response(JSON.stringify({ products: [], total: 0 }));

    const db = (await mongoClientPromise).db();
    const productsCol = db.collection("products");


    const filter = { "shop.shopOwnerId": new ObjectId(userId) };


    if (search) filter.title = { $regex: search, $options: "i" };
    if (category && category !== "All Categories") filter.category = category;
    if (brand && brand !== "All Brands") filter.brand = brand;

    if (status && status !== "All") {
      if (status === "In Stock") filter.stock = { $gt: 5 };          
      if (status === "Low Stock") filter.stock = { $gte: 1, $lte: 5 };
      if (status === "Out of Stock") filter.stock = 0;                 
    }

    const total = await productsCol.countDocuments(filter);
    const products = await productsCol
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const mapped = products.map((p) => ({
      ...p,
      id: p._id.toString(),
      statusColor: p.stock === 0 ? "red" : p.stock <= 5 ? "yellow" : "green",
      image: p.images?.find((i) => i.isMain)?.url || "/placeholder.png",
    }));

    console.log(`Fetched ${mapped.length} products for shopOwner ${userId}`);
    return new Response(JSON.stringify({ products: mapped, total }));
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return new Response(JSON.stringify({ products: [], total: 0 }), { status: 500 });
  }
}
