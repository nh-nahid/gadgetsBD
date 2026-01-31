import { cartModel } from "@/models/cart-model";
import { productModel } from "@/models/product-model";
import { reviewModel } from "@/models/review-model";
import { shopModel } from "@/models/shop-model";
import { userModel } from "@/models/user-model";
import { dbConnect } from "@/services/mongo";
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/utils/data-util";
import mongoose from "mongoose";

/**
 * Fetch all active products from the database
 * @param {Object} options
 *  - limit: number of products to return (optional)
 *  - sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest' (optional)
 */
export async function getAllProducts(options = {}) {
  await dbConnect();

  const { limit, sortBy } = options;

  // Base query
  let query = productModel.find({ isActive: true }).lean();

  // Sorting
  if (sortBy) {
    switch (sortBy) {
      case "price-asc":
        query = query.sort({ price: 1 });
        break;
      case "price-desc":
        query = query.sort({ price: -1 });
        break;
      case "rating":
        query = query.sort({ averageRating: -1 });
        break;
      case "newest":
        // Use createdAt if exists, otherwise fallback to ObjectId timestamp
        query = query.sort({ createdAt: -1 });
        break;
      case "featured":
      default:
        // keep default DB order
        break;
    }
  }

  // Apply limit
  if (limit) query = query.limit(limit);

  const products = await query;

  // Replace _id with id and ensure all necessary fields exist
  return replaceMongoIdInArray(products);
}

/**
 * Get featured products with the highest purchase count
 * @param {number} limit
 */
export async function getFeaturedProducts(limit = 6) {
  await dbConnect();

  const products = await productModel
    .find({ isActive: true, purchaseCount: { $gt: 0 } })
    .sort({ purchaseCount: -1 })
    .limit(limit)
    .lean();

  return replaceMongoIdInArray(products);
}


export async function getProductBySlug(slug) {
  await dbConnect();

  const product = await productModel
    .findOne({ slug, isActive: true })
    .lean();

  if (!product) return null;

  return replaceMongoIdInObject(product);
}



export async function getReviewsByProductId({ productId, limit = 5, skip = 0 }) {
  if (!productId) throw new Error("productId is required");

  await dbConnect();

  const reviews = await reviewModel
    .find({ productId, hidden: false }) // only visible reviews
    .sort({ createdAt: -1 })           // latest first
    .skip(skip)
    .limit(limit)
    .lean();

  return replaceMongoIdInArray(reviews);
}

/**
 * Fetch total review count for a product
 * @param {string} productId
 */
export async function getReviewCount(productId) {
  if (!productId) throw new Error("productId is required");

  await dbConnect();

  return reviewModel.countDocuments({ productId, hidden: false });
}


export async function getAllShops(options = {}) {
  await dbConnect();

  const { limit, sortBy } = options;

  let query = shopModel.find().lean();

  if (sortBy) {
    switch (sortBy) {
      case "rating":
        query = query.sort({ rating: -1 });
        break;
      case "newest":
        query = query.sort({ createdAt: -1 });
        break;
      default:
        break;
    }
  }

  if (limit) query = query.limit(limit);

  const shops = await query;

  return replaceMongoIdInArray(shops);
}

/**
 * Get a single shop by ID
 * @param {string} shopId
 */


export async function getShopById(shopId) {
  await dbConnect();
  if (!shopId) return null;

  // Query by string _id if _id in DB is string
  const shop = await shopModel.findOne({ _id: shopId }).lean();
  
  return shop ? replaceMongoIdInObject(shop) : null;
}


/**
 * Get a single shop by slug
 * @param {string} slug
 */
export async function getShopBySlug(slug) {
  await dbConnect();
console.log(slug);

  const shop = await shopModel.findOne({ shopSlug: slug }).lean();
  if (!shop) return null;
console.log(shop);

  return replaceMongoIdInObject(shop);
}

// async function findCart(productId) {
//     const matches = await cartModel.find({productId: productId.toString()});

//     const found = matches.find((match) => {
//         return (
//             isDateInBetween(checkin, match.checkin, match.checkout) ||
//             isDateInBetween(checkout, match.checkin, match.checkout)
//         )
//     });

//     return found;
// }

export async function getUserByEmail(email) {
    const users = await userModel.find({email: email}).lean();

    return replaceMongoIdInObject(users[0]);
    
}

export async function getCartsByUser(userId) {
    const carts = await cartModel.find({userId: userId}).lean();

    return replaceMongoIdInArray(carts);
}