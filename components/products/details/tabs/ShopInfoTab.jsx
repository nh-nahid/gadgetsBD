import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function ShopInfoTab({ shop }) {
  if (!shop) return null;

  return (
    <div id="shop-tab" className="tab-content">
      <h2 className="text-xl font-bold mb-4">Shop Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Shop Details */}
        <div>
          <h3 className="font-bold mb-2">{shop.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{shop.description}</p>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-bold">Rating:</span> {shop.rating}/5 ({shop.reviewCount} reviews)
            </p>
            <p>
              <span className="font-bold">Products:</span> {shop.productsCount} items
            </p>
            <p>
              <span className="font-bold">Joined:</span> {shop.joined}
            </p>
            <p>
              <span className="font-bold">Response Time:</span> {shop.responseTime}
            </p>
          </div>
        </div>

        {/* Right: Policies */}
        <div>
          <h3 className="font-bold mb-2">Policies</h3>
          <div className="space-y-2 text-sm">
            {shop.policies?.map((policy, idx) => (
              <p key={idx} className="flex items-center">
                <CheckCircle className="w-4 h-4 inline text-green-600 mr-1" />
                {policy}
              </p>
            ))}
          </div>

          {/* Visit Shop Page */}
          {shop.link && typeof shop.link === "string" && (
            <Link
              href={shop.link}
              className="inline-block mt-4 text-amazon-blue hover:underline text-sm"
            >
              Visit Shop Page →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
