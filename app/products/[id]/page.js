import React from "react";

const ProductPage = ({ params }) => {
  const { id } = params;

  return (
    <div>
      <h1 className="text-3xl font-bold">Product {id} Page</h1>
      <p>This is the full product page.</p>
    </div>
  );
};

export default ProductPage;
