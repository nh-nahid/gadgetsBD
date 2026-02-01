import PDFDocument from "pdfkit/js/pdfkit";
import fs from "fs";
import path from "path";

export async function generateInvoicePDF(order) {
  return new Promise((resolve, reject) => {
    try {
      // ------------------ Font ------------------
      const fontPath = path.join(process.cwd(), "app/fonts/Roboto-Regular.ttf");
      if (!fs.existsSync(fontPath)) {
        throw new Error("Font not found: " + fontPath);
      }

      const doc = new PDFDocument({ size: "A4", margin: 50, font: fontPath });

      const chunks = [];
      doc.on("data", (c) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      doc.font(fontPath);

      // ------------------ Company Info ------------------
      doc.fontSize(20).text("GadgetsBD", { align: "center" });
      doc.fontSize(10).text("123, Main Street, Dhaka, Bangladesh", { align: "center" });
      doc.text("Email: info@gadgetsbd.com | Phone: +880123456789", { align: "center" });
      doc.moveDown(2);

      // ------------------ Order & Customer Info ------------------
      doc.fontSize(12).text(`Invoice Number: ${order.orderNumber}`, { align: "left" });
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, { align: "left" });
      doc.text(`Payment Method: ${order.payment?.method || "N/A"}`, { align: "left" });
      doc.moveDown(1);

      doc.text(`Customer Name: ${order.shippingAddress.name}`, { align: "left" });
      doc.text(`Phone: ${order.shippingAddress.phone}`, { align: "left" });
      doc.text(
        `Address: ${order.shippingAddress.street || ""}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`,
        { align: "left" }
      );
      doc.moveDown(1.5);

      // ------------------ Items by Seller ------------------
      const sellers = {};
      order.items.forEach((item) => {
        const seller = item.seller || "Unknown Seller";
        if (!sellers[seller]) sellers[seller] = [];
        sellers[seller].push(item);
      });

      Object.keys(sellers).forEach((sellerName) => {
        // Seller header
        doc.fontSize(14).text(`Seller: ${sellerName}`, { underline: true, align: "left" });
        doc.moveDown(0.5);

        // Table headers
        const startY = doc.y;
        const itemX = 50;
        const qtyX = 300;
        const priceX = 350;
        const totalX = 450;

        doc.fontSize(12).text("Item", itemX, startY, { align: "left" });
        doc.text("Qty", qtyX, startY, { align: "left" });
        doc.text("Price", priceX, startY, { align: "left" });
        doc.text("Total", totalX, startY, { align: "left" });

        let y = startY + 20;

        sellers[sellerName].forEach((item) => {
          const total = item.quantity * item.price;
          doc.text(item.title, itemX, y, { align: "left" });
          doc.text(item.quantity, qtyX, y, { align: "left" });
          doc.text(`${item.price} BDT`, priceX, y, { align: "left" });
          doc.text(`${total} BDT`, totalX, y, { align: "left" });
          y += 20;
        });

        // Seller subtotal
        const sellerTotal = sellers[sellerName].reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        );

        doc.moveDown(0.5);
        doc.text(`Seller Subtotal: ${sellerTotal} BDT`, { align: "right" });
        doc.moveDown(1);
      });

      // ------------------ Order Summary ------------------
      doc.moveDown(1);
      doc.fontSize(14).text("Order Summary", { underline: true, align: "left" });
      doc.moveDown(0.5);

      doc.fontSize(12).text(`Subtotal: ${order.summary.subtotal} BDT`, { align: "left" });
      doc.text(`Delivery Fee: ${order.summary.deliveryFee} BDT`, { align: "left" });
      doc.text(`Service Fee: ${order.summary.serviceFee} BDT`, { align: "left" });
      doc.text(`Total: ${order.summary.total} BDT`, { align: "left" });

      // ------------------ Thank You Message ------------------
      doc.moveDown(2);
      doc.fontSize(10).text(
        "Thank you for your purchase! If you have any questions, contact us at info@gadgetsbd.com",
        { align: "center" }
      );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
