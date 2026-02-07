export default function PricingInventory({ value, onChange, errors }) {
  return (
    <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
        <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
          Step 2: Pricing & Inventory
        </h2>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            type="number"
            name="price"
            value={value.price}
            onChange={onChange}
            placeholder="Price (৳)"
            className="w-full px-3 py-2 border border-gray-400 rounded-md"
          />
          {errors?.price && <p className="text-red-500 text-xs">{errors.price}</p>}
          <input
            type="number"
            name="stock"
            value={value.stock}
            onChange={onChange}
            placeholder="Stock Quantity"
            className="w-full px-3 py-2 border border-gray-400 rounded-md"
          />
          {errors?.stock && <p className="text-red-500 text-xs">{errors.stock}</p>}
          <input
            type="text"
            name="sku"
            value={value.sku}
            onChange={onChange}
            placeholder="SKU (Optional)"
            className="w-full px-3 py-2 border border-gray-400 rounded-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <select
            name="availability"
            value={value.availability}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-400 rounded-md"
          >
            <option>In Stock</option>
            <option>Pre-Order</option>
            <option>Out of Stock</option>
          </select>

          <select
            name="warranty"
            value={value.warranty}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-400 rounded-md"
          >
            <option>No Warranty</option>
            <option>6 Months</option>
            <option>1 Year</option>
            <option>2 Years</option>
            <option>3 Years</option>
          </select>
        </div>
      </div>
    </div>
  );
}
