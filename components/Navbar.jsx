"use client";

import { useSession } from "next-auth/react";
import { ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import Logout from "./auth/Logout";
import SearchFilter from "./search/SearchFilter";
import Image from "next/image";

const Navbar = () => {
  const { data: session, status, update } = useSession();

  // Listen for auth changes
  useEffect(() => {
    const handler = () => update();
    window.addEventListener("auth-changed", handler);
    return () => window.removeEventListener("auth-changed", handler);
  }, [update]);

  if (status === "loading") return null;

  // Render menu based on login and role
  const renderMenu = () => {
    if (!session?.user) {
      return (
        <Link href="/login" className="hover:outline hover:outline-1 hover:outline-white rounded-sm p-1 cursor-pointer" > <div className="text-xs leading-none text-gray-300"> Hello, Sign in </div> <div className="font-bold text-sm">Account & Lists</div> </Link>
      );
    }

    const role = session.user.role || "USER";

    if (role === "SHOP_OWNER") {
      return (
        <>
          <Link href="/" className="px-3 py-2 hover:underline">
            Home
          </Link>
          <Link href="/add-product" className="px-3 py-2 hover:underline">
            Add Product
          </Link>
          <Link href="/manage-products" className="px-3 py-2 hover:underline">
            Manage Products
          </Link>
          <Logout />
        </>
      );
    } else {
      return (
        <>
          <Link href="/" className="px-3 py-2 hover:underline">
            Home
          </Link>
          <Link href="/products" className="px-3 py-2 hover:underline">
            Products
          </Link>
          <Link href="/shops" className="px-3 py-2 hover:underline">
            Shops
          </Link>
          <Link href="/orders" className="px-3 py-2 hover:underline">
            My Orders
          </Link>
          <Logout />
        </>
      );
    }
  };

  return (
    <nav className="bg-amazon text-white">
      <div className="max-w-[1500px] mx-auto flex items-center p-2 gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center hover:outline hover:outline-1 hover:outline-white rounded-sm p-1"
        >
          <span className="text-2xl font-bold tracking-tighter">
            gadgets
            <span className="italic text-amazon-secondary">BD</span>
          </span>
        </Link>

        {/* Search bar */}
        <div className="flex-1 mx-4">
          <SearchFilter />
        </div>

        <div className="flex items-center gap-4">
          {/* Language */}
          <div className="hidden md:flex items-center hover:outline hover:outline-1 hover:outline-white rounded-sm p-1 cursor-pointer">
            <div className="font-bold text-sm">EN</div>
          </div>

          {/* Dynamic Menu */}
          <div className="flex items-center gap-4">{renderMenu()}</div>

          {/* User Avatar */}


          {session?.user && (
            <div className="flex items-center gap-2">
              {session.user.image ? (
                <Image
                  height={8}
                  width={8}
                  src={session.user.image}
                  alt={session.user.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="hidden md:block font-medium">{session.user.name}</span>
            </div>
          )}


          {/* Cart */}
          <Link
            href="/cart"
            className="flex items-end hover:outline hover:outline-1 hover:outline-white rounded-sm p-1 cursor-pointer relative"
          >
            <ShoppingCart className="w-8 h-8" />
            <span className="font-bold text-amazon-secondary absolute top-0 left-1/2 -translate-x-1/2 text-sm">
              3
            </span>
            <span className="font-bold text-sm hidden md:block">Cart</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
