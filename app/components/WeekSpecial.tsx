"use client";
import { motion } from "framer-motion";
import { Sparkles, Star, Crown, Zap } from "lucide-react";

const WeekSpecial = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#e5e9f0] via-[#e8ecf0] to-[#dfe5ea] py-16 px-4 sm:px-6 min-h-screen overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            <h2 className="text-5xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Week Special
            </h2>
            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
          </motion.div>
          <p className="text-lg text-gray-600">Exclusive Picks for This Week</p>
        </div>

        {/* Masonry-style Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Large Featured Item - Spans 2 columns */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="md:col-span-2 md:row-span-2 rounded-3xl p-8 min-h-[400px] relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '16px 16px 32px #c5cdd5, -16px -16px 32px #ffffff'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Icon */}
            <motion.div 
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-6 right-6"
            >
              <Crown className="w-12 h-12 text-white/30" />
            </motion.div>
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full mb-4">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-semibold">Premium Pick</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">Royal Heritage Collection</h3>
                <p className="text-white/90 text-lg">Premium handcrafted piece with exclusive detailing</p>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-bold text-white">₹49,999</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-purple-600 font-bold px-6 py-3 rounded-2xl"
                    style={{ boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}
                  >
                    View Now
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Small Box 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="rounded-3xl p-6 min-h-[190px] relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              boxShadow: '12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff'
            }}
          >
            <Zap className="w-8 h-8 text-white/40 absolute top-4 right-4" />
            <h3 className="text-xl font-bold text-white mb-2">Flash Deal</h3>
            <p className="text-white/90 text-sm">Limited edition craftsmanship</p>
            <div className="mt-4">
              <span className="text-2xl font-bold text-white">₹14,999</span>
            </div>
          </motion.div>

          {/* Small Box 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -6 }}
            className="rounded-3xl p-6 min-h-[190px] relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              boxShadow: '12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff'
            }}
          >
            <Star className="w-8 h-8 text-white/40 absolute top-4 right-4 fill-white/40" />
            <h3 className="text-xl font-bold text-white mb-2">Trending</h3>
            <p className="text-white/90 text-sm">Custom detailing available</p>
            <div className="mt-4">
              <span className="text-2xl font-bold text-white">₹19,999</span>
            </div>
          </motion.div>

          {/* Small Box 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -6 }}
            className="rounded-3xl p-6 min-h-[190px] relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              boxShadow: '12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff'
            }}
          >
            <Sparkles className="w-8 h-8 text-white/40 absolute top-4 right-4" />
            <h3 className="text-xl font-bold text-white mb-2">New Arrival</h3>
            <p className="text-white/90 text-sm">Exclusive design</p>
            <div className="mt-4">
              <span className="text-2xl font-bold text-white">₹24,999</span>
            </div>
          </motion.div>

          {/* Small Box 4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -6 }}
            className="rounded-3xl p-6 min-h-[190px] relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              boxShadow: '12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff'
            }}
          >
            <Crown className="w-8 h-8 text-gray-700/40 absolute top-4 right-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Limited Stock</h3>
            <p className="text-gray-700 text-sm">Hand-selected piece</p>
            <div className="mt-4">
              <span className="text-2xl font-bold text-gray-900">₹34,999</span>
            </div>
          </motion.div>

          {/* Medium Box - Spans 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -8 }}
            className="md:col-span-2 rounded-3xl p-8 min-h-[200px] relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
              boxShadow: '12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-xl px-4 py-2 rounded-full mb-3">
                  <Star className="w-4 h-4 text-white fill-white" />
                  <span className="text-white text-sm font-semibold">Best Seller</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Signature Collection</h3>
                <p className="text-white/90">Hand-selected royal selection with premium finish</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-white block mb-2">₹39,999</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-pink-600 font-bold px-6 py-2 rounded-xl text-sm"
                  style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
                >
                  Shop Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WeekSpecial;
