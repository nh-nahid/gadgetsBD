import { Download } from "lucide-react";
import Link from "next/link";

export default function OrderActions() {
  return (
    <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-4 items-center">
      <button className="w-full sm:w-auto px-8 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 shadow-xs flex items-center justify-center gap-2">
        <Download className="w-4 h-4" />
        Download Invoice
      </button>

      <Link
        href="/orders"
        className="w-full sm:w-auto px-8 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 text-center"
      >
        View All Orders
      </Link>

      <Link
        href="/"
        className="w-full sm:w-auto px-8 py-2 bg-amazon-yellow hover:bg-amazon-yellow_hover border border-amazon-secondary rounded-md text-sm font-bold text-center"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
