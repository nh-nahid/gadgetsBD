export default function ProductIdentity({ errors, value, onChange }) {
  return (
    <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
        <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
          Step 1: Product Identity
        </h2>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-1">Product Name</label>
            <input
              name="title"
              value={value.title}
              onChange={onChange}
              type="text"
              placeholder="e.g., Apple MacBook Pro M2 - 16GB RAM"
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
            />
            {errors?.title && <p className="text-red-500 text-xs">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Category</label>
            <select
              name="category"
              value={value.category}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
            >
              <option value="">Select Category</option>
              <option>Laptops & Computers</option>
              <option>Smartphones & Tablets</option>
              <option>Audio & Headphones</option>
              <option>Gaming Accessories</option>
              <option>Cameras & Photography</option>
              <option>Wearables & Smartwatches</option>
            </select>
            {errors?.category && <p className="text-red-500 text-xs">{errors.category}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-1">Brand</label>
            <select
              name="brand"
              value={value.brand}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
            >
              <option value="">Select Brand</option>
              <option>Apple</option>
              <option>Samsung</option>
              <option>Dell</option>
              <option>HP</option>
              <option>Lenovo</option>
              <option>Sony</option>
              <option>Razer</option>
              <option>Logitech</option>
              <option>Other</option>
            </select>
            {errors?.brand && <p className="text-red-500 text-xs">{errors.brand}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Description</label>
            <textarea
              name="description"
              value={value.description}
              onChange={onChange}
              rows={4}
              placeholder="Describe your product features, specifications, and benefits..."
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
            ></textarea>
            {errors?.description && (
              <p className="text-red-500 text-xs">{errors.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
