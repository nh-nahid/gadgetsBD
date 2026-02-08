import { getAllProducts } from "@/database/queries";
import { dbConnect } from "@/services/mongo";


export async function GET(req) {
  try {
    await dbConnect(); 
    const products = await getAllProducts();

    return new Response(JSON.stringify({ success: true, products }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
