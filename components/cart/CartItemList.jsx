import { ShoppingCart } from "lucide-react";
import CartItem from "./CartItem";

export default function CartItemList({ items = [], selectedItems = {}, toggleSelect, onQtyChange, onRemove, userId }) {
  if (!items.length) return (
     <div className="flex flex-col items-center justify-center py-12 text-center text-gray-600">
      {/* Icon */}
      <ShoppingCart className="w-12 h-12 text-yellow-500 mb-4 " />

      {/* Message */}
      <p className="text-lg font-semibold mb-2">
        Your cart is empty
      </p>

      <p className="text-sm text-gray-400">
        Add some gadgets to your cart and start shopping!
      </p>
    </div>
  )
  return (
    <div className="bg-white">
      {items.map(item => (
        <CartItem
          key={item.productId}
          item={item}
          isSelected={!!selectedItems?.[item.productId]}
          toggleSelect={toggleSelect}
          onQtyChange={onQtyChange}
          onRemove={onRemove}
          userId={userId}
        />
      ))}
    </div>
  );
}
