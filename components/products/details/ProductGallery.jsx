"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ mainImage, thumbnails }) {
  const [currentImage, setCurrentImage] = useState(mainImage);

  return (
    <div className="lg:col-span-5 flex gap-4">
      
      <div className="flex flex-col gap-2">
        {thumbnails.map((img, idx) => (
          <button
            key={idx}
            type="button"
            className={`relative w-10 h-10 border rounded overflow-hidden hover:shadow-md ${
              img === currentImage
                ? "border-amazon-blue"
                : "border-gray-300"
            }`}
            onClick={() => setCurrentImage(img)}
          >
            <Image
              src={img || "/placeholder.png"}
              alt={`Thumbnail ${idx + 1}`}
              fill
              sizes="40px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <div className="relative flex-1 border border-gray-200 rounded p-4 bg-gray-50 min-h-[400px]">
        <Image
          src={currentImage || "/placeholder.png"}
          alt="Product image"
          fill
          sizes="(min-width: 1024px) 500px, 100vw"
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
