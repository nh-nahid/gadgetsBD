import Link from "next/link";
import Image from "next/image";

export default function ShopProductList({ products }) {
  if (!products?.length) return <p>No products available.</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded-sm shadow-sm overflow-hidden"
        >
          <Link href={`/products/${product.slug}`}>
            <div className="relative w-full h-32 sm:h-36 md:h-40 lg:h-44 overflow-hidden rounded-t-lg">
              <Image
                src={product?.images?.[0]?.url || "https://placehold.co/200x100"}
                alt={product?.title || "Product"}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-2 sm:p-3">
              <h3 className="font-bold text-sm sm:text-base line-clamp-2">
                {product.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                ${product.price}
              </p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
