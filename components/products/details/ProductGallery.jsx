"use client"

import { useState } from "react";

export default function ProductGallery({ mainImage, thumbnails }) {
  const [currentImage, setCurrentImage] = useState(mainImage);

  return (
    <div className="lg:col-span-5 flex gap-4">
      {/* Thumbnails */}
      <div className="flex flex-col gap-2">
        {thumbnails.map((img, idx) => (
          <button
            key={idx}
            className={`w-10 h-10 border rounded overflow-hidden hover:shadow-md ${
              img === currentImage ? "border-amazon-blue" : "border-gray-300"
            }`}
            onClick={() => setCurrentImage(img)} // <-- update main image on click
          >
            <img src={img} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 border border-gray-200 rounded p-4 bg-gray-50">
        <img src={currentImage} className="w-full h-auto object-cover" />
      </div>
    </div>
  );
}
