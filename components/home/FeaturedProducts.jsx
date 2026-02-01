import Link from "next/link";
import FeaturedProductCard from "./FeaturedProductCard";
import { getFeaturedProducts } from "@/database/queries";

const MAX_VISIBLE = 5;

const FeaturedProducts = async () => {

  const products = await getFeaturedProducts(6);

  if (!products || products.length === 0) return null;

  const visibleProducts = products.slice(0, MAX_VISIBLE);
  const hasMore = products.length > MAX_VISIBLE;

  return (
    <div className="mt-8 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Featured Products</h2>

        {/* ✅ View All link */}
        {hasMore && (
          <Link
            href="/products"
            className="text-amazon-blue text-sm hover:underline hover:text-red-700"
          >
            View All
          </Link>
        )}
      </div>

      {/* Products */}
      <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
        {visibleProducts.map((product) => (
          <FeaturedProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
