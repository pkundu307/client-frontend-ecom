"use client";
import { motion } from "framer-motion";

const PublicFavorite = () => {
  return (
    <section className="bg-royal-green py-12 px-6 min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-royal-gold">Public Favorite</h2>
          <p className="text-lg text-white/80">Curated Royal Choices for Discerning Tastes</p>
        </div>

        {/* Grid Layout for Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6">
          {/* Large Card (Takes Full Left Side) */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative bg-royal-green-light rounded-2xl p-6 shadow-lg border border-white/10 md:col-span-2 md:row-span-2 min-h-[400px]"
          >
            {/* Sold Out Badge */}
            <span className="absolute top-4 right-4 bg-royal-gold text-black font-bold px-3 py-1 text-sm rounded-full">
              98% Sold
            </span>

            {/* Content */}
            <h3 className="text-xl font-semibold text-white">Royal Heritage Box</h3>
            <p className="text-white/60 mt-1">Handcrafted luxury with 24k gold detailing</p>

            {/* Price & Add to Cart */}
            <div className="absolute bottom-4 left-6 flex items-center justify-between w-[85%]">
              <span className="text-lg font-bold text-royal-gold">₹29,999</span>
              <button className="flex items-center bg-royal-gold text-black font-bold px-4 py-2 rounded-xl hover:bg-yellow-500">
                🛒 Add
              </button>
            </div>
          </motion.div>

          {/* Small Cards (Stacked on Right Side) */}
          {[2, 3].map((item) => (
            <motion.div
              key={item}
              whileHover={{ scale: 1.05 }}
              className="relative bg-royal-green-light rounded-2xl p-6 shadow-lg border border-white/10 min-h-[190px]"
            >
              {/* Sold Out Badge */}
              <span className="absolute top-4 right-4 bg-royal-gold text-black font-bold px-3 py-1 text-sm rounded-full">
                98% Sold
              </span>

              {/* Content */}
              <h3 className="text-xl font-semibold text-white">Royal Heritage Mini {item}</h3>
              <p className="text-white/60 mt-1">Compact luxury with exquisite details</p>

              {/* Price & Add to Cart */}
              <div className="absolute bottom-4 left-6 flex items-center justify-between w-[85%]">
                <span className="text-lg font-bold text-royal-gold">₹9,999</span>
                <button className="flex items-center bg-royal-gold text-black font-bold px-4 py-2 rounded-xl hover:bg-yellow-500">
                  🛒 Add
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PublicFavorite;
