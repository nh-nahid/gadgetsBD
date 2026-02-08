
import ShopHeader from "@/components/shops/ShopHeader";
import { getAllProducts, getShopBySlug } from "@/database/queries";
import ShopInfo from "@/components/shops/shop/ShopInfo";
import ShopProductList from "@/components/shops/shop/ShopProductList";

export default async function ShopPage({ params }) {
  const { slug } = params;

  const shop = await getShopBySlug(slug);

  if (!shop) {
    return (
      <div className="text-center mt-16">
        <h2 className="text-xl font-bold">Shop not found</h2>
        <p className="text-gray-600">The shop you are looking for does not exist.</p>
      </div>
    );
  }


  const allProducts = await getAllProducts({ limit: 50 }); 
  
const products = allProducts.filter((p) => {
  const productShopOwnerId = (p.shop.shopOwnerId || p.shop.shopId)?.toString();
  const shopOwnerId = (shop.shopOwnerId || shop.shopId)?.toString();
  return productShopOwnerId === shopOwnerId;
});



  return (
    <main className="max-w-[1500px] mx-auto p-4 py-8">
      {/* Shop header image */}
      <ShopHeader shop={shop} />

      {/* Shop description and info */}
      <ShopInfo shop={shop} />

      {/* Products */}
      <h2 className="text-xl font-bold mb-4 mt-8">Products</h2>
      <ShopProductList products={products} />
    </main>
  );
}
