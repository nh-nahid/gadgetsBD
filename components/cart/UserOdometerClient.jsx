"use client";

import { useSession } from "next-auth/react";
import CartOdometer from "@/components/cart/CartOdometer";

export default function UserOdometerClient() {
  const { data: session, status } = useSession();

  // While loading session
  if (status === "loading") return null;

  // Show odometer ONLY for normal users
  if (!session || session.user?.role !== "USER") return null;

  return <CartOdometer />;
}
