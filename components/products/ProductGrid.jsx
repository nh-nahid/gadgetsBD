import ProductCard from "./ProductCard";


export default function ProductGrid({ products }) {
  return (
    <div className="flex-1 space-y-4">
      {products.map((p, idx) => (
        <ProductCard key={idx} product={p} />
      ))}
    </div>
  );
}
