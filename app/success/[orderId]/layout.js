
import SecondaryFooter from "@/components/SecondaryFooter";
import "../../globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "Success",
  description: "An e-commerce platform for gadgets",
};

export default function SuccessLayout({ children, auth }) {
  return (
    
      
        <SessionProvider>
        
        {auth}
        {children}
        <SecondaryFooter />
        
        </SessionProvider>
      
    
  );
}
