
import SecondaryFooter from "@/components/SecondaryFooter";
import "../globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "gadgetsBD",
  description: "An e-commerce platform for gadgets",
};

export default function LoginLayout({ children, auth }) {
  return (
    
      <div className="bg-amazon-background text-amazon-text flex flex-col min-h-screen"

      >
        <SessionProvider>
        
        {auth}
        {children}
        <SecondaryFooter />
        </SessionProvider>
      </div>
    
  );
}
