import { productModel } from "@/models/product-model";
import { dbConnect } from "@/services/mongo";
import { replaceMongoIdInArray } from "@/utils/data-util";

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
