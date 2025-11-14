"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingCart, TrendingUp } from "lucide-react";
import { useState } from "react";

const products = [
  { id: 1, name: "Mattresses", price: "₹2,990", img: "/images/mattress.png", badge: "Hot", color: "bg-red-500" },
  { id: 2, name: "Sofa & Sectional", price: "₹7,999", img: "/images/sofa.png", badge: "New", color: "bg-green-500" },
  { id: 3, name: "Office Study Chairs", price: "₹1,890", img: "/images/chair.png", badge: "Trending", color: "bg-blue-500" },
  { id: 4, name: "Beds", price: "₹1,790", img: "/images/bed.png", badge: "Sale", color: "bg-orange-500" },
  { id: 5, name: "TV Units", price: "₹1,249", img: "/images/tv.png", badge: "Hot", color: "bg-red-500" },
  { id: 6, name: "Sofa Beds", price: "₹6,099", img: "/images/sofabed.png", badge: "New", color: "bg-green-500" },
];

const BasedOnYourActivity = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Professional Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">For You</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Based on Your Activity
          </h2>
        </div>

        {/* Grid Layout - Professional */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {products.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              onHoverStart={() => setHoveredId(item.id)}
              onHoverEnd={() => setHoveredId(null)}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-all duration-300 hover:shadow-xl">
                {/* Image Container */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <Image
                    width={300}
                    height={300}
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Badge - Top Right Corner */}
                  <div 
                    className={`absolute top-2 right-2 ${item.color} text-white px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide shadow-lg`}
                  >
                    {item.badge}
                  </div>

                  {/* Quick Add on Hover */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: hoveredId === item.id ? 1 : 0,
                      y: hoveredId === item.id ? 0 : 10
                    }}
                    className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent"
                  >
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-white text-gray-900 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-1.5 hover:bg-gray-100 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add
                    </motion.button>
                  </motion.div>
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 leading-snug">
                    {item.name}
                  </h3>
                  <div className="text-lg font-bold text-gray-900">
                    {item.price}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BasedOnYourActivity;
