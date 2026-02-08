"use client";

import Image from "next/image";

export default function ProductItem({ product, onQtyChange }) {
  const maxQty = product.stock ? Math.min(product.stock, 10) : 10;

  return (
    <div className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
     
      <div className="relative w-24 h-24 bg-gray-50 flex-shrink-0 rounded">
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.name}
          fill
          sizes="96px"
          className="object-cover rounded"
        />
      </div>


      <div className="flex-1">
        <h3 className="text-sm font-medium mb-1">{product.name}</h3>
        <p className="text-xs text-gray-600 mb-2">
          Sold by: {product.seller}
        </p>

        <div className="flex items-center justify-between gap-4">
        
          <p className="text-sm font-bold text-amazon-orange">
            ৳{Number(product.price).toLocaleString()}
          </p>

         
          <div className="flex items-center gap-2 text-xs">
            <label htmlFor={`qty-${product.productId}`}>Qty:</label>
            <select
              id={`qty-${product.productId}`}
              value={product.quantity}
              onChange={(e) =>
                onQtyChange(product.productId, Number(e.target.value))
              }
              className="border border-gray-300 rounded px-2 py-0.5"
            >
              {Array.from({ length: maxQty }, (_, i) => i + 1).map(
                (qty) => (
                  <option key={qty} value={qty}>
                    {qty}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
