"use client";
import { useState, useEffect } from "react";
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

// --- Conceptual CSS Variables ---
// Ensure these (or similar) are defined in your global stylesheet (e.g., globals.css)
// :root {
//   --royal-gold: #D4AF37; /* A rich gold */
//   --royal-green: #2B543D; /* A deep, elegant green */
//   --royal-green-light: #5C8D6B; /* A lighter green for subtle accents/borders */
//   --foreground: #FFFFFF; /* White for text on dark backgrounds */
//   --background: #1A3628; /* A very dark green for the overall background, complementing royal-green */
//   --text-primary: var(--foreground);
//   --text-secondary: rgba(255, 255, 255, 0.7); /* Lighter white for secondary text */
//   --card-bg-opacity: rgba(43, 84, 61, 0.8); /* royal-green with opacity for backdrop effect */
//   --card-border-color: var(--royal-green-light);
//   --button-bg-light: rgba(255, 255, 255, 0.1); /* Light transparent button background */
//   --button-text-light: var(--foreground);
// }
// ---------------------------------

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

// API function to fetch products by category
const fetchProductsByCategory = async (
  categoryId: string,
  page = 1,
  limit = 10
): Promise<ProductResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/${categoryId}?page=${page}&limit=${limit}`
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

// Customizable Badge Component
const CustomizableBadge = ({ className = "" }: { className?: string }) => {
  return (
    <div 
      className={`inline-flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md ${className}`}
      title="This product can be customized"
    >
      <SparklesIcon className="w-3 h-3" />
      <span>Customizable</span>
    </div>
  );
};

// Product Card Component for Grid View
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-[var(--royal-green)] rounded-xl shadow-lg overflow-hidden border border-[var(--card-border-color)] hover:shadow-xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative group">
        <Image
          src={product.images[0] || "/placeholder-product.jpg"}
          alt={product.title}
          width={300}
          height={300}
          className="w-full h-64 object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-product.jpg"; }}
        />

        {/* Top Badges Row */}
        <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
              -{discountPercentage}%
            </div>
          )}
          
          {/* Customizable Badge - not needed here if also in info block */}
          {/* {product.isCustomizable && (
            <CustomizableBadge />
          )} */}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={() => onToggleWishlist(product.id)}
            className="p-2 bg-[var(--button-bg-light)] rounded-full shadow-md text-[var(--button-text-light)] hover:bg-[var(--royal-green-light)]"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isWishlisted ? (
              <HeartSolid className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5" />
            )}
          </button>
          <button 
            className="p-2 bg-[var(--button-bg-light)] rounded-full shadow-md text-[var(--button-text-light)] hover:bg-[var(--royal-green-light)]"
            aria-label="View product details"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          {/* Customization Button - only show for customizable products */}
          {product.isCustomizable && (
            <button 
              className="p-2 bg-[var(--button-bg-light)] rounded-full shadow-md text-purple-400 hover:bg-[var(--royal-green-light)]"
              title="Customize this product"
              aria-label="Customize product"
            >
              <WrenchScrewdriverIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Add to Cart */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-2">
            <button className="flex-1 bg-[var(--royal-gold)] text-[var(--royal-green)] py-2 rounded-lg font-semibold hover:bg-[var(--royal-gold)]/90 transition-colors flex items-center justify-center gap-2">
              <ShoppingCartIcon className="w-4 h-4" />
              Add to Cart
            </button>
            {product.isCustomizable && (
              <button className="bg-purple-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors" aria-label="Customize product">
                <WrenchScrewdriverIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-2 flex-1 text-[var(--text-primary)]">
            {product.title}
          </h3>
          {product.isCustomizable && (
            <SparklesIcon className="w-5 h-5 text-purple-400 ml-2 flex-shrink-0" title="Customizable" />
          )}
        </div>
        
        <p className="text-[var(--text-secondary)] text-sm mb-2 line-clamp-2">
          {product.description}
        </p>
        <p className="text-sm text-[var(--royal-gold)] font-medium mb-2">
          {product.businessName}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarSolid // Changed to StarSolid for filled stars
              key={star}
              className="w-4 h-4 text-yellow-400"
            />
          ))}
          <span className="text-sm text-[var(--text-secondary)] ml-1">
            ({product.numberOfReviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-[var(--royal-gold)]">
            ${product.price}
          </span>
          {product.mrp !== "0" && parseFloat(product.mrp) > parseFloat(product.price) && (
            <span className="text-sm text-[var(--text-secondary)] line-through">
              ${product.mrp}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-[var(--text-secondary)]">
            {product.numberOfVariants} variants available
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Product Card Component for List View
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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[var(--royal-green)] rounded-xl shadow-lg overflow-hidden border border-[var(--card-border-color)] hover:shadow-xl transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative sm:w-64 h-48 sm:h-auto flex-shrink-0">
          <Image
            src={product.images[0] || "/placeholder-product.jpg"}
            alt={product.title}
            width={300}
            height={200}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-product.jpg"; }}
          />

          {/* Top Badges Column */}
          <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <div className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                -{discountPercentage}%
              </div>
            )}
            {/* Customizable Badge - not needed here if also in info block */}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-xl text-[var(--text-primary)]">{product.title}</h3>
                {product.isCustomizable && (
                  <SparklesIcon className="w-5 h-5 text-purple-400" title="Customizable" />
                )}
              </div>
              
              <p className="text-[var(--text-secondary)] mb-2 line-clamp-3">
                {product.description}
              </p>
              <p className="text-sm text-[var(--royal-gold)] font-medium mb-2">
                {product.businessName}
              </p>
              
              {/* Customizable Badge - only if not in top badge section */}
              {product.isCustomizable && (
                <div className="mb-2 hidden sm:block"> {/* Hide on small screens if already displayed */}
                  <CustomizableBadge />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 ml-4 flex-shrink-0">
              <button
                onClick={() => onToggleWishlist(product.id)}
                className="p-2 bg-[var(--button-bg-light)] rounded-full text-[var(--button-text-light)] hover:bg-[var(--royal-green-light)]"
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isWishlisted ? (
                  <HeartSolid className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-5 h-5" />
                )}
              </button>
              <button 
                className="p-2 bg-[var(--button-bg-light)] rounded-full text-[var(--button-text-light)] hover:bg-[var(--royal-green-light)]"
                aria-label="View product details"
              >
                <EyeIcon className="w-5 h-5" />
              </button>
              {product.isCustomizable && (
                <button 
                  className="p-2 bg-[var(--button-bg-light)] rounded-full text-purple-400 hover:bg-[var(--royal-green-light)]"
                  title="Customize this product"
                  aria-label="Customize product"
                >
                  <WrenchScrewdriverIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarSolid // Changed to StarSolid for filled stars
                key={star}
                className="w-4 h-4 text-yellow-400"
              />
            ))}
            <span className="text-sm text-[var(--text-secondary)] ml-1">
              ({product.numberOfReviews})
            </span>
          </div>

          {/* Price and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[var(--royal-gold)]">
                  ${product.price}
                </span>
                {product.mrp !== "0" && parseFloat(product.mrp) > parseFloat(product.price) && (
                  <span className="text-sm text-[var(--text-secondary)] line-through">
                    ${product.mrp}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-xs text-[var(--text-secondary)]">
                  {product.numberOfVariants} variants available
                </p>
                {/* <span className="text-xs text-purple-400 font-medium"> // Badge moved to top */}
                  {/* Customizable */}
                {/* </span> */}
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <button className="bg-[var(--royal-gold)] text-[var(--royal-green)] px-6 py-2 rounded-lg font-semibold hover:bg-[var(--royal-gold)]/90 transition-colors flex items-center gap-2">
                <ShoppingCartIcon className="w-4 h-4" />
                Add to Cart
              </button>
              {product.isCustomizable && (
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-1" aria-label="Customize product">
                  <WrenchScrewdriverIcon className="w-4 h-4" />
                  Customize
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Product Listing Component
const ProductListing = ({ params }: { params: Promise<{ categoryid: string }> }) => {
  const { categoryid } = use(params);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [wishlistedItems, setWishlistedItems] = useState<Set<string>>(
    new Set()
  );
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    lastPage: 1,
    limit: 10,
  });

  const categoryId = categoryid;

  const loadProducts = async (page = 1) => {
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
      setError(`Failed to load products. Please try again.${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, ); // Re-fetch when categoryId changes

  const handleToggleWishlist = (productId: string) => {
    setWishlistedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handlePageChange = (newPage: number) => {
    loadProducts(newPage);
  };

  // Count customizable products
  const customizableCount = products.filter(p => p.isCustomizable).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-[var(--foreground)]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--royal-gold)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-[var(--foreground)]">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => loadProducts()}
            className="bg-[var(--royal-gold)] text-[var(--royal-green)] px-6 py-2 rounded-lg hover:bg-[var(--royal-gold)]/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--royal-gold)]">Products</h1>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-[var(--text-secondary)]">
                {pagination.total} products found
              </p>
              {customizableCount > 0 && (
                <div className="flex items-center gap-1 text-purple-400">
                  <SparklesIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {customizableCount} customizable
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-[var(--royal-green-light)] rounded-lg p-1 border border-[var(--royal-green)]">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-[var(--royal-gold)] text-[var(--royal-green)]"
                  : "text-[var(--foreground)] hover:bg-white/10"
              }`}
              aria-label="Switch to grid view"
            >
              <Squares2X2Icon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-[var(--royal-gold)] text-[var(--royal-green)]"
                  : "text-[var(--foreground)] hover:bg-white/10"
              }`}
              aria-label="Switch to list view"
            >
              <ListBulletIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Products Grid/List */}
        {products.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
            <div className="space-y-6">
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
          <div className="text-center py-12">
            <p className="text-[var(--text-secondary)] text-lg">
              No products found in this category.
            </p>
          </div>
        )}
        

        {/* Pagination */}
        {pagination.lastPage > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-[var(--royal-green-light)] bg-[var(--royal-green)] text-[var(--foreground)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--royal-green-light)] transition-colors"
                aria-label="Previous page"
              >
                Previous
              </button>

              {Array.from({ length: pagination.lastPage }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      pageNum === pagination.page
                        ? "bg-[var(--royal-gold)] text-[var(--royal-green)]"
                        : "border border-[var(--royal-green-light)] bg-[var(--royal-green)] text-[var(--foreground)] hover:bg-[var(--royal-green-light)]"
                    }`}
                    aria-label={`Page ${pageNum}`}
                  >
                    {pageNum}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.lastPage}
                className="px-4 py-2 border border-[var(--royal-green-light)] bg-[var(--royal-green)] text-[var(--foreground)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--royal-green-light)] transition-colors"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListing;