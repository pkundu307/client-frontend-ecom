"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- 1. Define TypeScript interfaces for our data ---

// This matches the lean API response from your NestJS service
interface ProductSearchResult {
  id: string;
  title: string;
  slug: string;
  images: string[];
  category: {
    name: string;
  };
  variants: {
    id: string;
    price: string;
    images: string[];
  }[];
}

// This is the format our UI component will use after mapping the data
interface DisplayResult {
  id: string;
  slug: string;
  text: string;
  subtext?: string;
  image?: string;
}

// --- 2. Create a custom hook for debouncing input ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to cancel the timeout if value changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DisplayResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Use the debounce hook to avoid sending requests on every keystroke
  const debouncedQuery = useDebounce(query, 300);

  // --- 3. useEffect to fetch data when the debounced query changes ---
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products/search?query=${debouncedQuery}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data: ProductSearchResult[] = await response.json();

        // Map the API data to the format our component needs
        const mappedResults: DisplayResult[] = data.map((product) => ({
          id: product.id,
          slug: product.slug,
          text: product.title,
          subtext: `in ${product.category.name}`,
          // Use the first product image, fallback to the first variant image
          image: product.images[0] || product.variants[0]?.images[0],
        }));

        setResults(mappedResults);
      } catch (error) {
        console.error("Search API error:", error);
        setResults([]); // Clear results on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery]);

  return (
    <div className="min-h-screen bg-[#e8ecf0] relative">
      {/* Animated Search Character */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
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
            style={{ boxShadow: 'inset 4px 4px 10px #c5cdd5, inset -4px -4px 10px #ffffff' }}
          >
            <Search size={22} className="text-gray-500 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products, brands..."
              className="flex-1 bg-transparent text-gray-900 text-base placeholder:text-gray-500 focus:outline-none"
            />
            {isLoading && <Loader2 className="animate-spin text-gray-400" size={18} />}
            {query && !isLoading && (
              <motion.button
                initial={{ scale: 0 }} animate={{ scale: 1 }} whileTap={{ scale: 0.9 }}
                onClick={() => setQuery("")}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-full bg-[#e8ecf0]"
                style={{ boxShadow: '4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff' }}
              >
                <X size={18} />
              </motion.button>
            )}
          </div>

          {/* Popular Searches (shown when there's no query) */}
          {!query && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h3 className="text-base font-bold text-gray-900 mb-4">Popular Searches</h3>
              <div className="flex flex-wrap gap-2">
                {["Watches", "Shoes", "Bags", "Electronics", "Fashion", "Home & Kitchen"].map((tag) => (
                  <motion.button key={tag} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setQuery(tag.toLowerCase())}
                    className="px-4 py-2 bg-[#e8ecf0] rounded-xl text-gray-900 font-medium text-sm"
                    style={{ boxShadow: '4px 4px 10px #c5cdd5, -4px -4px 10px #ffffff' }}
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Search Results */}
          <AnimatePresence>
            {debouncedQuery && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-[#e8ecf0] rounded-2xl overflow-hidden mb-6"
                style={{ boxShadow: '10px 10px 20px #c5cdd5, -10px -10px 20px #ffffff' }}
              >
                {results.map((item, index) => (
                  <Link href={`/product/${item.slug}`} key={item.id}>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center p-4 hover:bg-white/40 cursor-pointer transition-colors border-b border-gray-200 last:border-0"
                    >
                      {item.image && (
                        <div
                          className="w-12 h-12 rounded-xl overflow-hidden mr-3 bg-white shrink-0"
                          style={{ boxShadow: '3px 3px 6px #c5cdd5, -3px -3px 6px #ffffff' }}
                        >
                          <Image width={48} height={48} src={item.image} alt={item.text}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
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
                  </Link>
                ))}
              </motion.div>
            )}

            {/* No Results Message */}
            {!isLoading && debouncedQuery && results.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <div
                  className="inline-block p-4 rounded-full bg-[#e8ecf0] mb-4"
                  style={{ boxShadow: 'inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff' }}
                >
                  <Search size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">No matches found for {debouncedQuery}</p>
                <p className="text-gray-500 text-sm mt-1">Try different keywords</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}