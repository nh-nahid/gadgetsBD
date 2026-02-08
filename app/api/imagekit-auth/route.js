import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export async function GET() {
  try {
    const auth = imagekit.getAuthenticationParameters();
    return NextResponse.json(auth);
  } catch (err) {
    console.error("ImageKit auth failed:", err);
    return NextResponse.json({ error: "Failed to generate auth" }, { status: 500 });
  }
}
