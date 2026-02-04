import { NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert the file to buffer for ImageKit
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: "/shop-banners",
    });

    return NextResponse.json({ url: uploadResult.url });
  } catch (err) {
    console.error("Banner upload error:", err);
    return NextResponse.json({ error: "Failed to upload banner" }, { status: 500 });
  }
}
