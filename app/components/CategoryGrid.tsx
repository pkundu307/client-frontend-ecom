"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const categories = [
  {
    id: 1,
    name: "Ethnic Wear",
    discount: "50-80% OFF",
    image: "/images/ethnic-wear.jpg",
  },
  {
    id: 2,
    name: "WFH Casual Wear",
    discount: "40-80% OFF",
    image: "/images/casual-wear.jpg",
  },
  {
    id: 3,
    name: "Activewear",
    discount: "30-70% OFF",
    image: "/images/activewear.jpg",
  },
  {
    id: 4,
    name: "Western Wear",
    discount: "40-80% OFF",
    image: "/images/western-wear.jpg",
  },
  {
    id: 5,
    name: "Sportswear",
    discount: "30-80% OFF",
    image: "/images/sportswear.jpg",
  },
];

export default function CategoryGrid() {
  return (
    <div className="w-full bg-[#e8ecf0] py-8 md:py-12 lg:py-16 px-3 sm:px-4 md:px-6">
      <div className="w-full max-w-[1920px] mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center mb-6 md:mb-10">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#e8ecf0] rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer"
              style={{
                boxShadow: '8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff'
              }}
            >
              {/* Image Container with fixed aspect ratio */}
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-t-2xl md:rounded-t-3xl">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover transform transition-transform duration-300 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Category Info */}
              <div className="p-3 sm:p-4 md:p-5">
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                  {category.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 md:mb-3">
                  {category.discount}
                </p>
                
                {/* Shop Now Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gray-900 text-white py-2 sm:py-2.5 md:py-3 rounded-xl md:rounded-2xl font-semibold text-xs sm:text-sm transition-all"
                  style={{
                    boxShadow: '4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff'
                  }}
                >
                  Shop Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
