

import { userModel } from "@/models/user-model";
import { dbConnect } from "@/services/mongo";
import { NextResponse } from "next/server";

export const PUT = async (request, { params }) => {
  const { email } = params;
  const updatedAddress = await request.json();

  if (!email || !updatedAddress) {
    return new NextResponse("Missing email or address", { status: 400 });
  }

  await dbConnect();

  const user = await userModel.findOne({ email });
  if (!user) return new NextResponse("User not found", { status: 404 });

  // Update the default address (or replace first address)
  user.addresses[0] = updatedAddress;

  await user.save();
  return NextResponse.json(user.addresses[0], { status: 200 });
};
