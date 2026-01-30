import Link from "next/link";

export default function RelatedProducts({ products = [] }) {
  if (!products.length) return null;

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="text-xl font-bold mb-6">Related Products</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.map((product) => {
          const href = product.slug
            ? `/products/${product.slug}`
            : null;

          const image =
            product.images?.find((img) => img.isMain)?.url ||
            product.images?.[0]?.url ||
            "/placeholder.png";

          return (
            <div
              key={product.id}
              className="border border-gray-200 rounded p-3 hover:shadow-md transition"
            >
              {href ? (
                <Link href={href} className="block">
                  <ProductCardContent
                    image={image}
                    title={product.title}
                    price={product.price}
                  />
                </Link>
              ) : (
                <ProductCardContent
                  image={image}
                  title={product.title}
                  price={product.price}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Extracted for cleanliness ---------- */

function ProductCardContent({ image, title, price }) {
  return (
    <>
      <div className="bg-gray-50 h-32 flex items-center justify-center mb-2">
        <img
          src={image}
          alt={title}
          className="h-full object-cover"
        />
      </div>

      <p className="text-sm text-amazon-blue hover:text-amazon-orange line-clamp-2 mb-1">
        {title}
      </p>

      <p className="text-sm font-bold">
        ৳{price.toLocaleString()}
      </p>
    </>
  );
}
