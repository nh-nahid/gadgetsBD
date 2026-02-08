import { productModel } from "@/models/product-model";
import { dbConnect } from "@/services/mongo";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  await dbConnect();

  const { productId, quantity } = await request.json();

  const product = await productModel.findById(productId);
  if (!product) {
    return NextResponse.json(
      { message: "Product not found" },
      { status: 404 }
    );
  }

  if (quantity > product.stock) {
    return NextResponse.json(
      { message: "Not enough stock" },
      { status: 400 }
    );
  }

  product.stock -= quantity;
  await product.save();

  return NextResponse.json({ success: true }, { status: 200 });
}
