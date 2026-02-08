import Link from "next/link";
import Image from "next/image";

export default function OrderItem({ item }) {
  return (
    <div className="flex gap-4 items-start pt-4 border-t border-gray-100">
      <div className="relative w-20 h-20 flex-shrink-0 border border-gray-200 rounded overflow-hidden">
        <Image
          src={item.image || "/placeholder.png"}
          alt={item.title}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      <div>
        <Link
          href={`/products/${item.id}`}
          className="text-amazon-blue hover:underline font-bold text-sm"
        >
          {item.title}
        </Link>

        <p className="text-xs text-gray-500 mt-1">
          Quantity: {item.quantity}
        </p>

        <p className="text-xs text-amazon-orange font-bold mt-1">
          ৳{item.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
