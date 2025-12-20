"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { use } from "react";
import {
  Squares2X2Icon,
  ListBulletIcon,
  HeartIcon,
  EyeIcon,
  ShoppingCartIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Types
interface Product {
  id: string;
  title: string;
  description: string;
  businessName: string;
  numberOfReviews: number;
  numberOfVariants: number;
  price: string;
  mrp: string;
  images: string[];
  isCustomizable: boolean;
}

interface ProductResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

const fetchProductsByCategory = async (
  categoryId: string,
  page = 1,
  limit = 10
): Promise<ProductResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/featured/category/${categoryId}?page=${page}&limit=${limit}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

// Neumorphic wrapper for cards
const NeuCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`bg-[#e8ecf0] rounded-2xl ${className}`}
      style={{
        boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
      }}
    >
      {children}
    </div>
  );
};

const PrimaryButton = ({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`w-full bg-gray-900 text-white py-2.5 rounded-2xl font-semibold text-sm md:text-base flex items-center justify-center gap-2 ${className}`}
    style={{
      boxShadow: "8px 8px 16px #c5cdd5, -6px -6px 12px #ffffff",
    }}
    {...props}
  >
    {children}
  </button>
);

const SecondaryButton = ({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`w-full bg-[#e8ecf0] text-gray-900 py-2.5 rounded-2xl font-semibold text-sm md:text-base flex items-center justify-center gap-2 ${className}`}
    style={{
      boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
    }}
    {...props}
  >
    {children}
  </button>
);

