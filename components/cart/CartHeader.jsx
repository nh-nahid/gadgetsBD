export default function CartHeader() {
  return (
    <div className="bg-white p-4 mb-4 border-b border-gray-300">
      <h1 className="text-2xl font-normal mb-2">Shopping Cart</h1>
      <div className="text-sm text-gray-600">
        <a href="products.html" className="text-amazon-blue hover:underline">
          Continue shopping
        </a>
      </div>
    </div>
  );
}
