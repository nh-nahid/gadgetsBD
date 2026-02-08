import ManageProductsClient from "@/components/management/ManageProductsClient";
import { Suspense } from "react";


export default function Page() {
  return (
    <Suspense fallback={<div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amazon-blue mb-4"></div>
      <p className="text-gray-700 text-lg font-medium">Loading details...</p>
    </div>}>
      <ManageProductsClient />
    </Suspense>
  );
}
