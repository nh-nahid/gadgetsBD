import { ChevronRight } from "lucide-react";
import Link from "next/link";

const OrderBreadcrumb = () => (
  <div className="flex items-center gap-2 text-sm mb-4">
    <Link href="/me" className="text-amazon-blue hover:underline">
      Your Account
    </Link>
    <ChevronRight className="w-3 h-3 text-gray-400" />
    <span className="text-amazon-orange">Your Orders</span>
  </div>
);

export default OrderBreadcrumb;
