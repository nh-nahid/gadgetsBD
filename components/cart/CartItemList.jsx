import CartItem from "./CartItem";

export default function CartItemList({ items = [], selectedItems = {}, toggleSelect, onQtyChange, onRemove, userId }) {
  if (!items.length) return <p className="text-center py-4">No items in cart.</p>;

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
