import ProductRow from "./ProductRow";

export default function InventoryTable({ products, fetchProducts, onEdit }) {
  return (
    <div className="bg-white border border-gray-300 rounded shadow-sm overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100 border-b border-gray-300 text-gray-600 font-bold uppercase tracking-wider text-[11px]">
          <tr>
            <th className="p-3 text-center w-12"><input type="checkbox" /></th>
            <th className="p-3">Status</th>
            <th className="p-3">Image</th>
            <th className="p-3">Product Name</th>
            <th className="p-3">Category</th>
            <th className="p-3">Brand</th>
            <th className="p-3">Price (৳)</th>
            <th className="p-3">Available</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              fetchProducts={fetchProducts}
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
