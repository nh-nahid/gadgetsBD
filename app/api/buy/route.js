// pages/api/buyNow.js
import { productModel } from "@/models/product-model";
import { dbConnect } from "@/services/mongo";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect();
  const { productId, quantity } = req.body;

  const product = await productModel.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (quantity > product.stock)
    return res.status(400).json({ message: "Not enough stock" });

  // Reduce stock
  product.stock -= quantity;
  await product.save();

  res.status(200).json({ success: true });
}
