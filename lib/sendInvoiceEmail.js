import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import { Readable } from "stream";

/**
 * Generate a PDF buffer from an order object
 */
function generateInvoiceBuffer(order) {
  const doc = new PDFDocument({ margin: 50 });
  const buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  // Header
  doc.fontSize(20).text("Invoice", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Order Number: ${order.orderNumber}`);
  doc.text(`Date: ${new Date(order.placedAt).toLocaleDateString()}`);
  doc.moveDown();

  // Shipping Info
  doc.fontSize(14).text("Shipping Address:", { underline: true });
  doc.fontSize(12).text(order.shipping.name);
  doc.text(order.shipping.address);
  doc.moveDown();

  // Order Items
  doc.fontSize(14).text("Ordered Items:", { underline: true });
  order.items.forEach((item, index) => {
    doc
      .fontSize(12)
      .text(
        `${index + 1}. ${item.title} | Qty: ${item.quantity} | Price: ৳${item.price}`
      );
  });

  doc.moveDown();

  // Summary
  doc.fontSize(14).text("Summary:", { underline: true });
  doc.fontSize(12).text(`Subtotal: ৳${order.summary.subtotal}`);
  doc.text(`Delivery Fee: ৳${order.summary.deliveryFee}`);
  doc.text(`Service Fee: ৳${order.summary.serviceFee}`);
  doc.fontSize(14).text(`Total: ৳${order.summary.total}`, { bold: true });

  doc.end();

  return new Promise((resolve, reject) => {
    const stream = doc.pipe(new WritableBuffer());
    const chunks = [];

    doc.on("data", chunk => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
}

// Helper class for PDFKit stream
class WritableBuffer extends require("stream").Writable {
  constructor(options) {
    super(options);
    this.data = [];
  }
  _write(chunk, encoding, callback) {
    this.data.push(chunk);
    callback();
  }
  getBuffer() {
    return Buffer.concat(this.data);
  }
}

/**
 * Send Invoice Email
 * @param {Object} order - Order object (must include userEmail)
 */
export async function sendInvoiceEmail(order) {
  if (!order.userEmail) {
    console.warn("No userEmail provided. Skipping invoice email.");
    return;
  }

  try {
    const pdfBuffer = await generateInvoiceBuffer(order);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: order.userEmail,
      subject: `Invoice for Order ${order.orderNumber}`,
      text: "Thank you for your order. Please find the invoice attached.",
      attachments: [
        {
          filename: `Invoice-${order.orderNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    console.log(`Invoice email sent to ${order.userEmail}`);
  } catch (err) {
    console.error("Failed to send invoice email:", err);
  }
}
