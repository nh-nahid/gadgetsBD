export default function BuyBox({ price, stock }) {
  return (
    <div className="lg:col-span-3">
      <div className="border border-gray-200 rounded p-4">
        <div className="text-3xl text-amazon-orange mb-2">{price}</div>
        <p className="text-sm mb-3">
          <span className="font-bold">FREE delivery</span> <strong>Tomorrow</strong>
        </p>
        <p className="text-green-600 font-bold text-sm mb-4">{stock} In Stock</p>

        <div className="mb-4">
          <label className="text-sm font-bold block mb-2">Quantity:</label>
          <select className="border border-gray-300 rounded px-3 py-1 text-sm w-20">
            {[1,2,3,4,5].map(n => <option key={n}>{n}</option>)}
          </select>
        </div>

        <button className="w-full bg-amazon-yellow hover:bg-amazon-yellow_hover py-2 rounded-md shadow-sm mb-2 text-sm font-medium border border-amazon-secondary">
          Add to Cart
        </button>
        <button className="w-full bg-amazon-secondary hover:bg-amazon-secondary_hover py-2 rounded-md shadow-sm text-sm font-medium text-white">
          Buy Now
        </button>

        <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600">
          <p className="mb-1">Secure transaction</p>
          <p className="mb-1">Ships from Gadgets BD</p>
          <p>Sold by Official Apple Store</p>
        </div>
      </div>
    </div>
  );
}
