import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface ImageGalleryProps {
  images: string[];
  productTitle: string;
}

export default function ImageGallery({ images, productTitle }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-200 rounded-xl flex items-center justify-center">
        <span className="text-gray-500">No image available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative shadow-blue-950">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="aspect-square relative bg-gray-100 rounded-xl overflow-hidden cursor-pointer"
          onClick={() => setIsFullscreen(true)}
        >
          <Image
            src={images[currentImageIndex]}
            alt={`${productTitle} - Image ${currentImageIndex + 1}`}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-product.jpg";
            }}
          />
        </motion.div>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg z-10"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg z-10"
              aria-label="Next image"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                index === currentImageIndex ? "border-[var(--royal-gold)]" : "border-gray-200"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${productTitle} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-product.jpg";
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
              aria-label="Close fullscreen"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
            <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <Image
                src={images[currentImageIndex]}
                alt={`${productTitle} - Fullscreen`}
                width={1200}
                height={900}
                className="max-w-full max-h-full object-contain rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-product.jpg";
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
