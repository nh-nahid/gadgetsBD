import Navbar from "@/components/Navbar";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Footer from "@/components/Footer";
import { CartProvider } from "./context/CartContext";
import { ShopProvider } from "./context/ShopContext";
import UserOdometerClient from "@/components/cart/UserOdometerClient";

export const metadata = {
  title: "GadgetsBD",
  description: "An e-commerce platform for gadgets",
};

export default function RootLayout({ children, auth }) {
  return (
    <html lang="en">
      <body className="bg-amazon-background mt-14 text-amazon-text flex flex-col min-h-screen">
        <SessionProvider>
          <CartProvider>
            <ShopProvider>
              <Navbar />
              {auth}
              {children}
              <UserOdometerClient />
            </ShopProvider>
          </CartProvider>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
