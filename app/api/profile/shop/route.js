import { auth } from "@/auth";
import { getShopByOwnerId } from "@/database/queries";
import { dbConnect } from "@/services/mongo";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    await dbConnect();

    const shop = await getShopByOwnerId(session.user.id);
    return new Response(JSON.stringify({ shop: shop ?? null }), { status: 200 });
  } catch (err) {
    console.error("Failed to fetch shop:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
