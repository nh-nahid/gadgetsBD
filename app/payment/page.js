import PaymentClient from "@/components/payment/PaymentClient";
import { Suspense } from "react";


export const dynamic = "force-dynamic";

export default function PaymentPage() {
  return (
    <Suspense fallback={<p className="text-center py-10">Loading checkout...</p>}>
      <PaymentClient />
    </Suspense>
  );
}
