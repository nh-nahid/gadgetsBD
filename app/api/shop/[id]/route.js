import { getShopById } from "@/database/queries";

export async function GET(req, { params }) {
  try {
    const shopId = params.id;


    const shop = await getShopById(shopId);

    if (!shop) {
      return new Response(JSON.stringify({ shop: null }), { status: 200 });
    }

    return new Response(JSON.stringify({ shop }), { status: 200 });
  } catch (err) {
    console.error("Failed to fetch shop:", err);
    return new Response(JSON.stringify({ shop: null, error: err.message }), { status: 500 });
  }
}
