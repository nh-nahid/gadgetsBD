import SecondaryFooter from "@/components/SecondaryFooter";
import CheckoutHeader from "@/components/payment/CheckoutHeader";
import "../globals.css";


export const metadata = {
  title: "Payment",
  description: "Proceed your payment",
};

export default function CheckoutLayout({ children }) {
  return (

    <html lang="en">
      <body className="bg-amazon-background text-amazon-text flex flex-col min-h-screen">
      <CheckoutHeader/>
      <main className="checkout-container flex-1 py-10 px-4 flex flex-col lg:flex-row gap-8">{children}</main>
      <SecondaryFooter/>
    </body>
    </html>

    
  );
}
