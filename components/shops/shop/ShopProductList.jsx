import Link from "next/link";
import Image from "next/image";

export default function ShopProductList({ products }) {
  if (!products?.length) return <p>No products available.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product._id} className="bg-white rounded-sm shadow-sm overflow-hidden">
          <Link href={`/product/${product.slug}`}>
            <div className="relative h-48 w-full">
              <Image
                src={product.images?.[0] || "/default-product.jpg"}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg">{product.title}</h3>
              <p className="text-sm text-gray-500 mb-2">${product.price}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
