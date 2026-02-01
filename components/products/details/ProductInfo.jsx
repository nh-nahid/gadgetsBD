import Link from "next/link";
import StarRating from "./StarRatingAll";

export default function ProductInfo({ product }) {
  const hasStoreLink =
    typeof product.storeLink === "string" && product.storeLink.length > 0;

  return (
    <div className="lg:col-span-4">
      <h1 className="text-2xl font-normal mb-2">{product.name}</h1>

      <p className="text-sm text-gray-600 mb-3">
        Visit the{" "}
        {hasStoreLink ? (
          <Link
            href={product.storeLink}
            className="text-amazon-blue hover:underline"
          >
            {product.storeName}
          </Link>
        ) : (
          <span className="text-amazon-blue font-medium">
            {product.storeName}
          </span>
        )}
      </p>

      <div className="flex items-center gap-2 mb-4">
        <StarRating value={product.rating ?? 5} size={4} />
        <span className="text-sm text-amazon-blue hover:underline cursor-pointer">
          {product.ratingsCount} ratings
        </span>
      </div>

      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-sm">Price:</span>
          <span className="text-3xl text-amazon-orange">
            {product.price}
          </span>
        </div>
        <p className="text-xs text-gray-600 mb-2">
          Inclusive of all taxes
        </p>
      </div>

      <div className="border-t border-gray-200 pt-4 mb-4">
        <h3 className="font-bold text-base mb-2">About this item</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          {Array.isArray(product.features) &&
            product.features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
        </ul>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm mb-2">
          <span className="font-bold">Category:</span> {product.category}
        </p>
        <p className="text-sm mb-2">
          <span className="font-bold">Brand:</span> {product.brand}
        </p>
        <p className="text-sm">
          <span className="font-bold">Stock:</span>{" "}
          <span className="text-green-600 font-semibold">
            {product.stock}
          </span>
        </p>
      </div>
    </div>
  );
}
