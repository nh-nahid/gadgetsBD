import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PopularCategories from "@/components/home/PopularCategories";
import ShopByBrand from "@/components/home/ShopByBrand";
import WhyShopWithUs from "@/components/home/WhyShopWithUs";

import { getAllProducts } from "@/database/queries";

export default async function Home() {
  const products = await getAllProducts();


  const featuredProducts = products
    .filter((p) => p.purchaseCount > 0)
    .sort((a, b) => b.purchaseCount - a.purchaseCount)
    .slice(0, 10); // top 10 featured

  return (
    <main className="flex-1 max-w-[1500px] mx-auto w-full">
      <HeroBanner />

      <div className="relative z-10 -mt-32 px-4">
        {/* pass products to category grid if needed */}
        <CategoryGrid products={products} />

        {/* pass only featured */}
        <FeaturedProducts products={featuredProducts} />
      </div>

      <WhyShopWithUs />
      <PopularCategories />
      <ShopByBrand />
    </main>
  );
}
