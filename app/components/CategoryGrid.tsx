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
    <div className="max-w-7xl mx-auto px-4 py-10 bg-[#e8ecf0]">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#e8ecf0] rounded-3xl overflow-hidden group cursor-pointer"
            style={{
              boxShadow: '8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff'
            }}
          >
            {/* Image Container */}
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-t-3xl">
              <Image
                src={category.image}
                alt={category.name}
                width={300}
                height={400}
                className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Category Info */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {category.discount}
              </p>
              
              {/* Shop Now Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-semibold text-sm transition-all"
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
  );
}
