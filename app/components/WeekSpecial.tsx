"use client";
import { motion } from "framer-motion";

const WeekSpecial = () => {
  return (
<section className="bg-royal-green/20 py-12 px-4 sm:px-6 min-h-screen text-white">
  <div className="max-w-7xl mx-auto">
    {/* Section Header */}
    <div className="text-center mb-10">
      <h2 className="text-3xl sm:text-4xl font-bold text-royal-gold">Week Special</h2>
      <p className="text-base sm:text-lg text-white/80">Exclusive Picks for This Week</p>
    </div>

    {/* Responsive Grid Layout */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      {/* Large Item */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-royal-green-light rounded-2xl p-6 min-h-[200px] sm:min-h-[250px] shadow-lg border border-white/10"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-white">Special Item 1</h3>
        <p className="text-white/60 mt-1">Premium handcrafted piece</p>
      </motion.div>

      {/* Row of Boxes (Stacked on Mobile) */}
      <div className="flex flex-wrap gap-4">
        {/* Box 1 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-full sm:w-1/3 bg-royal-green-light rounded-2xl p-4 sm:p-6 min-h-[100px] sm:min-h-[120px] shadow-lg border border-white/10"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-white">Special Item 2</h3>
        </motion.div>

        {/* Box 2 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-full sm:w-1/3 bg-royal-green-light rounded-2xl p-4 sm:p-6 min-h-[100px] sm:min-h-[120px] shadow-lg border border-white/10"
        >
          <p className="text-white/60 mt-1">Limited edition</p>
        </motion.div>

        {/* Box 3 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-full sm:w-1/3 bg-royal-green-light rounded-2xl p-4 sm:p-6 min-h-[100px] sm:min-h-[120px] shadow-lg border border-white/10"
        >
          <p className="text-white/60 mt-1">Custom detailing</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-full sm:w-1/3 bg-royal-green-light rounded-2xl p-4 sm:p-6 min-h-[100px] sm:min-h-[120px] shadow-lg border border-white/10"
        >
          <p className="text-white/60 mt-1">Custom detailing</p>
        </motion.div>
      </div>

      {/* Large Item */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-royal-green-light rounded-2xl p-6 min-h-[200px] sm:min-h-[250px] shadow-lg border border-white/10"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-white">Special Item 3</h3>
        <p className="text-white/60 mt-1">Hand-selected royal selection</p>
      </motion.div>

      {/* Single Small Item */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-royal-green-light rounded-2xl p-6 min-h-[100px] sm:min-h-[120px] shadow-lg border border-white/10"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-white">Special Item 4</h3>
        <p className="text-white/60 mt-1">Exclusive luxury craftsmanship</p>
      </motion.div>
    </div>
  </div>
</section>

  );
};

export default WeekSpecial;
