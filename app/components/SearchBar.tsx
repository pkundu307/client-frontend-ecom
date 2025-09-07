"use client";

import { useState } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import Image from "next/image";

interface SearchResult {
  id: string; // Added unique identifier
  type: "suggestion" | "brand";
  text: string;
  subtext?: string;
  image?: string;
}

const suggestions: SearchResult[] = [
  { id: "1", type: "suggestion", text: "watch for men", subtext: "in Wrist Watches", image: "/watch-men.jpg" },
  { id: "2", type: "suggestion", text: "watch for women", subtext: "in Wrist Watches", image: "/watch-women.jpg" },
  { id: "3", type: "suggestion", text: "water bottle" },
  // ... other items with unique IDs
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const filteredResults = query
    ? suggestions.filter((item) => 
        item.text.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="h-screen flex flex-col bg-[var(--royal-green)] backdrop-blur-lg">
      {/* Search Header */}
      <div className="px-6 py-4 flex items-center gap-4 border-b border-[var(--royal-gold)]/30 bg-[var(--royal-green-light)]/50">
        <label htmlFor="search" className="text-[var(--royal-gold)]">
          <Search size={24} />
        </label>
        <input
          id="search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Discover premium greens..."
          className="flex-1 bg-transparent text-lg placeholder:text-[var(--royal-gold)]/70 
                    focus:outline-none border-2 border-[var(--royal-gold)]/30 rounded-xl
                    px-4 py-3 transition-all focus:border-[var(--royal-gold)]/50"
          aria-label="Search products"
        />
        {query && (
          <button 
            onClick={() => setQuery("")}
            className="p-2 text-[var(--royal-gold)] hover:bg-[var(--royal-green)]/30 rounded-full"
            aria-label="Clear search"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Search Results */}
      {isFocused && (
        <div className="mx-6 mt-2 bg-[var(--royal-green-light)] backdrop-blur-xl 
                      border border-[var(--royal-gold)]/20 rounded-xl shadow-xl
                      max-w-2xl self-center w-full">
          {filteredResults.length > 0 ? (
            filteredResults.map((item) => (
              <div
                key={item.id}
                className="group flex items-center p-4 hover:bg-[var(--royal-green)]/40 
                          border-b border-[var(--royal-gold)]/10 last:border-0 cursor-pointer"
                role="option"
              >
                {item.image && (
                  <Image
                    width={48}
                    height={48}
                    src={item.image}
                    alt={`${item.text} product image`}
                    className="rounded-lg border-2 border-[var(--royal-gold)]/20 mr-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div className="flex-1">
                  <p className="text-[var(--royal-gold)] font-medium">{item.text}</p>
                  {item.subtext && (
                    <p className="text-[var(--royal-gold)]/70 text-sm mt-1">{item.subtext}</p>
                  )}
                </div>
                <ArrowRight className="text-[var(--royal-gold)]/50 group-hover:text-[var(--royal-gold)] ml-4" size={20} />
              </div>
            ))
          ) : query ? (
            <div className="p-6 text-center">
              <p className="text-[var(--royal-gold)]/70 italic">No matches found</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}