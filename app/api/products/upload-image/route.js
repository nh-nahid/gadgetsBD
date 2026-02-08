import ImageKit from "imagekit";
import { NextResponse } from "next/server";

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
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const upload = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: "/products",
    });

    return NextResponse.json({ url: upload.url });
  } catch (err) {
    console.error("Product image upload failed:", err);
    return NextResponse.json({ error: err.message || "Image upload failed" }, { status: 500 });
  }
}
