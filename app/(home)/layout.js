
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "GadgetsBD",
  description: "An e-commerce platform for gadgets",
};

export default function HomeLayout({ children, auth }) {
  return (
    
      <div className="bg-amazon-background text-amazon-text flex flex-col min-h-screen"

      >
        <SessionProvider>
        <Navbar />
        {auth}
        {children}
        <Footer />
        </SessionProvider>
      </div>
    
  );
}
