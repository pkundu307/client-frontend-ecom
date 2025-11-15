"use client";

import { ShoppingCart } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Demand = () => {
  return (
    <div>
      <section className="bg-gradient-to-br from-[#d8e4e6] via-[#e8ecf0] to-[#dfe7e9] py-16 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Section Header with Character */}
          <div className="text-center mb-16 relative">
            {/* Character positioned at top right of header */}
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-8 right-0 md:right-20 lg:right-32 z-10"
            >
              <Image
                src="/character.png"
                alt="Shopping Character"
                width={120}
                height={120}
                className="drop-shadow-2xl"
              />
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-gray-900 mb-4 relative inline-block"
            >
              Hot Demand
              <span className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full w-3/4 mx-auto"></span>
            </motion.h2>
            <p className="text-gray-600 mt-6 text-lg">Trending Products {"Everyone's"} Buying</p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item, index) => (
              <motion.div 
                key={item}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-[#e8ecf0] rounded-3xl overflow-hidden"
                style={{
                  boxShadow: '12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff'
                }}
              >
                {/* Product Image Container */}
                <div className="h-72 bg-gradient-to-br from-gray-200 to-gray-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#e8ecf0] via-transparent to-transparent z-10"/>
                  {/* Replace with actual image */}
                  <div className="w-full h-full animate-pulse bg-gradient-to-br from-gray-300 to-gray-200"/>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 z-20"/>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                    Premium Product {item}
                  </h3>
                  <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                    High-demand item with exclusive features
                  </p>
                  
                  {/* Price & CTA */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-bold text-2xl">₹{29999 - (item * 5000)}</span>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gray-900 text-white px-5 py-3 rounded-2xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-semibold"
                      style={{
                        boxShadow: '6px 6px 12px #c5cdd5, -4px -4px 8px #ffffff'
                      }}
                    >
                      <ShoppingCart className="w-5 h-5"/>
                      <span>Add</span>
                    </motion.button>
                  </div>
                </div>

                {/* Demand Badge */}
                <div 
                  className="absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-bold bg-white/40 backdrop-blur-xl border-2 border-red-500 text-red-700"
                  style={{
                    boxShadow: '0 4px 8px rgba(239, 68, 68, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.3)'
                  }}
                >
                  🔥 {98 - index * 5}% Sold
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Demand;
