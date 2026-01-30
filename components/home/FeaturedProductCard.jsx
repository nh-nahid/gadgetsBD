"use client";

import Image from "next/image";
import Link from "next/link";

const FeaturedProductCard = ({ product }) => {
  return (
    <div className="flex-none w-48">
      {/* Product image + title */}
      <Link href={`/products/${product.slug}`}>
        <div className="bg-gray-50 h-48 flex items-center justify-center mb-2 p-2">
          <Image
            src={product.images?.find(img => img.isMain)?.url || product.images?.[0]?.url}
            alt={product.title}
            width={150}
            height={150}
            className="h-full object-cover mix-blend-multiply"
          />
        </div>

        <div className="text-sm text-amazon-blue hover:text-amazon-orange line-clamp-2">
          {product.title}
        </div>
      </Link>

      {/* ✅ Shop name */}
      <div className="text-xs text-gray-500 mt-1">
        {product.shop?.shopName}
        {product.shop?.isOfficial && " ✓"}
      </div>

      {/* Price */}
      <div className="mt-1">
        <span className="text-xs align-top">৳</span>
        <span className="text-xl font-bold">{product.price}</span>
      </div>

      {/* ✅ Delivery text */}
      {product.deliveryText && (
        <div className="text-xs text-green-700 mt-1">
          Get it by <span className="font-semibold">{product.deliveryText}</span>
        </div>
      )}

      {/* Add to cart */}
      <button
        className=" w-full bg-amazon-yellow py-1.5 rounded-md text-sm mt-2 transition-all duration-200 hover:bg-yellow-400 hover:shadow-md hover:-translate-y-0.5"
      >
        Add to Cart
      </button>

    </div>
  );
};

export default FeaturedProductCard;
