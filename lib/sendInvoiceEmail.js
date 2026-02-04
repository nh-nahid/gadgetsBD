// lib/sendInvoiceEmail.js
import nodemailer from "nodemailer";

export const sendInvoiceEmail = async ({ to, subject, text, attachments }) => {
  if (!to) throw new Error("Recipient email is required");

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true", // convert string to boolean
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS, // Gmail App Password required
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Gadgets BD" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      text,
      attachments: attachments?.map(att => ({
        ...att,
        contentType: att.contentType || "application/pdf",
      })),
    });

    console.log("✅ Invoice email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Failed to send invoice email:", err);
    throw err; // rethrow so caller knows
  }
};
