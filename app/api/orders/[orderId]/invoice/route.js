// app/api/orders/[orderId]/invoice/route.js
import { NextResponse } from "next/server";
import PDFDocument from "pdfkit/js/pdfkit"; // <- use the JS build directly
import fs from "fs";
import path from "path";
import { dbConnect } from "@/services/mongo";
import orderModel from "@/models/order-model";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { orderId } = params;
    console.log("Invoice API called with params:", { orderId });

    const order = await orderModel.findOne({ orderNumber: orderId }).lean();
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }
    console.log("Order found:", order.orderNumber);

    // Use TTF font
    const fontPath = path.join(process.cwd(), "app/fonts/Arial.ttf");
    console.log("Checking font path:", fontPath);
    if (!fs.existsSync(fontPath)) {
      console.log("Font missing!");
      return NextResponse.json(
        { success: false, message: "Font not found" },
        { status: 500 }
      );
    }

    // Create PDF with TTF, disable default fonts
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
      font: fontPath,   // set TTF font here
    });

    const chunks = [];
    doc.font(fontPath);

    doc.fontSize(20).text("Invoice", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Order Number: ${order.orderNumber}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.text(`Customer: ${order.shippingAddress.name}`);
    doc.moveDown();

    doc.text("Items:", { underline: true });
    order.items.forEach((item) => {
      doc.text(`${item.title} - ${item.quantity} x $${item.price}`);
    });
    doc.moveDown();

    doc.text("Summary:", { underline: true });
    doc.text(`Subtotal: $${order.summary.subtotal}`);
    doc.text(`Delivery Fee: $${order.summary.deliveryFee}`);
    doc.text(`Service Fee: $${order.summary.serviceFee}`);
    doc.text(`Total: $${order.summary.total}`);

    doc.end();

    for await (const chunk of doc) {
      chunks.push(chunk);
    }
    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${order.orderNumber}.pdf"`,
      },
    });
  } catch (err) {
    console.error("Invoice generation error caught:", err);
    return NextResponse.json(
      { success: false, message: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}
