// app/products/page.jsx
import ProductGrid from "@/components/products/ProductGrid";
import SidebarFilter from "@/components/search/SidebarFilter";
import { getAllProducts } from "@/database/queries";
import { slugify } from "@/utils/slugify";
import SortDropdown from "@/components/search/SortDropDown";
import SearchResultsHeader from "@/components/search/SearchResultHeader";
import Link from "next/link";
import { replaceMongoIdInArray } from "@/utils/data-util";

const BATCH_SIZE = 6;

// Price slug → numeric range
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

// Normalize function for consistent comparison
const normalize = (str) => slugify(String(str || "").trim().toLowerCase());

// Map sidebar category → actual DB category
const categoryMap = {
  "Laptops & Computers": "Laptops",
  "Smartphones & Tablets": "Smartphones",
  "Audio & Headphones": "Audio",
  "Gaming Accessories": "Gaming",
  "Cameras & Photography": "Cameras",
  "Wearables & Smartwatches": "Wearables",
};

const ProductsPage = async ({ searchParams }) => {
  const limit = searchParams?.limit ? Number(searchParams.limit) : BATCH_SIZE;
  const keyword = searchParams?.q || "";
  const sort = searchParams?.sort || "featured";

  // Helper to extract multi-select params
  const extractParam = (key) => {
    if (!searchParams?.[key]) return [];
    return Array.isArray(searchParams[key])
      ? searchParams[key].filter((v) => v.toLowerCase() !== "all")
      : [searchParams[key]].filter((v) => v.toLowerCase() !== "all");
  };

  // Get selected filters from URL
  const selectedCategories = extractParam("category");
  const selectedBrands = extractParam("brand");
  const selectedPrices = extractParam("price");
  const selectedConditions = extractParam("condition");
  const selectedAvailability = extractParam("availability");
  const selectedReviews = extractParam("review");

  // Fetch all products
  let allProducts = await getAllProducts();

  // Replace MongoDB _id with plain id
  allProducts = replaceMongoIdInArray(allProducts);

  // -----------------------
  // Apply filters
  // -----------------------

  // Category
  if (selectedCategories.length > 0) {
    allProducts = allProducts.filter((p) =>
      selectedCategories.some(
        (cat) => normalize(p.category) === normalize(categoryMap[cat] || cat)
      )
    );
  }

  // Brand
  if (selectedBrands.length > 0) {
    allProducts = allProducts.filter((p) =>
      selectedBrands.includes(normalize(p.brand))
    );
  }

  // Price
  if (selectedPrices.length > 0) {
    allProducts = allProducts.filter((p) =>
      selectedPrices.some((slug) => {
        const [min, max] = priceSlugToRange(slug);
        return Number(p.price) >= min && Number(p.price) <= max;
      })
    );
  }

  // Condition
  if (selectedConditions.length > 0) {
    allProducts = allProducts.filter((p) =>
      selectedConditions.includes(normalize(p.condition))
    );
  }

  // Availability
  if (selectedAvailability.length > 0) {
    allProducts = allProducts.filter((p) =>
      selectedAvailability.includes(normalize(p.availability))
    );
  }

  // Reviews (minimum rating)
  if (selectedReviews.length > 0) {
    allProducts = allProducts.filter((p) =>
      selectedReviews.some((slug) => {
        const minRating = slug.startsWith("★★★★") ? 4 : 3;
        return (p.averageRating || 0) >= minRating;
      })
    );
  }

  // Keyword search
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    allProducts = allProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerKeyword) ||
        p.description.toLowerCase().includes(lowerKeyword)
    );
  }

  // -----------------------
  // Sorting
  // -----------------------
  const getCreatedAt = (product) => {
    if (product.createdAt) return new Date(product.createdAt);
    if (product.id) return new Date(parseInt(product.id.substring(0, 8), 16) * 1000);
    return new Date(0);
  };

  switch (sort) {
    case "price-asc":
      allProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      allProducts.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      allProducts.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      break;
    case "newest":
      allProducts.sort((a, b) => getCreatedAt(b) - getCreatedAt(a));
      break;
    default:
      allProducts.sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0));
      break;
  }

  // -----------------------
  // Pagination
  // -----------------------
  const products = allProducts.slice(0, limit);
  const hasMore = allProducts.length > limit;

  // Build URL params for Load More
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
      {/* Header + Sort */}
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
        {/* Sidebar */}
        <SidebarFilter />

        {/* Product Grid */}
        <div className="flex-1 space-y-4">
          {products.length > 0 ? (
            <>
              <ProductGrid products={products} />

              {/* Load More */}
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
            <div className="text-center py-20 text-gray-500 text-lg">
              No products found matching your filters.
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductsPage;
