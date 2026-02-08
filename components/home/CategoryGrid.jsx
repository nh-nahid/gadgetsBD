"use client"

import { useSession } from "next-auth/react";
import CategoryCard from "./CategoryCard";
import SignInCategoryCard from "./SignInCategoryCard";
import { slugify } from "@/utils/slugify";


const CategoryGrid = ({ products }) => {
  const { data: user } = useSession();
  const categories = {};

  products.forEach((product) => {
    const category = product.category;
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(product);
  });

  const categoryEntries = Object.entries(categories);

  const maxCategories = user ? categoryEntries.length-1 : 3;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categoryEntries.slice(0, maxCategories).map(([categoryName, items], idx) => {
        const images = items
          .slice(0, 4)
          .map((item) => item.images[0]?.url)
          .filter(Boolean);

        const link = `/products?category=${slugify(categoryName)}`;


        return (
          <CategoryCard
            key={idx}
            title={categoryName}
            images={images.length > 1 ? images : null}
            image={images.length === 1 ? images[0] : null}
            link={link}
            linkText={`Shop ${categoryName.toLowerCase()}`}
          />
        );
      })}

      {!user && <SignInCategoryCard />}
    </div>
  );
};

export default CategoryGrid;
