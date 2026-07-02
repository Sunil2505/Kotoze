"use client";

import { useState } from "react";
import Image from "next/image";

const images = [
  "/images/products/headphones.jpg",
  "/images/products/headphones.jpg",
  "/images/products/headphones.jpg",
  "/images/products/headphones.jpg",
];

export default function ProductGallery() {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="space-y-5">
      {/* Main Image */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <Image
          src={selectedImage}
          alt="Product Image"
          width={600}
          height={600}
          className="mx-auto h-[450px] w-full object-contain"
          priority
        />
      </div>

      {/* Thumbnail Images */}
      <div className="flex gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={`overflow-hidden rounded-xl border-2 transition ${
              selectedImage === image
                ? "border-orange-500"
                : "border-gray-200 hover:border-orange-300"
            }`}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              width={90}
              height={90}
              className="h-20 w-20 object-contain bg-white p-2"
            />
          </button>
        ))}
      </div>
    </div>
  );
}