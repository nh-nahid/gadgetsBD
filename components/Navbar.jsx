"use client"; // client component

import { useSession } from "next-auth/react";
import { Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";
import Logout from "./auth/Logout";
import SearchFilter from "./search/SearchFilter";

const Navbar = () => {

const { data: session } = useSession();
console.log(session?.user);          // user info
console.log(session?.accessToken);   // access token
console.log(session?.refreshToken);  // refresh token



  return (
    <nav className="bg-amazon text-white">
      {/* Top Nav */}
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

        <SearchFilter />

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Language */}
          <div className="hidden md:flex items-center hover:outline hover:outline-1 hover:outline-white rounded-sm p-1 cursor-pointer">
            <div className="font-bold text-sm">EN</div>
          </div>

          {/* Account */}
          {session?.user ? (
            <div>
              <span className="mx-1">{session.user.name}</span>
              <span> | </span>
              <Logout />
            </div>
          ) : (
            <Link
              href="/login"
              className="hover:outline hover:outline-1 hover:outline-white rounded-sm p-1 cursor-pointer"
            >
              <div className="text-xs leading-none text-gray-300">Hello, Sign in</div>
              <div className="font-bold text-sm">Account & Lists</div>
            </Link>
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
