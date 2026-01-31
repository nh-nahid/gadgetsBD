import { Lock } from "lucide-react";
import Link from "next/link";


export default function CheckoutHeader() {
  return (
    <header className="bg-amazon p-4 border-b border-gray-300">
      <div
        className="checkout-container flex justify-between items-center text-white"
      >
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold tracking-tighter"
          >gadgets<span className="italic text-amazon-secondary"
          >BD</span></span>
        </Link>
        <h1 className="text-2xl font-normal hidden md:block">
          Checkout (<span className="text-amazon-secondary">3 items</span>)
        </h1>
        <Lock className="w-5 h-5 text-gray-400"/>
        
      </div>
    </header>
  );
}
