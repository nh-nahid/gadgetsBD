import nodemailer from "nodemailer";

export const sendInvoiceEmail = async ({ to, subject, text, attachments }) => {
  // Replace with your email SMTP info
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Gadgets BD" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    attachments,
  });

  console.log("Email sent:", info.messageId);
};
