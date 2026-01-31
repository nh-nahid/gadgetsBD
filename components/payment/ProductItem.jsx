"use client";

export default function ProductItem({ product, onQtyChange }) {
  // Use product.stock if available, fallback to 20
  const maxQty = product.stock || 20; // You can adjust the default

  return (
    <div className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
      <div className="w-24 h-24 bg-gray-50 flex items-center justify-center flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="h-full object-cover"
        />
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-medium mb-1">{product.name}</h3>
        <p className="text-xs text-gray-600 mb-2">
          Sold by: {product.seller}
        </p>

        <div className="flex items-center gap-4">
          <p className="text-sm font-bold text-amazon-orange">
            ৳{product.price}
          </p>

          <div className="flex items-center gap-2 text-xs">
            <span>Qty:</span>
            <select
              value={product.quantity}
              onChange={(e) =>
                onQtyChange(product.productId, Number(e.target.value))
              }
              className="border border-gray-300 rounded px-2 py-0.5"
            >
              {Array.from({ length: maxQty }, (_, i) => i + 1).map(qty => (
                <option key={qty} value={qty}>
                  {qty}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
