// components/SidebarFilter.jsx
import { slugify } from "@/utils/slugify";

export default function SidebarFilter({ selectedCategory }) {
  const categories = [
    "Laptops & Computers",
    "Smartphones & Tablets",
    "Audio & Headphones",
    "Gaming Accessories",
    "Cameras & Photography",
    "Wearables & Smartwatches",
  ];

  const brands = ["Apple", "Samsung", "Dell", "HP", "Lenovo", "Sony", "Razer"];
  const prices = [
    "Under ৳10,000",
    "৳10,000 - ৳25,000",
    "৳25,000 - ৳50,000",
    "৳50,000 - ৳1,00,000",
    "Over ৳1,00,000",
  ];
  const conditions = ["New", "Renewed"];
  const availability = ["In Stock", "Pre-Order"];

  // Render a list of checkboxes and pre-select if the slug matches loosely
  const renderCheckboxList = (items, selectedSlug) =>
    items.map((item, idx) => {
      const slug = slugify(item);
      const isSelected =
        selectedSlug && slug.includes(selectedSlug.toLowerCase());
      return (
        <label
          key={idx}
          className="flex items-center gap-2 cursor-pointer hover:text-amazon-orange"
        >
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-amazon-secondary focus:ring-amazon-secondary"
            defaultChecked={isSelected}
          />
          <span className="text-sm">{item}</span>
        </label>
      );
    });

  return (
    <div className="w-64 hidden lg:block flex-shrink-0 border-r pr-4 space-y-6">
      {/* Category */}
      <div>
        <h3 className="font-bold text-base mb-3">Category</h3>
        <div className="space-y-2">
          {renderCheckboxList(categories, selectedCategory)}
        </div>
      </div>

      {/* Brand */}
      <div className="border-t pt-4">
        <h3 className="font-bold text-base mb-3">Brand</h3>
        <div className="space-y-2">{renderCheckboxList(brands)}</div>
      </div>

      {/* Customer Reviews */}
      <div className="border-t pt-4">
        <h3 className="font-bold text-base mb-3">Customer Reviews</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer hover:text-amazon-orange">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-amazon-secondary focus:ring-amazon-secondary"
            />
            <div className="flex items-center gap-1 text-sm text-amazon-secondary">
              <span>★★★★☆</span>
              <span>& Up</span>
            </div>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-amazon-orange">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-amazon-secondary focus:ring-amazon-secondary"
            />
            <div className="flex items-center gap-1 text-sm text-amazon-secondary">
              <span>★★★☆☆</span>
              <span>& Up</span>
            </div>
          </label>
        </div>
      </div>

      {/* Price */}
      <div className="border-t pt-4">
        <h3 className="font-bold text-base mb-3">Price</h3>
        <div className="space-y-2">{renderCheckboxList(prices)}</div>
      </div>

      {/* Availability */}
      <div className="border-t pt-4">
        <h3 className="font-bold text-base mb-3">Availability</h3>
        <div className="space-y-2">{renderCheckboxList(availability)}</div>
      </div>

      {/* Condition */}
      <div className="border-t pt-4">
        <h3 className="font-bold text-base mb-3">Condition</h3>
        <div className="space-y-2">{renderCheckboxList(conditions)}</div>
      </div>
    </div>
  );
}
