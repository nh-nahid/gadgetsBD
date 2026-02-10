"use client";

import dynamic from "next/dynamic";
import { ShoppingCart } from "lucide-react"; 
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";

const Odometer = dynamic(() => import("react-odometerjs"), { ssr: false });
import "odometer/themes/odometer-theme-default.css";

export default function CartOdometer() {
  const { cartCount, totalAmount } = useCart();

  return (
    <Link
      href="/cart"
      className="fixed right-2 top-1/2 -translate-y-1/2 z-50 
        bg-[#131921]/80 backdrop-blur-sm shadow-lg 
        p-3 rounded-xl flex flex-col items-center gap-3
        border border-[#FA8900] w-24 hover:scale-105 transition-transform duration-300"
    >
      <ShoppingCart className="w-6 h-6 text-[#FA8900] animate-bounce" />

      <div className="flex flex-col items-center">
        <span className="text-[10px] text-[#FA8900] uppercase tracking-wider font-semibold">
          Items
        </span>
        <Odometer 
          value={cartCount} 
          format="d" 
          duration={400} 
          className="text-[#FA8900] font-semibold text-sm font-mono drop-shadow-sm"
        />
      </div>

      <div className="flex flex-col items-center">
        <span className="text-[10px] text-[#FA8900] uppercase tracking-wider font-semibold">
          Total
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[12px] text-[#FA8900] font-semibold font-mono">৳</span>
          <Odometer 
            value={totalAmount} 
            format="d" 
            duration={400} 
            className="text-[#FA8900] font-semibold text-sm font-mono drop-shadow-sm"
          />
        </div>
      </div>
    </Link>
  );
}
