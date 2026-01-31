
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "gadgetsBD",
  description: "An e-commerce platform for gadgets",
};

export default function RootLayout({ children, auth }) {
  return (
    <html lang="en">
      <body className="bg-amazon-background text-amazon-text flex flex-col min-h-screen"

      >
        <SessionProvider>
        
        {auth}
        {children}
        
        </SessionProvider>
      </body>
    </html>
  );
}
