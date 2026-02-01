import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/utils/slugify";

const PopularCategories = ({ products, maxCategories = 6 }) => {
  const categories = {};

  products.forEach((product) => {
    if (!categories[product.category]) {
      categories[product.category] = [];
    }
    categories[product.category].push(product);
  });

  const categoryEntries = Object.entries(categories).slice(0, maxCategories);

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categoryEntries.map(([category, items]) => {
          const image = items[0]?.images?.[0]?.url;
          const link = `/products?category=${slugify(category)}`;

          return (
            <Link
              key={category}
              href={link}
              className="bg-white p-4 text-center hover:shadow-md transition-shadow border border-gray-200 rounded"
            >
              <div className="h-32 flex items-center justify-center mb-2">
                {image && (
                  <Image
                    src={image}
                    alt={category}
                    width={100}
                    height={100}
                    className="h-full object-cover"
                  />
                )}
              </div>
              <h3 className="font-medium text-sm">{category}</h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PopularCategories;
