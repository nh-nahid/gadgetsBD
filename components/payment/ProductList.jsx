import ProductItem from "./ProductItem";

export default function ProductList({ cartItems = [], buyNowProduct = null, onQtyChange }) {
  // Use productId consistently
  const productsToShow = buyNowProduct
    ? [buyNowProduct, ...cartItems.filter(item => item.productId !== buyNowProduct.productId)]
    : cartItems;

  if (!productsToShow.length) {
    return <p className="text-center py-4">No products to display.</p>;
  }

  return (
    <div className="pb-6 border-b border-gray-300">
      <div className="flex items-center mb-4">
        <span className="section-number mr-4">2</span>
        <span className="font-bold text-lg">Review items</span>
      </div>

      <div className="box p-4 space-y-4">
        {productsToShow.map(product => (
          <ProductItem
            key={product.productId} // use productId consistently
            product={product}
            onQtyChange={onQtyChange}
          />
        ))}
      </div>
    </div>
  );
}
