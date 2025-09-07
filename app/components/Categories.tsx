"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { baseUrl } from '../utilities/baseUrl';

// --- API Call Setup ---
const BASE_URL=baseUrl;

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
// Matches the "lean" category structure from your API
interface CategoryNode {
  id: number;
  name: string;
  parentId: number | null;
  children: CategoryNode[];
}

// --- The Mega Menu Component ---
const MegaMenu: React.FC = () => {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<CategoryNode | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data: CategoryNode[] = await apiCall('/categories/tree');
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleMouseEnter = (category: CategoryNode) => {
    // Only show the menu if the category has children (L2 categories)
    if (category.children && category.children.length > 0) {
      setHoveredCategory(category);
    }
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };

  if (loading) {
    return <MegaMenuSkeleton />;
  }
  
  if (error) {
    return <div className="text-center py-4 text-red-500 bg-red-50">Error: {error}</div>;
  }

  return (
    <nav className="relative bg-white shadow-sm" onMouseLeave={handleMouseLeave}>
      {/* Top Level Navigation Bar */}
      <div className="w-full overflow-x-auto">
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
                    ? 'text-purple-600'
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                {l1Category.name}
              </Link>
              {/* Active hover indicator */}
              <div
                className={`h-0.5 mt-3 transition-all duration-300 ${
                  hoveredCategory?.id === l1Category.id
                    ? 'bg-purple-600 w-full'
                    : 'bg-transparent w-0'
                } mx-auto`}
              ></div>
            </div>
          ))}
        </div>
      </div>

      {/* Mega Menu Dropdown Panel */}
      {hoveredCategory && (
        <div className="absolute top-full left-0 w-full bg-gray-50/95 backdrop-blur-sm shadow-lg border-t border-gray-200 z-30">
          <div className="w-full overflow-x-auto">
            <div className="px-8 py-4">
              {/* Grid layout for L2 categories - back to vertical columns */}
              <div className="grid grid-cols-4 gap-x-8 gap-y-6">
                {hoveredCategory.children.map((l2Category) => (
                  <div key={l2Category.id}>
                    <Link
                      href={`/category/${l2Category.id}`}
                      className="block font-bold text-[var(--royal-gold)] text-sm mb-3 hover:underline"
                    >
                      {l2Category.name}
                    </Link>
                    {/* Horizontal layout for L3 categories */}
                    <div className="flex gap-x-4 flex-wrap gap-y-1">
                      {l2Category.children.map((l3Category) => (
                        <Link
                          key={l3Category.id}
                          href={`/category/${l3Category.id}`}
                          className="text-sm text-gray-600 hover:text-black transition-colors whitespace-nowrap"
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
          
          {/* Optional: Add scroll indicators */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
            <span>← Scroll →</span>
          </div>
        </div>
      )}
    </nav>
  );
};

// --- Skeleton Loader Component ---
const MegaMenuSkeleton: React.FC = () => {
  return (
    <div className="relative bg-white shadow-sm animate-pulse">
      <div className="w-full overflow-x-auto">
        <div className="flex items-center justify-start min-w-max px-4 space-x-4 h-[35px]">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-1 w-24 bg-gray-200 rounded flex-shrink-0"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;