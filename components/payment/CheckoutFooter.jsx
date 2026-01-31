// components/Footer.jsx
import React from "react";

export default function CheckoutFooter() {
  return (
    <footer className="bg-amazon-background py-10 border-t border-gray-300">
      <div className="checkout-container text-center text-[10px] text-gray-500 space-y-2">
        <div className="flex justify-center gap-6 text-amazon-blue text-xs mb-2">
          <a href="#" className="hover:underline">Conditions of Use</a>
          <a href="#" className="hover:underline">Privacy Notice</a>
          <a href="#" className="hover:underline">Help</a>
        </div>
        <p>&copy; 2025 Gadgets BD - Premium Tech Marketplace. All rights reserved by LWS.</p>
      </div>
    </footer>
  );
}
