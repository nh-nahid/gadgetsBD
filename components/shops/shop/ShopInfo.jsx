import ShopRating from "../ShopRating";
import Image from "next/image";

export default function ShopInfo({ shop }) {
  return (
    <div className="bg-white rounded-sm shadow-sm overflow-hidden mb-6 p-4 flex flex-col md:flex-row gap-4">
      
      <div className="flex-shrink-0 w-40 h-40 relative rounded-sm overflow-hidden">
        <Image
          src={
            shop?.coverImage ||
            "https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1699909962/fallback_image_header/fallback_image_header-png?_i=AA"
          }
          alt={shop.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between gap-2">
        <h2 className="text-xl font-bold text-amazon-blue">{shop.name}</h2>
        
        <p className="text-gray-700 text-sm">{shop.description}</p>

        <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
          <ShopRating average={shop.rating.average} count={shop.rating.count} />
          <span className="text-xs font-semibold text-gray-600">
            Specializes in: {shop.specializesIn.join(", ") || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
