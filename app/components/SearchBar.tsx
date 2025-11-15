"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  id: string;
  type: "suggestion" | "brand";
  text: string;
  subtext?: string;
  image?: string;
}

const suggestions: SearchResult[] = [
  { id: "1", type: "suggestion", text: "watch for men", subtext: "in Wrist Watches", image: "/watch-men.jpg" },
  { id: "2", type: "suggestion", text: "watch for women", subtext: "in Wrist Watches", image: "/watch-women.jpg" },
  { id: "3", type: "suggestion", text: "water bottle", subtext: "in Kitchen & Dining" },
  { id: "4", type: "suggestion", text: "wireless earbuds", subtext: "in Electronics" },
  { id: "5", type: "suggestion", text: "yoga mat", subtext: "in Sports & Fitness" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const filteredResults = query
    ? suggestions.filter((item) => 
        item.text.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-[#e8ecf0] relative">
      {/* Animated Search Character - Fixed position bottom center */}
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
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
      >
        <Image
          src="/searchch.png"
          alt="Search Helper Character"
          width={200}
          height={200}
          className="drop-shadow-2xl"
          priority
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-20 px-4 sm:px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Search Input */}
          <div 
            className="flex items-center gap-3 bg-[#e8ecf0] rounded-2xl px-5 py-4 mb-6"
            style={{
              boxShadow: 'inset 4px 4px 10px #c5cdd5, inset -4px -4px 10px #ffffff'
            }}
          >
            <Search size={22} className="text-gray-500 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products, brands..."
              className="flex-1 bg-transparent text-gray-900 text-base placeholder:text-gray-500 focus:outline-none"
            />
            {query && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuery("")}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-full bg-[#e8ecf0]"
                style={{
                  boxShadow: '4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff'
                }}
              >
                <X size={18} />
              </motion.button>
            )}
          </div>

          {/* Popular Searches */}
          {!query && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-base font-bold text-gray-900 mb-4">Popular Searches</h3>
              <div className="flex flex-wrap gap-2">
                {["Watches", "Shoes", "Bags", "Electronics", "Fashion", "Home & Kitchen"].map((tag) => (
                  <motion.button
                    key={tag}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setQuery(tag.toLowerCase())}
                    className="px-4 py-2 bg-[#e8ecf0] rounded-xl text-gray-900 font-medium text-sm"
                    style={{
                      boxShadow: '4px 4px 10px #c5cdd5, -4px -4px 10px #ffffff'
                    }}
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Search Results */}
          <AnimatePresence>
            {query && filteredResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#e8ecf0] rounded-2xl overflow-hidden mb-6"
                style={{
                  boxShadow: '10px 10px 20px #c5cdd5, -10px -10px 20px #ffffff'
                }}
              >
                {filteredResults.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center p-4 hover:bg-white/40 cursor-pointer transition-colors border-b border-gray-200 last:border-0"
                  >
                    {item.image && (
                      <div 
                        className="w-12 h-12 rounded-xl overflow-hidden mr-3 bg-white"
                        style={{
                          boxShadow: '3px 3px 6px #c5cdd5, -3px -3px 6px #ffffff'
                        }}
                      >
                        <Image
                          width={48}
                          height={48}
                          src={item.image}
                          alt={item.text}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-gray-900 font-semibold text-sm">{item.text}</p>
                      {item.subtext && (
                        <p className="text-gray-600 text-xs mt-0.5">{item.subtext}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {query && filteredResults.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div 
                  className="inline-block p-4 rounded-full bg-[#e8ecf0] mb-4"
                  style={{
                    boxShadow: 'inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff'
                  }}
                >
                  <Search size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">No matches found</p>
                <p className="text-gray-500 text-sm mt-1">Try different keywords</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
