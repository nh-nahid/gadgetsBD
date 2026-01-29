import { NextResponse } from "next/server";
import { userModel } from "@/models/user-model";
import { dbConnect } from "@/services/mongo";

await dbConnect();

export const POST = async (req) => {
  try {
    const { email, token, password } = await req.json();
    if (!email || !token || !password) 
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });

    const user = await userModel.findOne({ email, resetToken: token });
    if (!user) return NextResponse.json({ error: "Invalid token or email" }, { status: 400 });

    if (Date.now() > user.resetTokenExpire) 
      return NextResponse.json({ error: "Token expired" }, { status: 400 });

    user.password = password; // plain password, pre-save will hash
    user.isOAuth = false; // mark as non-OAuth
    user.resetToken = null;
    user.resetTokenExpire = null;

    await user.save();

    return NextResponse.json({ message: "Password successfully reset" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
};
