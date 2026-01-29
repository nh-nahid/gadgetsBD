
import { productModel } from "@/models/product-model";
import { dbConnect } from "@/services/mongo";
import {  replaceMongoIdInArray } from "@/utils/data-util";


export async function getAllProducts() {
  await dbConnect()
  // Fetch all active products
  const products = await productModel.find({ isActive: true }).lean();

  // Replace MongoDB _id with id
  return replaceMongoIdInArray(products);
}

