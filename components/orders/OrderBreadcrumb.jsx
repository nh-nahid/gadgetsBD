import { ChevronRight } from "lucide-react";

const OrderBreadcrumb = () => (
  <div className="flex items-center gap-2 text-sm mb-4">
    <a href="#" className="text-amazon-blue hover:underline">
      Your Account
    </a>
    <ChevronRight className="w-3 h-3 text-gray-400" />
    <span className="text-amazon-orange">Your Orders</span>
  </div>
);

export default OrderBreadcrumb;
