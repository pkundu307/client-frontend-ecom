"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { use } from "react";
import {
  Squares2X2Icon,
  ListBulletIcon,
  HeartIcon,
  EyeIcon,
  SparklesIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartSolid,
  StarIcon as StarSolid,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

/* ================= TYPES ================= */

interface Product {
  id: string;
  title: string;
  description: string;
  slug: string;
  businessName: string;
  numberOfReviews: number;
  price: string;
  mrp: string;
  images: string[];
  isCustomizable: boolean;
}

interface CategoryInfo {
  id: number;
  name: string;
  slug: string;
}

interface SubCategory extends CategoryInfo {
  products: Product[];
}

interface ParentCategoryResponse {
  type: "parent_category";
  category: CategoryInfo;
  children: SubCategory[];
}

interface ChildCategoryResponse {
  type: "child_category";
  category: CategoryInfo;
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

type CategoryResponse = ParentCategoryResponse | ChildCategoryResponse;

/* ================= API ================= */

const fetchProductsByCategory = async (
  categoryId: string,
  page = 1,
  limit = 10
): Promise<CategoryResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/category-page/${categoryId}?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};

/* ================= VARIANTS ================= */

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

/* ================= UI HELPERS ================= */

const CustomizableBadge = ({ className = "" }: { className?: string }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-linear-to-r from-blue-500 to-purple-500 text-white ${className}`}
  >
    <SparklesIcon className="w-3 h-3" />
    Customizable
  </span>
);

/* ================= PRODUCT CARDS ================= */

const ProductCardGrid = ({
  product,
  isWishlisted,
  onToggleWishlist,
}: {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}) => {
  const discountPercentage =
    product.mrp !== "0" && parseFloat(product.mrp) > parseFloat(product.price)
      ? Math.round(
          ((parseFloat(product.mrp) - parseFloat(product.price)) /
            parseFloat(product.mrp)) *
            100
        )
      : 0;


  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/product/${product.slug}`} className="block h-full">
        <div
          className="bg-[#e8ecf0] rounded-3xl p-4 flex flex-col h-full hover:shadow-xl transition-shadow duration-300"
          style={{
            boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
          }}
        >
          {/* IMAGE */}
          <div className="relative mb-4 rounded-2xl overflow-hidden bg-gray-200">
            <div className="relative w-full aspect-square">
              <Image
                src={product.images[0] || "/placeholder-product.jpg"}
                alt={product.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* BADGES */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discountPercentage > 0 && (
                <span className="px-2 py-1 rounded-full bg-red-500 text-white text-xs font-bold shadow-lg">
                  -{discountPercentage}%
                </span>
              )}
              {product.isCustomizable && <CustomizableBadge />}
            </div>

            {/* ACTIONS */}
            <div className="absolute top-2 right-2 flex flex-col gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleWishlist(product.id);
                }}
                className="rounded-full p-2 bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-lg"
              >
                {isWishlisted &&
                // (
                //   <HeartSolid className="w-5 h-5 text-red-500" />
                // ) : (
                //   <HeartIcon className="w-5 h-5 text-gray-700" />
                // )
                (<></>)
                }
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1 flex flex-col">
            <h3 className="font-bold text-base md:text-lg text-gray-900 line-clamp-2 mb-2">
              {product.title}
            </h3>
            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
              {product.description}
            </p>
            <p className="text-xs font-semibold text-gray-700 mb-3">
              by {product.businessName}
            </p>

            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarSolid key={star} className="w-4 h-4 text-yellow-400" />
              ))}
              <span className="text-xs text-gray-500 ml-1">
                ({product.numberOfReviews})
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-auto">
              <span className="text-2xl font-black text-gray-900">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
              {parseFloat(product.mrp) > parseFloat(product.price) && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{Number(product.mrp).toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const ProductCardList = ({
  product,
  isWishlisted,
  onToggleWishlist,
}: {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}) => {
  const discountPercentage =
    product.mrp !== "0" && parseFloat(product.mrp) > parseFloat(product.price)
      ? Math.round(
          ((parseFloat(product.mrp) - parseFloat(product.price)) /
            parseFloat(product.mrp)) *
            100
        )
      : 0;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      whileHover={{ x: 4 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div
          className="bg-[#e8ecf0] rounded-3xl p-4 flex gap-4 hover:shadow-xl transition-shadow duration-300"
          style={{
            boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
          }}
        >
          {/* IMAGE */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-2xl overflow-hidden bg-gray-200">
            <Image
              src={product.images[0] || "/placeholder-product.jpg"}
              alt={product.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />

            {/* BADGES */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discountPercentage > 0 && (
                <span className="px-2 py-1 rounded-full bg-red-500 text-white text-xs font-bold shadow-lg">
                  -{discountPercentage}%
                </span>
              )}
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-lg md:text-xl text-gray-900 line-clamp-2 flex-1">
                  {product.title}
                </h3>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleWishlist(product.id);
                  }}
                  className="rounded-full p-2 bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-lg flex-shrink-0"
                >
                  {isWishlisted ? (
                    <HeartSolid className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5 text-gray-700" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {product.isCustomizable && <CustomizableBadge />}
                <p className="text-sm font-semibold text-gray-700">
                  by {product.businessName}
                </p>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {product.description}
              </p>

              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarSolid key={star} className="w-4 h-4 text-yellow-400" />
                ))}
                <span className="text-xs text-gray-500 ml-1">
                  ({product.numberOfReviews})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-black text-gray-900">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>
                {parseFloat(product.mrp) > parseFloat(product.price) && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{Number(product.mrp).toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

/* ================= SUBCATEGORY SECTION WITH VIEW MORE ================= */

const SubCategorySection = ({
  subCategory,
  isGridView,
  wishlistedIds,
  onToggleWishlist,
  initialLimit = 8,
}: {
  subCategory: SubCategory;
  isGridView: boolean;
  wishlistedIds: Set<string>;
  onToggleWishlist: (id: string) => void;
  initialLimit?: number;
}) => {
  const [showAll, setShowAll] = useState(false);

  if (subCategory.products.length === 0) return null;

  const displayedProducts = showAll
    ? subCategory.products
    : subCategory.products.slice(0, initialLimit);
  const hasMore = subCategory.products.length > initialLimit;

  return (
    <div className="mb-12">
      {/* Subcategory Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href={`/category/${subCategory.slug}`}
            className="inline-block group"
          >
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
              {subCategory.name}
            </h2>
            <div className="h-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full mt-2 w-0 group-hover:w-full transition-all duration-300"></div>
          </Link>
          <p className="text-sm text-gray-600 mt-1">
            {subCategory.products.length} products
          </p>
        </div>

        {hasMore && !showAll && (
          <Link
            href={`/category/${subCategory.slug}`}
            className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
          >
            View All →
          </Link>
        )}
      </div>

      {/* Products Grid/List */}
      <motion.div
        layout
        className={
          isGridView
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "flex flex-col gap-4"
        }
      >
        <AnimatePresence mode="popLayout">
          {displayedProducts.map((product) =>
            isGridView ? (
              <ProductCardGrid
                key={product.id}
                product={product}
                isWishlisted={wishlistedIds.has(product.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ) : (
              <ProductCardList
                key={product.id}
                product={product}
                isWishlisted={wishlistedIds.has(product.id)}
                onToggleWishlist={onToggleWishlist}
              />
            )
          )}
        </AnimatePresence>
      </motion.div>

      {/* View More Button */}
      {hasMore && !showAll && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#e8ecf0] rounded-2xl font-semibold text-gray-900 hover:shadow-lg transition-all"
            style={{
              boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff",
            }}
          >
            View More in {subCategory.name}
            <ChevronDownIcon className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */

const ProductListing = ({
  params,
}: {
  params: Promise<{ categoryid: string }>;
}) => {
  const { categoryid } = use(params);

  const [data, setData] = useState<CategoryResponse | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<{
    page: number;
    lastPage: number;
    total: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGridView, setIsGridView] = useState(true);
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());

  // Initial load
  const loadProducts = useCallback(
    async (pageNum = 1) => {
      const isInitialLoad = pageNum === 1;
      const loadingSetter = isInitialLoad ? setLoading : setLoadingMore;

      try {
        loadingSetter(true);
        const res = await fetchProductsByCategory(categoryid, pageNum, 10);
        setData(res);

        if (res.type === "child_category") {
          if (isInitialLoad) {
            setProducts(res.products);
          } else {
            setProducts((prev) => [...prev, ...res.products]);
          }
          setPagination({
            page: res.pagination.page,
            lastPage: res.pagination.lastPage,
            total: res.pagination.total,
          });
        } else {
          // Parent category - no pagination
          setPagination(null);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        loadingSetter(false);
      }
    },
    [categoryid]
  );

  useEffect(() => {
    loadProducts(1);
  }, [loadProducts]);

  const handleLoadMore = () => {
    if (!pagination || pagination.page >= pagination.lastPage || loadingMore) {
      return;
    }
    loadProducts(pagination.page + 1);
  };

  const toggleWishlist = (productId: string) => {
    setWishlistedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };


  // Get total product count
  const getTotalProducts = (): number => {
    if (!data) return 0;
    if (data.type === "child_category") {
      return pagination?.total || products.length;
    }
    return data.children.reduce(
      (total, subCat) => total + subCat.products.length,
      0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center p-4">
        <div className="text-center bg-red-50 p-8 rounded-3xl shadow-lg">
          <p className="text-red-600 font-semibold text-lg">{error}</p>
          <button
            onClick={() => loadProducts(1)}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const totalProducts = getTotalProducts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d8e4e6] via-[#e8ecf0] to-[#dfe7e9]">
      {/* STICKY HEADER */}
      <div className="sticky top-0 z-20 backdrop-blur-lg bg-[#e8ecf0]/80">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div
            className="bg-[#e8ecf0] rounded-3xl p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{
              boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
            }}
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">
                {data.category.name}
              </h1>
              <p className="text-sm text-gray-600">
                {totalProducts} products
                {data.type === "parent_category" &&
                  ` in ${data.children.length} categories`}
                {pagination && ` • Page ${pagination.page} of ${pagination.lastPage}`}
              </p>
            </div>

            {/* VIEW TOGGLE */}
            <div
              className="flex gap-2 bg-[#e8ecf0] rounded-2xl p-2"
              style={{
                boxShadow:
                  "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
              }}
            >
              <button
                onClick={() => setIsGridView(true)}
                className={`p-3 rounded-xl transition-all ${
                  isGridView
                    ? "bg-gray-900 text-white shadow-lg"
                    : "text-gray-600 hover:bg-white/50"
                }`}
                aria-label="Grid view"
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsGridView(false)}
                className={`p-3 rounded-xl transition-all ${
                  !isGridView
                    ? "bg-gray-900 text-white shadow-lg"
                    : "text-gray-600 hover:bg-white/50"
                }`}
                aria-label="List view"
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTS SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {totalProducts === 0 ? (
          <div className="text-center py-16">
            <EyeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No products found</p>
          </div>
        ) : data.type === "parent_category" ? (
          // Parent category: Show subcategories with their products
          <div>
            {data.children.map((subCategory) => (
              <SubCategorySection
                key={subCategory.id}
                subCategory={subCategory}
                isGridView={isGridView}
                wishlistedIds={wishlistedIds}
                onToggleWishlist={toggleWishlist}
                initialLimit={8}
              />
            ))}
          </div>
        ) : (
          // Child category: Show paginated products
          <>
            <motion.div
              layout
              className={
                isGridView
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              <AnimatePresence mode="popLayout">
                {products.map((product) =>
                  isGridView ? (
                    <ProductCardGrid
                      key={product.id}
                      product={product}
                      isWishlisted={wishlistedIds.has(product.id)}
                      onToggleWishlist={toggleWishlist}
                    />
                  ) : (
                    <ProductCardList
                      key={product.id}
                      product={product}
                      isWishlisted={wishlistedIds.has(product.id)}
                      onToggleWishlist={toggleWishlist}
                    />
                  )
                )}
              </AnimatePresence>
            </motion.div>

            {/* Load More Button */}
            {pagination && pagination.page < pagination.lastPage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 text-center"
              >
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
                  style={{
                    boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
                  }}
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More Products
                      <ChevronDownIcon className="w-5 h-5" />
                    </>
                  )}
                </button>
                <p className="text-sm text-gray-600 mt-4">
                  Showing {products.length} of {pagination.total} products
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductListing;
