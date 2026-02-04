import { getShopById } from "@/database/queries";


export async function GET(req, { params }) {
  try {
    const shopId = params.id;

    // Use your existing query function
    const shop = await getShopById(shopId);

    if (!shop) {
      return new Response(JSON.stringify({ error: "Shop not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(shop), { status: 200 });
  } catch (err) {
    console.error("Failed to fetch shop:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
