import Link from "next/link";
import FeaturedProductCard from "./FeaturedProductCard";

const FeaturedProducts = () => {
  const products = [1, 2, 3, 4, 5]; // later API

  if (products.length === 0) return null;

  return (
    <div className="mt-8 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold">Featured Products</h2>
        <Link
          href="/products"
          className="text-amazon-blue text-sm hover:underline hover:text-red-700"
        >
          View All
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
        {products.map((_, i) => (
          <FeaturedProductCard key={i} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
