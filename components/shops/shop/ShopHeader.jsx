import Image from "next/image";

export default function ShopHeader({ shop }) {
  
  
  return (
    <div className="relative h-64 w-full mb-6 rounded-sm overflow-hidden">
      <Image
        src={shop.coverImage || "/default-shop-cover.jpg"}
        alt={shop.name}
        fill
        className="object-cover"
      />
      <div className="absolute bottom-4 left-4 text-white">
        <h1 className="text-3xl font-bold">{shop.name}</h1>
        <p className="text-sm">{shop.location.city}, {shop.location.country}</p>
      </div>
    </div>
  );
}
