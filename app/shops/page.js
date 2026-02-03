import ShopHeader from "@/components/shops/ShopHeader";
import ShopList from "@/components/shops/ShopList";
import ShopPagination from "@/components/shops/ShopPagination";
import { getAllShops } from "@/database/queries";


export default async function ShopsPage({ searchParams }) {
  const page = parseInt(searchParams?.page || 1, 10);
  const { shops, totalPages } = await getAllShops({ page, limit: 6 });

  return (
    <main className="max-w-[1500px] mx-auto p-4 py-8">
      <ShopHeader />
      <ShopList shops={shops} />
      <ShopPagination page={page} totalPages={totalPages} />
    </main>
  );
}
