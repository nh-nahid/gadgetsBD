import ShopCard from "./ShopCard";

export default function ShopList({ shops }) {
  if (!shops || shops.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-8">
        No shops available at the moment.
      </p>
    );
  }
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {shops.map((shop) => (
        <ShopCard key={ shop.id} shop={shop} />
      ))}
    </div>
  );
}
