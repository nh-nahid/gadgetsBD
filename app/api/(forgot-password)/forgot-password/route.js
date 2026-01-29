import { NextResponse } from "next/server";
import { userModel } from "@/models/user-model";
import { dbConnect } from "@/services/mongo";
import crypto from "crypto";
import { sendEmail } from "@/utils/email";

await dbConnect();

export const POST = async (req) => {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const user = await userModel.findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = Date.now() + 1000 * 60 * 15; // 15 mins

    user.resetToken = resetToken;
    user.resetTokenExpire = resetTokenExpire;
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}&email=${email}`;

    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="color: #007185;">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    return NextResponse.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
