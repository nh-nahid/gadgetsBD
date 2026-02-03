import CartItem from "./CartItem";

export default function CartItemList({ items }) {
  return (
    <div className="bg-white">
      {items?.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  );
}