// Customizable Badge – light style
const CustomizableBadge = ({ className = "" }: { className?: string }) => {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 ${className}`}>
      <SparklesIcon className="w-3 h-3" />
      Customizable
    </span>
  );
};

// Grid Card
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
    <motion.div variants={cardVariants} initial="hidden" animate="show">
      <div
        className="bg-[#e8ecf0] rounded-3xl p-3 flex flex-col h-full"
        style={{
          boxShadow: "16px 16px 32px #c5cdd5, -16px -16px 32px #ffffff",
        }}
      >
        <div className="relative mb-3 rounded-2xl overflow-hidden bg-gray-200">
          <div className="relative w-full h-48">
            <Image
              src={product.images[0] || "/placeholder-product.jpg"}
              alt={product.title}
              fill
              className="object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-product.jpg";
              }}
            />
          </div>

          {/* Top badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discountPercentage > 0 && (
              <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                -{discountPercentage}%
              </span>
            )}
            {product.isCustomizable && <CustomizableBadge />}
          </div>

          {/* Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <button
              onClick={() => onToggleWishlist(product.id)}
              className="rounded-full p-2 bg-[#e8ecf0]/80 text-gray-700"
              style={{
                boxShadow: "4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff",
              }}
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              {isWishlisted ? (
                <HeartSolid className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5" />
              )}
            </button>
            <button
              className="rounded-full p-2 bg-[#e8ecf0]/80 text-gray-700"
              style={{
                boxShadow: "4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff",
              }}
              aria-label="View product details"
            >
              <EyeIcon className="w-5 h-5" />
            </button>
            {product.isCustomizable && (
              <button
                className="rounded-full p-2 bg-[#e8ecf0]/80 text-blue-600"
                style={{
                  boxShadow: "4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff",
                }}
                aria-label="Customize product"
              >
                <WrenchScrewdriverIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-sm md:text-base text-gray-900 line-clamp-2">
              {product.title}
            </h3>
            {product.isCustomizable && (
              <SparklesIcon
                className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"
                title="Customizable"
              />
            )}
          </div>
          <p className="text-xs text-gray-600 line-clamp-2 mb-1">
            {product.description}
          </p>
          <p className="text-xs font-medium text-gray-800 mb-2">
            {product.businessName}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarSolid key={star} className="w-3.5 h-3.5 text-yellow-400" />
            ))}
            <span className="text-xs text-gray-500 ml-1">
              ({product.numberOfReviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-gray-900 tabular-nums">
              ${product.price}
            </span>
            {product.mrp !== "0" &&
              parseFloat(product.mrp) > parseFloat(product.price) && (
                <span className="text-xs text-gray-500 line-through">
                  ${product.mrp}
                </span>
              )}
          </div>
          <p className="text-[11px] text-gray-500 mb-3">
            {product.numberOfVariants} variants available
          </p>

          {/* CTA */}
          <div className="flex gap-2 mt-auto">
            <SecondaryButton className="py-2 text-xs">
              <ShoppingCartIcon className="w-4 h-4" />
              Add to Cart
            </SecondaryButton>
            {product.isCustomizable && (
              <PrimaryButton className="py-2 text-xs">
                <WrenchScrewdriverIcon className="w-4 h-4" />
              </PrimaryButton>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// List Card
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
    <motion.div variants={cardVariants} initial="hidden" animate="show">
      <div
        className="bg-[#e8ecf0] rounded-3xl p-4 md:p-5 flex flex-col sm:flex-row gap-4"
          style={{
            boxShadow: "16px 16px 32px #c5cdd5, -16px -16px 32px #ffffff",
          }}
      >
        {/* Image */}
        <div className="relative w-full sm:w-40 md:w-48 h-32 sm:h-32 md:h-40 rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0">
          <Image
            src={product.images[0] || "/placeholder-product.jpg"}
            alt={product.title}
            fill
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-product.jpg";
            }}
          />
          {discountPercentage > 0 && (
            <span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between gap-3 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm md:text-base text-gray-900">
                  {product.title}
                </h3>
                {product.isCustomizable && (
                  <SparklesIcon
                    className="w-4 h-4 text-blue-600"
                    title="Customizable"
                  />
                )}
              </div>
              <p className="text-xs md:text-sm text-gray-600 line-clamp-3 mb-1.5">
                {product.description}
              </p>
              <p className="text-xs text-gray-800 font-medium mb-1">
                {product.businessName}
              </p>
              {product.isCustomizable && (
                <CustomizableBadge className="mt-1 hidden sm:inline-flex" />
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button
                onClick={() => onToggleWishlist(product.id)}
                className="rounded-full p-2 bg-[#e8ecf0] text-gray-700"
                style={{
                  boxShadow:
                    "4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff",
                }}
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                {isWishlisted ? (
                  <HeartSolid className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-5 h-5" />
                )}
              </button>
              <button
                className="rounded-full p-2 bg-[#e8ecf0] text-gray-700"
                style={{
                  boxShadow:
                    "4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff",
                }}
                aria-label="View product details"
              >
                <EyeIcon className="w-5 h-5" />
              </button>
              {product.isCustomizable && (
                <button
                  className="rounded-full p-2 bg-[#e8ecf0] text-blue-600"
                  style={{
                    boxShadow:
                      "4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff",
                  }}
                  aria-label="Customize product"
                >
                  <WrenchScrewdriverIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarSolid key={star} className="w-3.5 h-3.5 text-yellow-400" />
            ))}
            <span className="text-xs text-gray-500 ml-1">
              ({product.numberOfReviews})
            </span>
          </div>

          {/* Price + meta + CTAs */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg md:text-xl font-bold text-gray-900 tabular-nums">
                  ${product.price}
                </span>
                {product.mrp !== "0" &&
                  parseFloat(product.mrp) > parseFloat(product.price) && (
                    <span className="text-xs md:text-sm text-gray-500 line-through">
                      ${product.mrp}
                    </span>
                  )}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-[11px] md:text-xs text-gray-500">
                  {product.numberOfVariants} variants available
                </p>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <SecondaryButton className="md:px-5 py-2 text-xs md:text-sm">
                <ShoppingCartIcon className="w-4 h-4" />
                Add to Cart
              </SecondaryButton>
              {product.isCustomizable && (
                <PrimaryButton className="md:px-4 py-2 text-xs md:text-sm">
                  <WrenchScrewdriverIcon className="w-4 h-4" />
                  <span className="hidden md:inline">Customize</span>
                </PrimaryButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main listing
const ProductListing = ({ params }: { params: Promise<{ categoryid: string }> }) => {
  const { categoryid } = use(params);
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [wishlistedItems, setWishlistedItems] = useState<Set<string>>(new Set());
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    lastPage: 1,
    limit: 10,
  });

  const categoryId = categoryid;

  const loadProducts = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const response = await fetchProductsByCategory(categoryId, page);
        setProducts(response.products);
        setPagination({
          page: response.page,
          total: response.total,
          lastPage: response.lastPage,
          limit: response.limit,
        });
        setError(null);
      } catch (err) {
        setError(
          `Failed to load products. Please try again. ${(err as Error).message}`
        );
      } finally {
        setLoading(false);
      }
    },
    [categoryId]
  );

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleToggleWishlist = (productId: string) => {
    setWishlistedItems((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.lastPage) return;
    loadProducts(newPage);
  };

  const customizableCount = products.filter((p) => p.isCustomizable).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center">
        <div
          className="w-20 h-20 rounded-full bg-[#e8ecf0]"
          style={{
            boxShadow:
              "inset 6px 6px 12px #c5cdd5, inset -6px -6px 12px #ffffff",
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center px-4">
        <div
          className="bg-[#e8ecf0] rounded-3xl p-6 max-w-md w-full text-center"
          style={{
            boxShadow: "16px 16px 32px #c5cdd5, -16px -16px 32px #ffffff",
          }}
        >
          <p className="text-red-500 font-semibold mb-3 text-sm md:text-base">
            {error}
          </p>
          <PrimaryButton onClick={() => loadProducts()}>
            Try Again
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e8ecf0] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back + header */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="rounded-full p-2 bg-[#e8ecf0] text-gray-700"
              style={{
                boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
              }}
              aria-label="Go back"
            >
              {/* Simple chevron left using heroicons if you have it; otherwise text */}
              <span className="block w-4 h-4 border-l-2 border-b-2 border-gray-700 rotate-45 translate-x-[2px]" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Products
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-xs md:text-sm text-gray-600">
                  {pagination.total} products found
                </p>
                {customizableCount > 0 && (
                  <div className="flex items-center gap-1 text-blue-600 text-xs md:text-sm">
                    <SparklesIcon className="w-4 h-4" />
                    <span className="font-medium">
                      {customizableCount} customizable
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* View toggle – neumorphic */}
          <div
            className="flex items-center gap-2 rounded-2xl px-1 py-1 bg-[#e8ecf0]"
            style={{
              boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
            }}
          >
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl text-gray-700 flex items-center justify-center ${
                viewMode === "grid"
                  ? "bg-gray-900 text-white"
                  : "bg-[#e8ecf0]"
              }`}
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-xl text-gray-700 flex items-center justify-center ${
                viewMode === "list"
                  ? "bg-gray-900 text-white"
                  : "bg-[#e8ecf0]"
              }`}
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card wrapper like Order Details */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="show"
          className="bg-[#e8ecf0] rounded-3xl p-5 md:p-7"
          style={{
            boxShadow: "16px 16px 32px #c5cdd5, -16px -16px 32px #ffffff",
          }}
        >
          {products.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCardGrid
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistedItems.has(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <ProductCardList
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistedItems.has(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            )
          ) : (
            <NeuCard className="p-6 text-center">
              <p className="text-gray-500 text-sm md:text-base">
                No products found in this category.
              </p>
            </NeuCard>
          )}

          {/* Pagination */}
          {pagination.lastPage > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <SecondaryButton
                  className="w-auto px-4 py-2 text-xs md:text-sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </SecondaryButton>

                {Array.from(
                  { length: pagination.lastPage },
                  (_, i) => i + 1
                ).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 rounded-2xl text-xs md:text-sm font-medium ${
                      pageNum === pagination.page
                        ? "bg-gray-900 text-white"
                        : "bg-[#e8ecf0] text-gray-800"
                    }`}
                    style={{
                      boxShadow:
                        "4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff",
                    }}
                  >
                    {pageNum}
                  </button>
                ))}

                <SecondaryButton
                  className="w-auto px-4 py-2 text-xs md:text-sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.lastPage}
                >
                  Next
                </SecondaryButton>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProductListing;
