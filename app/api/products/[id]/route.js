import { productModel } from "@/models/product-model";
import { dbConnect } from "@/services/mongo";
import { replaceMongoIdInObject } from "@/utils/data-util";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;
  if (!id)
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });

  try {
    await dbConnect();
    const product = await productModel.findById(id).lean();
    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json(replaceMongoIdInObject(product));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
