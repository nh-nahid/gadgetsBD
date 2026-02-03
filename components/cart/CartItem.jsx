export default function CartItem({ item }) {
  return (
    <div className="p-4 border-b border-gray-300 flex gap-4 hover:bg-gray-50">
      <div className="w-32 h-32 flex-shrink-0">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover rounded border"
        />
      </div>

      <div className="flex-1">
        <h3 className="font-medium text-base mb-1">
          {item.title}
        </h3>

        <p className="text-sm text-green-700 font-medium">
          {item.stock > 0 ? "In Stock" : "Out of Stock"}
        </p>

        <p className="text-xs text-gray-600 mt-1">
          Sold by: {item.shopName}
        </p>

        {item.freeShipping && (
          <p className="text-xs text-gray-600">
            Eligible for FREE Shipping
          </p>
        )}

        <div className="flex items-center gap-4 mt-3">
          <span className="text-sm">Qty: {item.quantity}</span>
          <span className="text-gray-300">|</span>
          <button className="text-sm text-amazon-blue hover:underline">
            Delete
          </button>
        </div>
      </div>

      <div className="text-right">
        <p className="text-lg font-bold text-amazon-orange">
          ৳{item.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
