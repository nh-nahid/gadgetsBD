"use client";

import { useCart } from "@/app/context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function BuyBox({ product }) {
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(1);
  const [originalQty, setOriginalQty] = useState(1);
  const [inCart, setInCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshCartCount } = useCart();

  const userId = session?.user?.id;
  const role = session?.user?.role || "USER";


  useEffect(() => {
    if (!userId || role === "SHOP_OWNER") return; 

    const checkCart = async () => {
      try {
        const res = await fetch(`/api/cart?userId=${userId}`);
        if (!res.ok) return;

        const cart = await res.json();
        const existingItem = cart?.items?.find(
          (item) => item.productId.toString() === product.id
        );

        if (existingItem) {
          setInCart(true);
          setQuantity(existingItem.quantity);
          setOriginalQty(existingItem.quantity);
        }
      } catch (err) {
        console.error("Failed to sync cart", err);
      }
    };

    checkCart();
  }, [userId, product.id, role]);

  const handleQuantityChange = (e) => {
    const selectedQty = Math.min(Number(e.target.value), product.stock);
    setQuantity(selectedQty);
  };

  const handleCartAction = async () => {
    if (!userId) {
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
          quantity,
          userId,
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

      if (res.ok) {
        refreshCartCount(userId);
        setInCart(true);
        setOriginalQty(quantity);
      } else {
        const data = await res.text();
        alert("Failed to add/update product: " + data);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId: product.id,
        }),
      });

      if (res.ok) {
        refreshCartCount(userId);
        setInCart(false);
        setQuantity(1);
        setOriginalQty(1);
      } else {
        alert("Failed to remove product");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

const buyNow = () => {
  if (!userId) {
    alert("Please login to purchase items.");
    return;
  }

  if (product.stock === 0) {
    alert("Product out of stock");
    return;
  }

  router.push(
    `/payment?buyNow=true&slug=${product.slug}&qty=${quantity}`
  );
};


  const cartButtonLabel = !inCart
    ? "Add to Cart"
    : quantity !== originalQty
    ? "Update Cart"
    : "In Cart";

  const cartButtonDisabled =
    loading || product.stock === 0 || (inCart && quantity === originalQty);

  const cartButtonColor = !inCart
    ? "bg-amazon-yellow hover:bg-amazon-yellow_hover border-amazon-secondary"
    : quantity !== originalQty
    ? "bg-green-500 hover:bg-green-600 border-green-500 text-white"
    : "bg-gray-300 text-gray-600 border-gray-300";

  return (
    <div className="lg:col-span-3 border border-gray-200 rounded p-4">
      <div className="text-3xl text-amazon-orange mb-2">৳{product.price}</div>

      <p className="text-sm mb-3">
        <span className="font-bold">FREE delivery</span>{" "}
        <strong>{product.deliveryText}</strong>
      </p>

      <p className="text-green-600 font-bold text-sm mb-4">
        {product.stock} In Stock
      </p>

      <div className="mb-4">
        <label className="text-sm font-bold block mb-2">Quantity:</label>
        <select
          className="border border-gray-300 rounded px-3 py-1 text-sm w-20"
          value={quantity}
          onChange={handleQuantityChange}
          disabled={product.stock === 0 || role === "SHOP_OWNER"} 
        >
          {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => i + 1).map(
            (n) => (
              <option key={n} value={n}>{n}</option>
            )
          )}
        </select>
      </div>

      {role === "SHOP_OWNER" ? (
        <Link
          href={`/products/${product.slug}`}
          className="w-full block bg-amazon-secondary py-2 rounded-md text-sm mt-2 mb-2 text-white text-center hover:bg-amazon-secondary_hover"
        >
          Manage Product
        </Link>
      ) : (
        <>
          <button
            onClick={handleCartAction}
            disabled={cartButtonDisabled}
            className={`w-full py-2 rounded-md shadow-sm mb-2 text-sm font-medium border ${cartButtonColor}`}
          >
            {loading ? "Processing..." : cartButtonLabel}
          </button>

          {inCart && quantity === originalQty && (
            <button
              onClick={handleRemoveFromCart}
              disabled={loading}
              className="w-full py-2 rounded-md shadow-sm mb-2 text-sm font-medium border bg-red-500 hover:bg-red-600 text-white border-red-500"
            >
              Remove from Cart
            </button>
          )}
        </>
      )}

      <button
        onClick={buyNow}
        disabled={product.stock === 0 || role === "SHOP_OWNER"} 
        className={`w-full bg-amazon-secondary hover:bg-amazon-secondary_hover py-2 rounded-md shadow-sm text-sm font-medium text-white ${
          role === "SHOP_OWNER" ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Buy Now
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600">
        <p className="mb-1">Secure transaction</p>
        <p className="mb-1">Ships from {product.shop.shopName}</p>
        <p>Sold by {product.shop.shopName}</p>
      </div>
    </div>
  );
}
