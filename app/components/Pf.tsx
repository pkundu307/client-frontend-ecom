"use client";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

const PublicFavorite = () => {
  return (
    <section className="bg-gradient-to-br from-[#f0f4f8] via-[#e8ecf0] to-[#e0e8eb] py-16 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-3"
          >
            Public Favorite
          </motion.h2>
          <p className="text-lg text-gray-600">Curated Choices for Discerning Tastes</p>
        </div>

        {/* Grid Layout for Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6">
          {/* Large Card (Takes Full Left Side) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -8 }}
            className="relative rounded-3xl p-8 md:col-span-2 md:row-span-2 min-h-[450px] overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '16px 16px 32px #c5cdd5, -16px -16px 32px #ffffff'
            }}
          >
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Sold Out Badge */}
            <div 
              className="absolute top-6 right-6 px-4 py-2 rounded-full text-sm font-bold bg-white/40 backdrop-blur-xl border-2 border-red-500 text-red-700 z-10"
              style={{
                boxShadow: '0 4px 8px rgba(239, 68, 68, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.5)'
              }}
            >
              98% Sold
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-2">Royal Heritage Box</h3>
              <p className="text-white/90 text-lg">Handcrafted luxury with 24k gold detailing</p>
            </div>

            {/* Price & Add to Cart */}
            <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between z-10">
              <span className="text-3xl font-bold text-white">₹29,999</span>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white text-gray-900 font-bold px-6 py-3 rounded-2xl hover:bg-gray-100 transition-colors"
                style={{
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
                }}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add</span>
              </motion.button>
            </div>

            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </motion.div>

          {/* Small Card 1 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -8 }}
            className="relative rounded-3xl p-6 min-h-[215px] overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              boxShadow: '12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff'
            }}
          >
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Sold Out Badge */}
            <div 
              className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-white/40 backdrop-blur-xl border-2 border-red-500 text-red-700 z-10"
              style={{
                boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.5)'
              }}
            >
              98% Sold
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-1">Royal Heritage Mini 2</h3>
              <p className="text-white/90 text-sm">Compact luxury with exquisite details</p>
            </div>

            {/* Price & Add to Cart */}
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between z-10">
              <span className="text-xl font-bold text-white">₹9,999</span>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white text-gray-900 font-bold px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors text-sm"
                style={{
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                }}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add</span>
              </motion.button>
            </div>

            {/* Decorative circle */}
            <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
          </motion.div>

          {/* Small Card 2 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -8 }}
            className="relative rounded-3xl p-6 min-h-[215px] overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              boxShadow: '12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff'
            }}
          >
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Sold Out Badge */}
            <div 
              className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-white/40 backdrop-blur-xl border-2 border-red-500 text-red-700 z-10"
              style={{
                boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.5)'
              }}
            >
              98% Sold
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-1">Royal Heritage Mini 3</h3>
              <p className="text-white/90 text-sm">Compact luxury with exquisite details</p>
            </div>

            {/* Price & Add to Cart */}
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between z-10">
              <span className="text-xl font-bold text-white">₹9,999</span>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white text-gray-900 font-bold px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors text-sm"
                style={{
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                }}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add</span>
              </motion.button>
            </div>

            {/* Decorative circle */}
            <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PublicFavorite;
