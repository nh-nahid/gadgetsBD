"use client";

import { useSession } from "next-auth/react";
import { ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import Logout from "./auth/Logout";
import SearchFilter from "./search/SearchFilter";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useShop } from "@/app/context/ShopContext"; // ✅ Import ShopContext

export default function Navbar() {
  const { data: session, status } = useSession();
  const [animate, setAnimate] = useState(false);
  const prevCount = useRef(0);
  const { cartCount, setCartCount, refreshCartCount } = useCart();
  const { shop } = useShop(); // ✅ Get shop from context

  const userId = session?.user?.id;
  const role = session?.user?.role || "USER";

  // Fetch cart count for normal users
  useEffect(() => {
    if (!userId || role === "SHOP_OWNER") return;

    async function fetchCart() {
      try {
        const res = await fetch(`/api/cart/${userId}`);
        const carts = await res.json();
        const cart = carts?.[0];
        const count =
          cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

        if (count !== prevCount.current) {
          setAnimate(true);
          prevCount.current = count;
          setTimeout(() => setAnimate(false), 300);
        }

        setCartCount(count);
      } catch (err) {
        console.error("Failed to fetch cart", err);
      }
    }

    fetchCart();
  }, [userId, role, setCartCount]);

  useEffect(() => {
    if (role !== "SHOP_OWNER") refreshCartCount(userId);
  }, [userId, role, refreshCartCount]);

  if (status === "loading") return null;

  const renderMenu = () => {
    if (!session?.user) {
      return (
        <Link
          href="/login"
          className="hover:outline hover:outline-1 hover:outline-white rounded-sm p-1 cursor-pointer"
        >
          <div className="text-xs leading-none text-gray-300">Hello, Sign in</div>
          <div className="font-bold text-sm">Account & Lists</div>
        </Link>
      );
    }

    if (role === "SHOP_OWNER") {
      return (
        <>
          <Link href="/" className="px-3 py-2 hover:underline">Home</Link>
          <Link href="/add-product" className="px-3 py-2 hover:underline">Add Product</Link>
          <Link href="/manage-products" className="px-3 py-2 hover:underline">Manage Products</Link>
          <Logout />
        </>
      );
    }

    return (
      <>
        <Link href="/" className="px-3 py-2 hover:underline">Home</Link>
        <Link href="/products" className="px-2 py-2 hover:underline">Products</Link>
        <Link href="/shops" className="px-2 py-2 hover:underline">Shops</Link>
        <Link href="/orders" className="px-2 py-2 hover:underline">My Orders</Link>
        <Logout />
      </>
    );
  };

  return (
    <nav className="bg-amazon text-white fixed top-0 left-0 w-full z-50 shadow-md">
      <div className="max-w-[1500px] mx-auto flex items-center p-2 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center hover:outline hover:outline-1 hover:outline-white rounded-sm p-1">
          <span className="text-2xl font-bold tracking-tighter">
            gadgets
            <span className="italic text-amazon-secondary">BD</span>
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 mx-4">
          <SearchFilter />
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center hover:outline hover:outline-1 hover:outline-white rounded-sm p-1 cursor-pointer">
            <div className="font-bold text-sm">EN</div>
          </div>

          <div className="flex items-center gap-4">{renderMenu()}</div>

          {/* User / Shop Owner */}
          {session?.user && (
            <Link
              href={role === "SHOP_OWNER" ? "/profile" : "#"}
              className="flex items-center gap-2 cursor-pointer"
            >
              {/* Image */}
              {role === "SHOP_OWNER" ? (
                shop?.coverImage ? (
                  <Image
                    height={32}
                    width={32}
                    src={shop.coverImage}
                    alt={shop.name || "Shop Owner"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )
              ) : (
                session.user.image ? (
                  <Image
                    height={32}
                    width={32}
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )
              )}

              {/* Name */}
              <span className="hidden md:block font-medium">
                {role === "SHOP_OWNER"
                  ? shop?.name || session.user.name || "Shop Owner"
                  : session.user.name || "User"}
              </span>
            </Link>
          )}

          {/* Cart (only for normal users) */}
          {role !== "SHOP_OWNER" && (
            <Link
              href="/cart"
              className="relative flex items-end hover:outline hover:outline-1 hover:outline-white rounded-sm p-1 cursor-pointer"
            >
              <ShoppingCart className="w-8 h-8" />

              {cartCount > 0 && (
                <span
                  className={`absolute -top-1 left-1/2 -translate-x-1/2 rounded-full px-1.5 text-xs font-bold text-black bg-amazon-secondary transition-transform ${
                    animate ? "scale-125" : ""
                  }`}
                >
                  {cartCount}
                </span>
              )}

              <span className="font-bold text-sm hidden md:block ml-1">
                Cart
              </span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
