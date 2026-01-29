import Image from "next/image";
import Link from "next/link";

const FeaturedProductCard = () => {
  return (
    <div className="flex-none w-48">
      <Link href="/products/sample-product">
        <div className="bg-gray-50 h-48 flex items-center justify-center mb-2 p-2">
          <Image
            width={100}
            height={100}
            alt="bg-image"
            src="https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=300"
            className="h-full object-cover mix-blend-multiply"
          />
        </div>
        <div className="text-sm hover:text-amazon-orange text-amazon-blue line-clamp-2">
          Sample Featured Product
        </div>
      </Link>

      <div className="text-xs text-gray-500">Official Store</div>
      <div className="mt-1">
        <span className="text-xs align-top">৳</span>
        <span className="text-xl font-bold">45,000</span>
      </div>

      <button className="w-full bg-amazon-yellow py-1.5 rounded-md text-sm">
        Add to Cart
      </button>
    </div>
  );
};

export default FeaturedProductCard;
