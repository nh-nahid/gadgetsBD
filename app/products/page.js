// app/products/page.jsx
import ProductGrid from "@/components/products/ProductGrid";
import SearchResultsHeader from "@/components/search/SearchResultHeader";
import SidebarFilter from "@/components/search/SidebarFilter";
import { getAllProducts } from "@/database/queries";
import { slugify } from "@/utils/slugify";

const BATCH_SIZE = 6;

const ProductsPage = async ({ searchParams }) => {
  const limit = searchParams?.limit ? Number(searchParams.limit) : BATCH_SIZE;
  const selectedCategory = searchParams?.category || null;

  // Fetch all products
  let allProducts = await getAllProducts();

  // Filter by category if selected
  if (selectedCategory) {
    allProducts = allProducts.filter(
      (p) => slugify(p.category) === selectedCategory
    );
  }

  // Slice products for pagination
  const products = allProducts.slice(0, limit);
  const hasMore = allProducts.length > limit;

  return (
    <main className="flex-1 max-w-[1500px] mx-auto w-full p-4">
      {/* Header showing search results */}
      <SearchResultsHeader
        totalResults={allProducts.length}
        query={selectedCategory ? selectedCategory.replace(/-/g, " ") : "All"}
        showingFrom={1}
        showingTo={products.length}
      />

      <div className="flex gap-6">
        {/* Sidebar with pre-selected category */}
        <SidebarFilter selectedCategory={selectedCategory} />

        {/* Product Grid */}
        <div className="flex-1 space-y-4">
          <ProductGrid products={products} />

          {/* Load More button */}
          {hasMore && (
            <div className="flex justify-center mt-4">
              <a
                href={`/products?limit=${limit + BATCH_SIZE}${
                  selectedCategory ? `&category=${selectedCategory}` : ""
                }`}
                className="px-4 py-2 bg-amazon-secondary text-white rounded hover:bg-amazon-orange transition"
              >
                Load More
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductsPage;
