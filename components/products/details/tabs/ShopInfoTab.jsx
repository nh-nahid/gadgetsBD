import Link from "next/link";
import { CheckCircle, Star } from "lucide-react";

export default function ShopInfoTab({ shop }) {
  if (!shop) return null;

  const {
    name,
    description = "No description available",
    rating = { average: 0, count: 0 },
    productsCount = 0,
    joined = "—",
    responseTime = "Within 2 hours",
    policies = [],
    link,
    coverImage,
    shopSlug,
  } = shop;


  const averageRating = typeof rating === "number" ? rating : rating?.average ?? 0;
  const reviewCount = rating?.count ?? 0;

  return (
    <div id="shop-tab" className="tab-content mt-6">
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-2">
        Shop Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          {coverImage && (
            <img
              src={coverImage}
              alt={name}
              className="w-full h-48 object-cover rounded-md shadow-sm"
            />
          )}

          <h3 className="text-xl font-semibold">{name}</h3>
          <p className="text-sm text-gray-600">{description}</p>

          <div className="space-y-1 text-sm">
            <p className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="font-semibold">{averageRating.toFixed(1)}</span>/5 (
              {reviewCount} review{reviewCount !== 1 ? "s" : ""})
            </p>
            <p>
              <span className="font-semibold">Products:</span> {productsCount}{" "}
              item{productsCount !== 1 ? "s" : ""}
            </p>
            <p>
              <span className="font-semibold">Joined:</span> {joined}
            </p>
            <p>
              <span className="font-semibold">Response Time:</span> {responseTime}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold mb-2">Policies</h3>
          {policies.length > 0 ? (
            <div className="space-y-2 text-sm">
              {policies.map((policy, idx) => (
                <p key={idx} className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  {policy}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No policies listed.</p>
          )}

          {link && typeof link === "string" && (
            <Link
              href={`/shops/${shopSlug}`}
              className="mt-4 inline-block text-amazon-blue hover:underline text-sm font-medium"
            >
              Visit Shop Page →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
