'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductImageGalleryProps {
  images: string[];
  title: string;
  inStock: boolean;
  tags: string[];
}

export default function ProductImageGallery({
  images,
  title,
  inStock,
  tags,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square bg-[#f8f9fa] rounded-lg overflow-hidden flex items-center justify-center">
        <p className="text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
          No image available
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Main Image */}
      <div className="relative aspect-square bg-[#f8f9fa] rounded-lg overflow-hidden mb-4">
        <Image
          src={images[selectedImage]}
          alt={title}
          fill
          className="object-cover"
        />
        {!inStock && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
            Out of Stock
          </div>
        )}
        {tags?.includes('bestseller') && (
          <div className="absolute top-4 left-4 bg-[#ffc107] text-[#856404] px-4 py-2 rounded-full text-sm font-semibold">
            Best Seller
          </div>
        )}
      </div>

      {/* Image Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square bg-[#f8f9fa] rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === index
                  ? 'border-[#8FAE8F]'
                  : 'border-[#e0e0e0] hover:border-[#8FAE8F]'
              }`}
            >
              <Image
                src={image}
                alt={`${title} - Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
