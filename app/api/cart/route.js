import { cartModel } from "@/models/cart-model";
import { dbConnect } from "@/services/mongo";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { productModel } from "@/models/product-model"; 


export const POST = async (request) => {
  try {
    const {
      productId,
      quantity,
      userId,
      title,
      slug,
      shopName,
      price,
      image,
      currency,
      freeShipping,
    } = await request.json();

    if (!productId || !quantity || !userId || !title || !price || !shopName) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await dbConnect();

    const product = await productModel.findById(productId).select("stock");
    if (!product) return new NextResponse("Product not found", { status: 404 });

    const safeQty = Math.min(quantity, product.stock);

    const newItem = {
      productId: new mongoose.Types.ObjectId(productId),
      quantity: safeQty,
      title,
      slug: slug || "",
      shopName: String(shopName),
      price,
      image: image || "",
      stock: product.stock,
      currency: currency || "BDT",
      freeShipping: !!freeShipping,
    };

    let cart = await cartModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });


    if (cart) {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity = safeQty; 
        existingItem.shopName = newItem.shopName;
      } else {
        cart.items.push(newItem);
      }

      await cart.save();
      return NextResponse.json(cart, { status: 200 });
    }


    cart = await cartModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      items: [newItem],
    });

    return NextResponse.json(cart, { status: 201 });
  } catch (error) {
    console.error("POST /api/cart error:", error);
    return new NextResponse(error.message, { status: 500 });
  }
};

export const GET = async (request) => {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) return new NextResponse("Missing userId", { status: 400 });

  await dbConnect();

  const cart = await cartModel.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  });

  return NextResponse.json(cart || { items: [] });
};


export const DELETE = async (request) => {
  try {
    const { userId, productId } = await request.json();

    if (!userId || !productId) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    await dbConnect();

    const cart = await cartModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!cart) return new NextResponse("Cart not found", { status: 404 });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    return new NextResponse("Removed from cart", { status: 200 });
  } catch (error) {
    console.error("DELETE /api/cart error:", error);
    return new NextResponse(error.message, { status: 500 });
  }
};
