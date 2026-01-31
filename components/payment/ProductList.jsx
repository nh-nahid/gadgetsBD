// components/ProductList.jsx
import React from "react";
import ProductItem from "./ProductItem";

const products = [
  {
    id: 1,
    name: 'Apple MacBook Pro 16" M2 Max - 32GB RAM, 1TB SSD',
    price: "৳3,45,000",
    image: "https://images.unsplash.com/photo-1675868374786-3edd36dddf04?w=300",
    seller: "Official Apple Store",
  },
  {
    id: 2,
    name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    price: "৳38,500",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200",
    seller: "Sony Official",
  },
  {
    id: 3,
    name: "Razer BlackWidow V4 Pro Mechanical Gaming Keyboard",
    price: "৳18,500",
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=300",
    seller: "Razer Store",
  },
];

export default function ProductList() {
  return (
    <div className="pb-6 border-b border-gray-300">
      <div className="flex items-center mb-4">
        <span className="section-number mr-4">2</span>
        <span className="font-bold text-lg">Review items</span>
      </div>
      <div className="box p-4 space-y-4">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
