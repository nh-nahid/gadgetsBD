"use client";

import { Upload, Plus } from "lucide-react";
import { useState } from "react";
import { uploadProductImage } from "@/lib/uploadProductImage";

export default function ProductImages({ images = [], onImagesChange }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);

    const uploaded = [];
    for (const file of files) {
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        alert(`Invalid format: ${file.name}`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`File too large (max 5MB): ${file.name}`);
        continue;
      }

      try {
        const url = await uploadProductImage(file);
        uploaded.push({ url, isMain: images.length + uploaded.length === 0 });
      } catch (err) {
        console.error("Upload failed", err);
        alert("Image upload failed: " + err.message);
      }
    }

    if (uploaded.length) {
      onImagesChange([...images, ...uploaded]);
    }

    setUploading(false);
    e.target.value = ""; // Reset input
  };

  const setMainImage = (index) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isMain: i === index,
    }));
    onImagesChange(newImages);
  };

  return (
    <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
        <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
          Step 3: Product Images
        </h2>
      </div>

      <div className="p-6 space-y-4">
        <div
          className={`border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:border-amazon-blue cursor-pointer ${
            uploading ? "opacity-60 pointer-events-none" : ""
          }`}
          onClick={() => document.getElementById("product-images").click()}
        >
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
          <input
            id="product-images"
            type="file"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.length
            ? images.map((img, i) => (
                <div
                  key={i}
                  className={`border border-gray-300 rounded-md aspect-square flex items-center justify-center overflow-hidden relative cursor-pointer ${
                    img.isMain ? "ring-2 ring-amazon-blue" : ""
                  }`}
                  onClick={() => setMainImage(i)}
                >
                  <img
                    src={img.url}
                    alt="Product"
                    className="object-cover w-full h-full"
                  />
                  {img.isMain && (
                    <span className="absolute top-1 right-1 bg-amazon-yellow px-1 text-xs font-bold text-black rounded-sm">
                      Main
                    </span>
                  )}
                </div>
              ))
            : Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="border-2 border-dashed border-gray-300 rounded-md aspect-square flex items-center justify-center hover:border-amazon-blue cursor-pointer"
                >
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
