import ProductGrid from "@/components/products/ProductGrid";
import SidebarFilter from "@/components/search/SidebarFilter";
import { getAllProducts } from "@/database/queries";
import SortDropdown from "@/components/search/SortDropDown";
import SearchResultsHeader from "@/components/search/SearchResultHeader";
import Link from "next/link";
import { replaceMongoIdInArray } from "@/utils/data-util";
import { slugify } from "@/utils/slugify";

const BATCH_SIZE = 6;

const priceSlugToRange = (slug) => {
  switch (slug) {
    case "under-10000": return [0, 10000];
    case "10000-25000": return [10000, 25000];
    case "25000-50000": return [25000, 50000];
    case "50000-100000": return [50000, 100000];
    case "over-100000": return [100000, Infinity];
    default: return [0, Infinity];
  }
};

const normalize = (str) => slugify(String(str || "").trim().toLowerCase());

const ProductsPage = async ({ searchParams }) => {
  const limit = searchParams?.limit ? Number(searchParams.limit) : BATCH_SIZE;
  const keyword = searchParams?.q || "";
  const sort = searchParams?.sort || "featured";

  // Extract params
  const extractParam = (key) => {
    if (!searchParams?.[key]) return [];
    const arr = Array.isArray(searchParams[key])
      ? searchParams[key]
      : [searchParams[key]];
    // Ignore "all"
    return arr.filter((v) => v.toLowerCase() !== "all");
  };

  const selectedCategories = extractParam("category");
  const selectedBrands = extractParam("brand");
  const selectedPrices = extractParam("price");
  const selectedConditions = extractParam("condition");
  const selectedAvailability = extractParam("availability");
  const selectedReviews = extractParam("review");

  let allProducts = await getAllProducts();
  allProducts = replaceMongoIdInArray(allProducts);

  // --- FILTERING LOGIC ---

  if (selectedCategories.length > 0) {
    allProducts = allProducts.filter((p) =>
      selectedCategories.includes(slugify(p.category))
    );
  }

  if (selectedBrands.length > 0) {
    allProducts = allProducts.filter((p) =>
      selectedBrands.includes(normalize(p.brand))
    );
  }

  if (selectedPrices.length > 0) {
    allProducts = allProducts.filter((p) =>
      selectedPrices.some((slug) => {
        const [min, max] = priceSlugToRange(slug);
        return Number(p.price) >= min && Number(p.price) <= max;
      })
    );
  }

  if (selectedConditions.length > 0) {
    allProducts = allProducts.filter((p) =>
      selectedConditions.includes(normalize(p.condition))
    );
  }

  if (selectedAvailability.length > 0) {
    allProducts = allProducts.filter((p) =>
      selectedAvailability.includes(normalize(p.availability))
    );
  }

  if (selectedReviews.length > 0) {
    allProducts = allProducts.filter((p) =>
      selectedReviews.some((slug) => {
        const minRating = slug.startsWith("4-star") ? 4 : 3;
        return (p.averageRating || 0) >= minRating;
      })
    );
  }

  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    allProducts = allProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerKeyword) ||
        p.description.toLowerCase().includes(lowerKeyword)
    );
  }

  // --- SORTING ---
  const getCreatedAt = (product) =>
    product.createdAt ? new Date(product.createdAt) : new Date(0);

  switch (sort) {
    case "price-asc": allProducts.sort((a, b) => a.price - b.price); break;
    case "price-desc": allProducts.sort((a, b) => b.price - a.price); break;
    case "rating": allProducts.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0)); break;
    case "newest": allProducts.sort((a, b) => getCreatedAt(b) - getCreatedAt(a)); break;
    default: allProducts.sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0)); break;
  }

  const products = allProducts.slice(0, limit);
  const hasMore = allProducts.length > limit;

  // URL for load more
  const params = new URLSearchParams();
  params.set("limit", limit + BATCH_SIZE);
  selectedCategories.forEach((c) => params.append("category", c));
  selectedBrands.forEach((b) => params.append("brand", b));
  selectedPrices.forEach((p) => params.append("price", p));
  selectedConditions.forEach((c) => params.append("condition", c));
  selectedAvailability.forEach((a) => params.append("availability", a));
  selectedReviews.forEach((r) => params.append("review", r));
  if (keyword) params.set("q", keyword);
  if (sort) params.set("sort", sort);

  return (
    <main className="flex-1 max-w-[1500px] mx-auto w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <SearchResultsHeader
          totalResults={allProducts.length}
          query={
            keyword
              ? keyword
              : selectedCategories.length > 0
              ? selectedCategories.map((c) => c.replace(/-/g, " ")).join(", ")
              : "All"
          }
          showingFrom={1}
          showingTo={products.length}
        />
        <SortDropdown currentSort={sort} />
      </div>

      <div className="flex gap-6">
        <SidebarFilter />
        <div className="flex-1 space-y-4">
          {products.length > 0 ? (
            <>
              <ProductGrid products={products} />
              {hasMore && (
                <div className="flex justify-center mt-4">
                  <Link
                    href={`/products?${params.toString()}`}
                    className="px-4 py-2 bg-amazon-secondary text-white rounded hover:bg-amazon-orange transition"
                  >
                    Load More
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 mb-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3V3z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-sm text-gray-400">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductsPage;
