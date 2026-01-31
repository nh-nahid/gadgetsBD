
import SecondaryFooter from "@/components/SecondaryFooter";
import "../../globals.css";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Order Success",
  description: "An e-commerce platform for gadgets",
};

export default function SuccessLayout({ children, auth }) {
  return (
        <SessionProvider>
            <Navbar />
            {auth}
            {children}
            <SecondaryFooter />
        </SessionProvider>
      
    
  );
}
