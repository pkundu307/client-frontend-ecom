"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { baseUrl } from '../utilities/baseUrl';

// --- API Call Setup ---
const BASE_URL = baseUrl;

const apiCall = async (endpoint: string) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`API Error fetching ${endpoint}:`, error);
    throw new Error('Failed to fetch categories.');
  }
};

// --- Type Definition ---
interface CategoryNode {
  id: number;
  name: string;
  parentId: number | null;
  children: CategoryNode[];
}

// --- Constants ---
const CACHE_KEY = "categories_cache";
const CACHE_EXPIRATION_DAYS = 2; // 2 days

// --- Mega Menu Component ---
const MegaMenu: React.FC = () => {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<CategoryNode | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch Categories (with cache support) ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        // Try to get cached data
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          const now = new Date().getTime();
          const cacheAge = now - parsed.timestamp;
          const twoDays = CACHE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;

          if (cacheAge < twoDays && Array.isArray(parsed.data)) {
            console.log("✅ Using cached category data");
            setCategories(parsed.data);
            setLoading(false);
            return;
          } else {
            console.log("⚠️ Cache expired. Fetching new data...");
          }
        }

        // Fetch from API
        const data: CategoryNode[] = await apiCall('/categories/tree');

        // Cache data with timestamp
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ timestamp: new Date().getTime(), data })
        );

        setCategories(data);
      } catch (err) {
        console.error("Category fetch error:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // --- Hover Handlers ---
  const handleMouseEnter = (category: CategoryNode) => {
    if (category.children && category.children.length > 0) {
      setHoveredCategory(category);
    }
  };

  const handleMouseLeave = () => setHoveredCategory(null);

  // --- UI ---
  if (loading) return <MegaMenuSkeleton />;
  if (error) return <div className="text-center py-4 text-red-500 bg-red-50">Error: {error}</div>;

  return (
    <nav
      className="relative bg-[linear-gradient(to_right,_#0a1c0a,_#001f4d,_#000000)] shadow-sm"
      onMouseLeave={handleMouseLeave}
    >
      {/* Top-Level Nav */}
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-start min-w-max px-4">
          {categories.map((l1Category) => (
            <div
              key={l1Category.id}
              onMouseEnter={() => handleMouseEnter(l1Category)}
              className="py-4 flex-shrink-0"
            >
              <Link
                href={`/category/${l1Category.id}`}
                className={`px-4 text-sm font-semibold tracking-wide uppercase transition-colors duration-200 whitespace-nowrap ${
                  hoveredCategory?.id === l1Category.id
                    ? 'text-grey-200 hover:text-purple-600'
                    : 'text-white hover:text-purple-600'
                }`}
              >
                {l1Category.name}
              </Link>
              {/* Active hover indicator */}
              <div
                className={`h-0.5 mt-3 transition-all duration-300 mx-auto ${
                  hoveredCategory?.id === l1Category.id
                    ? 'bg-purple-600 w-full'
                    : 'bg-transparent w-0'
                }`}
              ></div>
            </div>
          ))}
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      {hoveredCategory && (
        <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-sm shadow-lg border-t border-gray-700 z-30 transition-all duration-300">
          <div className="w-full overflow-x-auto">
            <div className="px-8 py-4">
              {/* L2/L3 Categories */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6">
                {hoveredCategory.children.map((l2Category) => (
                  <div key={l2Category.id}>
                    <Link
                      href={`/category/${l2Category.id}`}
                      className="block font-bold text-[var(--royal-gold)] text-sm mb-3 hover:underline"
                    >
                      {l2Category.name}
                    </Link>
                    <div className="flex gap-x-4 flex-wrap gap-y-1">
                      {l2Category.children.map((l3Category) => (
                        <Link
                          key={l3Category.id}
                          href={`/category/${l3Category.id}`}
                          className="text-sm text-gray-400 hover:text-gray-100 transition-colors whitespace-nowrap"
                        >
                          {l3Category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Optional scroll hint */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs select-none">
            ← Scroll →
          </div>
        </div>
      )}
    </nav>
  );
};

// --- Skeleton Loader ---
const MegaMenuSkeleton: React.FC = () => (
  <div className="relative bg-black/90 shadow-sm animate-pulse">
    <div className="w-full overflow-x-auto">
      <div className="flex items-center justify-start min-w-max px-4 space-x-4 h-[40px]">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="h-3 w-24 bg-gray-700 rounded flex-shrink-0"></div>
        ))}
      </div>
    </div>
  </div>
);

export default MegaMenu;
