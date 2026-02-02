import { PackageX } from "lucide-react";
import Link from "next/link";

const EmptyOrders = ({ role = "USER", type = "no-orders" }) => {
  const isFiltered = type === "filtered";
  const isShopOwner = role === "SHOP_OWNER";

  const title = isFiltered
    ? "No orders found"
    : isShopOwner
    ? "No orders for your shop"
    : "You have no orders";

  const description = isFiltered
    ? "Try changing the filter or selecting a different time period."
    : isShopOwner
    ? "Orders placed by customers will appear here."
    : "When you place an order, it will appear here.";

  return (
    <div className="border border-gray-200 rounded-lg p-10 flex flex-col items-center text-center bg-gray-50">
      <PackageX className="w-10 h-10 text-gray-400 mb-4" />

      <h2 className="text-lg font-semibold text-gray-800 mb-1">
        {title}
      </h2>

      <p className="text-sm text-gray-600 max-w-md mb-4">
        {description}
      </p>

      {!isFiltered && !isShopOwner && (
        <Link
          href="/"
          className="px-5 py-2 text-sm font-medium rounded-md bg-yellow-400 hover:bg-yellow-500 text-black"
        >
          Start shopping
        </Link>
      )}
    </div>
  );
};

export default EmptyOrders;
