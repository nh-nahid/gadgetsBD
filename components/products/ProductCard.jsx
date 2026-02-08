import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  const mainImage = product.images.find((img) => img.isMain)?.url;
  const ratingStars = Math.round(product.averageRating); 
  const emptyStars = 5 - ratingStars;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="flex gap-4 p-4 border rounded hover:shadow-md transition"
    >
      
      <div className="w-48 h-48 flex-shrink-0 bg-gray-50 flex items-center justify-center">
        <Image height={100} width={100}
          src={mainImage || "/placeholder.png"}
          alt={product.title}
          className="h-full object-cover mix-blend-multiply"
        />
      </div>

     
      <div className="flex-1">
        <h3 className="text-lg text-amazon-blue hover:text-amazon-orange font-normal mb-1">
          {product.title}
        </h3>

      
        <div className="flex items-center gap-2 mb-2">
          <div className="flex text-amazon-secondary">
            {"★".repeat(ratingStars) + "☆".repeat(emptyStars)}
          </div>
          <span className="text-sm text-amazon-blue">{product.totalReviews}</span>
        </div>

      
        <div className="mb-2">
          <span className="text-2xl font-normal">
            {product.currency} {product.price.toLocaleString("en-BD")}
          </span>
        </div>

    
        {product.freeDelivery && (
          <p className="text-sm text-gray-600 mb-2">
            FREE delivery <strong>{product.deliveryText}</strong>
          </p>
        )}

        
        <p className="text-xs text-gray-500">
          {product.features.slice(0, 3).join(" | ")}
        </p>
      </div>
    </Link>
  );
}
