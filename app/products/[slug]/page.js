import Breadcrumbs from "@/components/products/details/Breadcrumbs";
import BuyBox from "@/components/products/details/BuyBox";
import ProductGallery from "@/components/products/details/ProductGallery";
import ProductInfo from "@/components/products/details/ProductInfo";
import RelatedProducts from "@/components/products/details/RelatedProducts";
import ProductTabs from "@/components/products/details/tabs/ProductTabs";

import {
  getProductBySlug,
  getFeaturedProducts,
  getReviewsByProductId,
  getShopByIdOrSlug,
  getShopById
} from "@/database/queries";
import { notFound } from "next/navigation";

const ProductDetailsPage = async ({ params }) => {
  const { slug } = params;

  // Fetch product
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // Fetch related products
  const relatedProducts = await getFeaturedProducts(6);

  // Breadcrumbs
  const breadcrumbs = [
    { label: "Home", href: "/" },
    product.category
      ? {
          label: product.category,
          href: `/products?category=${encodeURIComponent(product.category)}`,
        }
      : null,
    { label: product.title },
  ].filter(Boolean);

  // Images
  const mainImage =
    product.images?.find((img) => img.isMain)?.url ||
    product.images?.[0]?.url;
  const thumbnails = product.images?.map((img) => img.url) || [];

  // UI product for BuyBox / ProductInfo
  const uiProduct = {
    name: product.title,
    storeName: product.shop.shopName,
    storeLink: `/shops/${product.shop.shopId}`,
    ratingsCount: product.totalReviews,
    price: `৳${product.price.toLocaleString()}`,
    features: product.features,
    category: product.category,
    brand: product.brand,
    stock: `${product.stock} units available`,
  };

  // Fetch reviews
  const reviewsData = await getReviewsByProductId({ productId: product.id, limit: 5 });
  const reviews = reviewsData.map((review, index) => ({
    initials: review.userInitials || "U",
    name: review.userName || "Verified Buyer",
    rating: review.rating,
    title: review.title || `Review ${index + 1}`,
    date: review.date ? new Date(review.date).toLocaleDateString() : "",
    content: review.comment,
  }));

  // Fetch shop from DB (dynamic, works for ObjectId or string _id)
  const shopData = await getShopById(product.shop.shopId);

  // Map shop fields to frontend
  const shop = shopData
    ? {
        name: shopData.shopName,
        description: shopData.description || "",
        rating: shopData.rating ?? 0,
        reviewCount: shopData.reviewCount ?? 0,
        productsCount: shopData.productsCount ?? 0,
        joined: shopData.joinedAt
          ? new Date(shopData.joinedAt).toLocaleDateString()
          : "—",
        responseTime: shopData.responseTime || "Within 2 hours",
        policies: shopData.policies || [],
        link: shopData.id ? `/shops/${shopData.id}` : null,
      }
    : {
        // fallback to embedded product shop info
        name: product.shop.shopName,
        description: "",
        rating: 0,
        reviewCount: 0,
        productsCount: 0,
        joined: "—",
        responseTime: "Within 2 hours",
        policies: [],
        link: null,
      };

  return (
    <main className="flex-1 max-w-[1500px] mx-auto w-full p-4">
      <Breadcrumbs paths={breadcrumbs} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <ProductGallery mainImage={mainImage} thumbnails={thumbnails} />
        <ProductInfo product={uiProduct} />
        <BuyBox
          price={`৳${product.price.toLocaleString()}`}
          stock={product.availability}
          deliveryText={product.deliveryText}
          freeDelivery={product.freeDelivery}
          product={product}
        />
      </div>

      <div className="mt-12">
        <ProductTabs
          description={product.description}
          features={product.features}
          reviews={reviews}
          shop={shop} // pass dynamic, fully normalized shop data
          productId={product.id}
        />
      </div>

      <RelatedProducts products={relatedProducts} />
    </main>
  );
};

export default ProductDetailsPage;
