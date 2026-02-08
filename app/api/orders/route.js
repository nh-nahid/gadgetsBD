// app/api/orders/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "@/services/mongo";
import orderModel from "@/models/order-model";
import { sendInvoiceEmail } from "@/lib/sendInvoiceEmail";
import { generateInvoicePDF } from "@/lib/invoice";
import { productModel } from "@/models/product-model";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { userId, userEmail, items, shippingAddress, summary, payment } = body;

    // ---------------- Basic validations ----------------
    if (!userId || !items?.length || !shippingAddress) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!userEmail || !/^\S+@\S+\.\S+$/.test(userEmail)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address" },
        { status: 400 }
      );
    }

    // ---------------- Build order items ----------------
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await productModel.findById(item.productId).lean();
        if (!product) throw new Error(`Product not found: ${item.productId}`);
        if (!item.quantity || item.quantity <= 0) throw new Error("Invalid quantity");

        return {
          productId: item.productId,
          title: product.title,
          image: product.images[0]?.url || "",
          price: Number(product.price),
          quantity: Number(item.quantity),
          seller: product.shop.shopName || "Unknown",
          shopOwnerId: product.shop?.shopOwnerId || null,
        };
      })
    );

    const orderNumber = `GB-${Date.now()}`;

    // ---------------- Create order ----------------
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

    // ---------------- Fire-and-forget: generate PDF & send email ----------------
    sendInvoiceEmail({
      to: userEmail,
      subject: `Invoice for your Order ${orderNumber}`,
      text: `Thank you for your order! Please find your invoice attached.`,
      attachments: [
        {
          filename: `invoice-${orderNumber}.pdf`,
          content: await generateInvoicePDF(order.toObject()),
          contentType: "application/pdf",
        },
      ],
    })
      .then(() => console.log(`✅ Invoice email sent to ${userEmail}`))
      .catch((err) => console.error("❌ Invoice/email failed:", err));

    // ---------------- Return response ----------------
    return NextResponse.json(
      { success: true, orderId: order._id, orderNumber },
      { status: 201 }
    );

  } catch (err) {
    console.error("Order POST API error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
