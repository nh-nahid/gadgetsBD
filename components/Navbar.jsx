"use client";

import { useSession } from "next-auth/react";
import { ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import Logout from "./auth/Logout";
import SearchFilter from "./search/SearchFilter";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useShop } from "@/app/context/ShopContext";

const menuLinkClass =
  "px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:text-white hover:bg-white/10 transition-colors";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [animate, setAnimate] = useState(false);
  const prevCount = useRef(0);
  const { cartCount, setCartCount, refreshCartCount } = useCart();
  const { shop } = useShop();

  const userId = session?.user?.id;
  const role = session?.user?.role || "USER";

  // Fetch cart count
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

  // Refresh cart count when needed
  useEffect(() => {
    if (role !== "SHOP_OWNER") refreshCartCount(userId);
  }, [userId, role, refreshCartCount]);

  if (status === "loading") return null;

  const renderMenu = () => {
    if (!session?.user) {
      return (
        <Link
          href="/login"
          className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
        >
          <div className="text-xs text-gray-300">Hello, Sign in</div>
          <div className="font-semibold text-sm text-white">
            Account & Lists
          </div>
        </Link>
      );
    }

    if (role === "SHOP_OWNER") {
      return (
        <>
          <Link href="/" className={menuLinkClass}>Home</Link>
          <Link href="/orders" className={menuLinkClass}>Orders</Link>
          <Link href="/add-product" className={menuLinkClass}>Add Product</Link>
          <Link href="/manage-products" className={menuLinkClass}>Manage Products</Link>
          <Logout />
        </>
      );
    }

    return (
      <>
        <Link href="/" className={menuLinkClass}>Home</Link>
        <Link href="/products" className={menuLinkClass}>Products</Link>
        <Link href="/shops" className={menuLinkClass}>Shops</Link>
        <Link href="/orders" className={menuLinkClass}>My Orders</Link>
        <Logout />
      </>
    );
  };

  return (
    <nav className="bg-amazon text-white fixed top-0 left-0 w-full z-50 shadow-lg">
      <div className="max-w-[1500px] mx-auto flex items-center gap-4 px-4 py-2">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
        >
          <span className="text-2xl font-bold tracking-tight">
            gadgets
            <span className="italic text-amazon-secondary">BD</span>
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 hidden md:block">
          <SearchFilter />
        </div>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-1">
          {renderMenu()}
        </div>

        {/* User / Shop Owner */}
        {session?.user && (
          <Link
            href={role === "SHOP_OWNER" ? "/profile" : "#"}
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
          >
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
                  <User className="w-5 h-5" />
                </div>
              )
            ) : session.user.image ? (
              <Image
                height={32}
                width={32}
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
            )}

            <span className="hidden md:block text-sm font-medium text-gray-200">
              {role === "SHOP_OWNER"
                ? shop?.name || session.user.name
                : session.user.name}
            </span>
          </Link>
        )}

        {/* Cart */}
        {role !== "SHOP_OWNER" && (
          <Link
            href="/cart"
            className="relative flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
          >
            <ShoppingCart className="w-7 h-7" />
            {cartCount > 0 && (
              <span
                className={`absolute -top-1 -right-1 bg-amazon-secondary text-black text-xs font-bold rounded-full px-1.5 ${
                  animate ? "scale-125" : ""
                } transition-transform`}
              >
                {cartCount}
              </span>
            )}
            <span className="hidden md:block text-sm font-semibold">
              Cart
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
