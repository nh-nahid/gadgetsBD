import ShopRating from "./ShopRating";
import Image from "next/image";
import Link from "next/link";

export default function ShopCard({ shop }) {
  if (!shop) return null; 


  const {
    name = "Unnamed Shop",
    shopSlug = "#",
    coverImage = "https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1699909962/fallback_image_header/fallback_image_header-png?_i=AA", 
    location = {},
    rating = {},
    description = "No description available.",
    specializesIn = [],
  } = shop;

  const { city = "Unknown City", country = "Unknown Country" } = location;
  const { average = 0, count = 0 } = rating;

  return (
    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Cover Image */}
      <div className="h-48 overflow-hidden">
        <Image
          src={coverImage}
          alt={name}
          width={600}
          height={300}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {/* Shop Info */}
        <div className="mb-2">
          <h3 className="font-bold text-lg text-amazon-blue hover:underline">
            <Link href={`/shops/${shopSlug}`}>{name}</Link>
          </h3>
          <p className="text-sm text-gray-500">
            {city}, {country}
          </p>
        </div>

        {/* Shop Rating */}
        <ShopRating average={average} count={count} />

        {/* Description */}
        <p className="text-sm line-clamp-3 mb-4 text-gray-700">
          {description}
        </p>

        {/* Specializes & Visit Button */}
        <div className="mt-auto pt-4 border-t flex justify-between items-center">
          <span className="text-xs">
            <span className="text-gray-500">Specializes in: </span>
            <strong>{specializesIn.join(", ") || "N/A"}</strong>
          </span>

          <Link
            href={`/shops/${shopSlug}`}
            className="bg-amazon-yellow px-4 py-1.5 rounded-full text-xs font-bold"
          >
            Visit Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
