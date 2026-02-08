import { NextResponse } from "next/server";
import { dbConnect } from "@/services/mongo";
import orderModel from "@/models/order-model";
import { generateInvoicePDF } from "@/lib/invoice";


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


    const pdfBuffer = await generateInvoicePDF(order);


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
