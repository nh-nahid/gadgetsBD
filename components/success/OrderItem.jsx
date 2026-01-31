import Link from "next/link";

export default function OrderItem({ item }) {
  return (
    <div className="flex gap-4 items-start pt-4 border-t border-gray-100">
      <img
        src={item.image}
        className="w-20 h-20 object-cover border border-gray-200 rounded"
        alt={item.title}
      />

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
          ৳{item.price}
        </p>
      </div>
    </div>
  );
}
