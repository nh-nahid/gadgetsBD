"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

const FeaturedProductCard = ({ product }) => {
  const { data: session } = useSession();
  const [inCart, setInCart] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync cart state
  useEffect(() => {
    if (!session?.user?.id) return;

    const checkCart = async () => {
      try {
        const res = await fetch(`/api/cart?userId=${session.user.id}`);
        if (!res.ok) return;

        const cart = await res.json();
        const existingItem = cart?.items?.find(
          (item) => item.productId.toString() === product.id
        );
        if (existingItem) setInCart(true);
      } catch (err) {
        console.error(err);
      }
    };

    checkCart();
  }, [session?.user?.id, product.id]);

  // Add to cart
  const handleAddToCart = async () => {
    if (!session?.user?.id) {
      alert("Please login to add items to your cart.");
      return;
    }
    if (product.stock === 0) {
      alert("Sorry, this product is out of stock.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          userId: session.user.id,
          title: product.title,
          slug: product.slug,
          price: product.price,
          currency: product.currency || "BDT",
          image: product.images.find(img => img.isMain)?.url || "",
          stock: product.stock,
          shopName: product?.shop?.shopName || "Unknown Shop",
          freeShipping: product.freeDelivery || false,
        }),
      });
      if (res.ok) setInCart(true);
      else alert("Failed to add product");
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Remove from cart
  const handleRemoveFromCart = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          productId: product.id,
        }),
      });
      if (res.ok) setInCart(false);
      else alert("Failed to remove product");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-none w-48">
      <Link href={`/products/${product.slug}`}>
        <div className="bg-gray-50 h-48 flex items-center justify-center mb-2 p-2">
          <Image
            src={product.images?.find(img => img.isMain)?.url || product.images?.[0]?.url}
            alt={product.title}
            width={150}
            height={150}
            className="h-full object-cover mix-blend-multiply"
          />
        </div>
        <div className="text-sm text-amazon-blue hover:text-amazon-orange line-clamp-2">
          {product.title}
        </div>
      </Link>

      <div className="text-xs text-gray-500 mt-1">
        {product.shop?.shopName}
        {product.shop?.isOfficial && " ✓"}
      </div>

      <div className="mt-1">
        <span className="text-xs align-top">৳</span>
        <span className="text-xl font-bold">{product.price}</span>
      </div>

      {product.deliveryText && (
        <div className="text-xs text-green-700 mt-1">
          Get it by <span className="font-semibold">{product.deliveryText}</span>
        </div>
      )}

      {!inCart ? (
        <button
          onClick={handleAddToCart}
          disabled={loading || product.stock === 0}
          className="w-full bg-amazon-yellow py-1.5 rounded-md text-sm mt-2 hover:bg-yellow-400"
        >
          {loading ? "Processing..." : "Add to Cart"}
        </button>
      ) : (
        <button
          onClick={handleRemoveFromCart}
          disabled={loading}
          className="w-full bg-red-500 py-1.5 rounded-md text-sm mt-2 text-white hover:bg-red-600"
        >
          {loading ? "Processing..." : "Remove from Cart"}
        </button>
      )}
    </div>
  );
};

export default FeaturedProductCard;
