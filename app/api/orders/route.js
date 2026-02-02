// app/api/orders/[orderId]/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "@/services/mongo";
import orderModel from "@/models/order-model";
import { sendInvoiceEmail } from "@/lib/sendInvoiceEmail";
import { generateInvoicePDF } from "@/lib/invoice";
import { productModel } from "@/models/product-model";

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

    const { userId, userEmail, items, shippingAddress, summary, payment } = body;

    if (!userId || !items?.length || !shippingAddress) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ---------------- FETCH PRODUCTS & BUILD ORDER ITEMS ----------------
  const orderItems = await Promise.all(
  items.map(async (item) => {
    const product = await productModel.findById(item.productId).lean();
    if (!product) throw new Error(`Product not found: ${item.productId}`);

    return {
      productId: item.productId,
      title: product.title,
      image: product.images[0]?.url || "",
      price: Number(product.price),
      quantity: Number(item.quantity),
      seller: product.shop.shopName || "Unknown",
      shopOwnerId: product.shop.shopId, // ✅ use shopId, not shopOwnerId
    };
  })
);


    const orderNumber = `GB-${Date.now()}`;

    const order = await orderModel.create({
      userId,
      items: orderItems,
      shippingAddress,
      summary,
      payment: {
        method: payment?.method || "Card",
        status: payment?.status || "paid",
        ...payment,
      },
      orderNumber,
    });

    // ---------------- NON-BLOCKING: Generate invoice & send email ----------------
    (async () => {
      try {
        const pdfBuffer = await generateInvoicePDF(order.toObject());
        if (userEmail) {
          await sendInvoiceEmail({
            to: userEmail,
            subject: `Invoice for your Order ${orderNumber}`,
            text: "Thank you for your order! Please find your invoice attached.",
            attachments: [
              {
                filename: `invoice-${orderNumber}.pdf`,
                content: pdfBuffer,
              },
            ],
          });
        }
      } catch (err) {
        console.error("Invoice/email failed (non-blocking):", err);
      }
    })();

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

