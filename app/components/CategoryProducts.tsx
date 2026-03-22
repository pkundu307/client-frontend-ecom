// components/CategoryProducts.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { baseUrl as BASE_URL } from "../utilities/baseUrl";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Product {
  id:    string;
  name:  string;
  image: string;
  price: number;
  slug:   string;
}

interface Category {
  categoryName: string;
  categoryId:   number;
  categorySlug: string;
  products:     Product[];
}

// ── Product Card ──────────────────────────────────────────────────────────────
const ProductCard = ({ product, index }: { product: Product; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.07 }}
    className="h-full"
  >
    <Link href={`/product/${product.slug}`} className="block h-full">
      <div
        className="bg-[#e8ecf0] rounded-xl overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col"
        style={{ boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff" }}
      >
        {/* Image */}
        <div className="relative aspect-square flex-shrink-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col flex-1 gap-1">
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <p className="mt-auto text-sm font-bold text-gray-800 pt-2">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </Link>
  </motion.div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const CategoryProducts = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading,  setIsLoading]  = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/homepage/distributed`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data: Category[] = await res.json();
        // Only keep categories that actually have products
        setCategories(data.filter((c) => c.products.length > 0));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <section className="py-12 px-4 bg-[#e8ecf0]">
        <div className="max-w-7xl mx-auto space-y-10">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-4 animate-pulse">
              <div className="h-7 w-40 bg-gray-300 rounded-lg" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="aspect-square rounded-xl bg-gray-300" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-4 bg-[#e8ecf0]">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          {error}
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-12 px-4 bg-[#e8ecf0]">
      <div className="max-w-7xl mx-auto space-y-14">
        {categories.map((category, catIndex) => (
          <motion.div
            key={category.categoryId}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1 }}
          >
            {/* Category Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {category.categoryName}
              </h2>
              <Link
                href={`/category/${category.categorySlug}`}
                className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
              >
                View all →
              </Link>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {category.products.map((product, productIndex) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={productIndex}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategoryProducts;