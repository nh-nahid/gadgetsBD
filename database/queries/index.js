import { cartModel } from "@/models/cart-model";
import orderModel from "@/models/order-model";
import { productModel } from "@/models/product-model";
import { reviewModel } from "@/models/review-model";
import { shopModel } from "@/models/shop-model";
import { userModel } from "@/models/user-model";
import { dbConnect } from "@/services/mongo";
import mongoose from "mongoose";
import mongoClientPromise from "../mongoClientPromise";
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/utils/data-util";

await dbConnect();

/* ======================
   Products
====================== */
export async function getAllProducts(options = {}) {
  const { limit, sortBy } = options;

  let query = productModel.find({ isActive: true }).lean();

  if (sortBy) {
    switch (sortBy) {
      case "price-asc": query = query.sort({ price: 1 }); break;
      case "price-desc": query = query.sort({ price: -1 }); break;
      case "rating": query = query.sort({ averageRating: -1 }); break;
      case "newest": query = query.sort({ createdAt: -1 }); break;
      case "featured": default: break;
    }
  }

  if (limit) query = query.limit(limit);

  const products = await query;
  return replaceMongoIdInArray(products);
}

export async function getProductById(productId) {
  if (!productId) return null;
  const product = await productModel.findById(productId).lean();
  return product ? replaceMongoIdInObject(product) : null;
}

export async function getProductBySlug(slug) {
  const product = await productModel.findOne({ slug, isActive: true }).lean();
  return product ? replaceMongoIdInObject(product) : null;
}

export async function getFeaturedProducts(limit = 6) {
  const products = await productModel
    .find({ isActive: true, purchaseCount: { $gt: 0 } })
    .sort({ purchaseCount: -1 })
    .limit(limit)
    .lean();

  return replaceMongoIdInArray(products);
}

/* ======================
   Reviews
====================== */
export async function getReviewsByProductId({ productId, limit = 5, skip = 0 }) {
  if (!productId) throw new Error("productId is required");

  const reviews = await reviewModel
    .find({ productId, hidden: false })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return replaceMongoIdInArray(reviews);
}

export async function getReviewCount(productId) {
  if (!productId) throw new Error("productId is required");
  return reviewModel.countDocuments({ productId, hidden: false });
}

/* ======================
   Shops
====================== */
export async function getAllShops(options = {}) {
  const { limit, sortBy } = options;

  let query = shopModel.find().lean();

  if (sortBy) {
    switch (sortBy) {
      case "rating": query = query.sort({ rating: -1 }); break;
      case "newest": query = query.sort({ createdAt: -1 }); break;
      default: break;
    }
  }

  if (limit) query = query.limit(limit);

  const shops = await query;
  return replaceMongoIdInArray(shops);
}

export async function getShopById(shopId) {
  if (!shopId) return null;
  const shop = await shopModel.findById(shopId).lean();
  return shop ? replaceMongoIdInObject(shop) : null;
}

export async function getShopBySlug(slug) {
  if (!slug) return null;
  const shop = await shopModel.findOne({ shopSlug: slug }).lean();
  return shop ? replaceMongoIdInObject(shop) : null;
}

/* ======================
   Users
====================== */
export async function getUserByEmail(email) {
  if (!email) return null;
  const user = await userModel.findOne({ email }).lean();
  return user ? replaceMongoIdInObject(user) : null;
}

/* ======================
   Cart
====================== */
export async function getCartsByUser(userId) {
  if (!userId) return [];
  const carts = await cartModel.find({ userId }).lean();
  return replaceMongoIdInArray(carts);
}

export async function getFullCartByUser(userId) {
  if (!userId) throw new Error("userId is required");
  const carts = await cartModel.find({ userId }).lean();

  return carts.map((cart) => {
    const newCart = replaceMongoIdInObject(cart);
    if (newCart.items?.length) {
      newCart.items = newCart.items.map((item) => {
        const newItem = replaceMongoIdInObject(item);
        newItem.productId = newItem.productId.toString();
        return newItem;
      });
    }
    return newCart;
  });
}

/* ======================
   Orders
====================== */
export async function getOrderByNumber(orderNumber) {
  if (!orderNumber) return null;

  const order = await orderModel.findOne({ orderNumber }).lean();

  return order ? replaceMongoIdInObject(order) : null;
}

export async function getOrdersByUser(userId) {
  if (!userId) return [];
  const orders = await orderModel.find({ userId }).sort({ createdAt: -1 }).lean();
  return replaceMongoIdInArray(orders);
}

/* ======================
   Most Purchased Products
====================== */
export async function getMostPurchasedProducts(limit = 10) {
  const client = await mongoClientPromise;
  const db = client.db();

  const aggregation = await db.collection("orders").aggregate([
    { $unwind: "$items" },
    { $group: { _id: "$items.productId", totalSold: { $sum: "$items.quantity" } } },
    { $sort: { totalSold: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product"
      }
    },
    { $unwind: "$product" },
    {
      $project: {
        _id: "$product._id",
        title: "$product.title",
        slug: "$product.slug",
        price: "$product.price",
        images: "$product.images",
        stock: "$product.stock",
        shop: "$product.shop",
        deliveryText: "$product.deliveryText",
        freeDelivery: "$product.freeDelivery",
        totalSold: 1,
      }
    }
  ]).toArray();

  return aggregation.map(p => replaceMongoIdInObject(p));
}


/* ======================
   Orders for Shop Owner
====================== */
export async function getOrdersForShopOwner(shopOwnerId) {
  if (!shopOwnerId) return [];

  // Fetch all orders that contain items from this shop owner
  const orders = await orderModel
    .find({ "items.shopOwnerId": shopOwnerId })
    .sort({ createdAt: -1 })
    .lean();

  const filteredOrders = orders.map((order) => {
    // Filter only the items for this shop owner
    const shopItems = order.items
      .filter((item) => item.shopOwnerId.toString() === shopOwnerId.toString())
      .map((item) => ({
        ...item,
        id: item._id.toString(),
        productId: item.productId.toString(),
        shopOwnerId: item.shopOwnerId.toString(),
      }));

    const newOrder = {
      ...order,
      id: order._id.toString(),
      items: shopItems,
      userId: order.userId.toString(),
    };

    // ✅ FIX: If there is only 1 product for this shop owner, sync order status
    if (shopItems.length === 1) {
      newOrder.status = shopItems[0].status;
    }

    return newOrder;
  });

  return filteredOrders;
}


