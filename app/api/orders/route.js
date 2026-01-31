import { NextResponse } from "next/server";
import { dbConnect } from "@/services/mongo";
import orderModel from "@/models/order-model";
import { sendInvoiceEmail } from "@/lib/sendInvoiceEmail";

/**
 * GET /api/orders/[orderId]
 * Fetch a single order by ID
 */
export async function GET(req, { params }) {
  try {
    await dbConnect();

    const order = await orderModel.findById(params.orderId).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Shape response for Success Page UI
    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        placedAt: order.createdAt,
        shipping: {
          name: order.shippingAddress.name,
          address: `${order.shippingAddress.addressLine}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`,
        },
        items: order.items.map(item => ({
          productId: item.productId,
          title: item.title,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
          seller: item.seller || "Unknown",
        })),
        summary: order.summary,
        payment: order.payment || {},
      },
    });
  } catch (error) {
    console.error("Order GET API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders
 * Create a new order and optionally send invoice email
 */
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // Validation
    if (!body.userId || !body.items?.length || !body.shippingAddress) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate unique order number
    const orderNumber = `GB-${Date.now()}`;

    // Create order document
    const order = await orderModel.create({
      userId: body.userId,
      items: body.items.map(item => ({
        productId: item.productId,
        title: item.title,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        seller: item.seller || "Unknown",
      })),
      shippingAddress: body.shippingAddress,
      summary: body.summary,
      payment: {
        method: body.payment?.method || "Card",
        status: body.payment?.status || "paid",
        transactionId: body.payment?.transactionId || null,
      },
      orderNumber,
    });

    // Send invoice email (if email provided)
    if (body.userEmail) {
      await sendInvoiceEmail({ ...order.toObject(), userEmail: body.userEmail });
    }

    return NextResponse.json(
      { success: true, orderId: order._id, orderNumber },
      { status: 201 }
    );
  } catch (err) {
    console.error("Order POST API error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to create order" },
      { status: 500 }
    );
  }
}
