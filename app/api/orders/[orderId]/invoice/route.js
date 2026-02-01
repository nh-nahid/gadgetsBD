// app/api/orders/[orderId]/invoice/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "@/services/mongo";
import orderModel from "@/models/order-model";
import { generateInvoicePDF } from "@/lib/invoice";


export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { orderId } = params;
    console.log("Invoice API called with params:", { orderId });

    // Fetch the order
    const order = await orderModel.findOne({ orderNumber: orderId }).lean();
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }
    console.log("Order found:", order.orderNumber);

    // Generate PDF using the reusable function
    const pdfBuffer = await generateInvoicePDF(order);

    // Return the PDF as a downloadable file
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
