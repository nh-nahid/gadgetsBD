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
  getShopById,
} from "@/database/queries";
import { notFound } from "next/navigation";

const ProductDetailsPage = async ({ params }) => {
  const { slug } = params;

  // Fetch main product
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // Fetch related products (limit 6)
  const relatedProductsData = await getFeaturedProducts(6);
  const relatedProducts = relatedProductsData
    .filter((p) => p.id !== product.id) // exclude current product
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      price: p.price,
      images: p.images || [],
    }));

  // Breadcrumbs
  const breadcrumbs = [
    { label: "Home", href: "/" },
    product.category
      ? { label: product.category, href: `/products?category=${encodeURIComponent(product.category)}` }
      : null,
    { label: product.title },
  ].filter(Boolean);

  // Images
  const mainImage = product.images?.find((img) => img.isMain)?.url || product.images?.[0]?.url || "/placeholder.png";
  const thumbnails = product.images?.map((img) => img.url) || [];

  // UI product for BuyBox / ProductInfo
  const uiProduct = {
    name: product.title,
    storeName: product.shop.shopName,
    storeLink: `/shops/${product.shop.shopId}`,
    ratingsCount: product.totalReviews || 0,
    price: `৳${product.price.toLocaleString()}`,
    features: product.features || [],
    category: product.category,
    brand: product.brand,
    stock: `${product.stock} units available`,
  };

  // Fetch first 5 reviews
  const reviewsData = await getReviewsByProductId({ productId: product.id, limit: 5 });
  const reviews = reviewsData.map((review, index) => ({
    id: review.id,
    initials: review.initials || (review.name ? review.name.charAt(0).toUpperCase() : "U"),
    name: review.name || "Verified Buyer",
    rating: review.rating,
    title: review.title || `Review ${index + 1}`,
    date: review.date ? new Date(review.date).toLocaleDateString() : "",
    comment: review.comment,
    verified: review.verified ?? true,
    userId: review.userId, // needed for client-side edit/delete logic
  }));

  // Fetch shop info
  const shopData = await getShopById(product.shop.shopId);
  const shop = shopData
    ? {
        name: shopData.shopName,
        description: shopData.description || "",
        rating: shopData.rating ?? 0,
        reviewCount: shopData.reviewCount ?? 0,
        productsCount: shopData.productsCount ?? 0,
        joined: shopData.joinedAt ? new Date(shopData.joinedAt).toLocaleDateString() : "—",
        responseTime: shopData.responseTime || "Within 2 hours",
        policies: shopData.policies || [],
        link: shopData.id ? `/shops/${shopData.id}` : null,
      }
    : {
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
      {/* Breadcrumbs */}
      <Breadcrumbs paths={breadcrumbs} />

      {/* Product main section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        <ProductGallery mainImage={mainImage} thumbnails={thumbnails} />
        <ProductInfo product={uiProduct} />
        <BuyBox
          price={`৳${product.price.toLocaleString()}`}
          stock={product.availability || product.stock}
          deliveryText={product.deliveryText}
          freeDelivery={product.freeDelivery}
          product={product}
        />
      </div>

      {/* Product tabs (description, features, reviews) */}
      <div className="mt-12">
        <ProductTabs
          description={product.description}
          features={product.features}
          reviews={reviews}
          shop={shop}
          productId={product.id} 
        />
      </div>

      {/* Related Products */}
      <RelatedProducts products={relatedProducts} />
    </main>
  );
};

export default ProductDetailsPage;
