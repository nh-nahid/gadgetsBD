import { getFullCartByUser } from "@/database/queries";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const carts = await getFullCartByUser(userId);
    return NextResponse.json(carts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
} 
