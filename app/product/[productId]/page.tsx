// app/product/[productId]/page.tsx
"use client";
export const runtime = "edge";
import React, { use, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import Image from "next/image";

import {
  StarIcon,
  HeartIcon,
  ShareIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  CheckCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from "@heroicons/react/24/solid";

import ImageGallery from "./(component)/ImageGallery";
import VariantSelector from "./(component)/VariantSelector";
import { useProductDetails } from "../hooks/useProductDetails";
import type { TabId } from "../hooks/useProductDetails";
import { CheckIcon } from "lucide-react";
import SimilarProducts from "./(component)/SimilarProducts";
import RecentlyViewed from "@/app/components/RecentlyViewed";
import InYourWishlist from "./(component)/Wishlist";

const CustomizationModal = dynamic(() => import("./(component)/CustomizationModal"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="text-white text-lg font-semibold">Loading Customizer...</div>
    </div>
  ),
});

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

interface Review {
  id: string;
  customerUserId: string;
  rating: number;
  comment: string | null;
  title?: string | null;
  createdAt: string;
  images: string[];
  customerUser: {
    name: string;
    picture: string | null;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params instanceof Promise ? params : Promise.resolve(params));
  const { productId } = resolvedParams;
  const [copied, setCopied] = useState(false);

  // ✅ FIX: Replace all raw localStorage.getItem("token") in JSX with this state
  // Safe — set inside useEffect, never during SSR render
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: document.title,
      text: "Check out this product!",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const {
    product,
    selectedVariant,
    setSelectedVariant,
    quantity,
    setQuantity,
    loading,
    error,
    isWishlisted,
    isTogglingWishlist,
    activeTab,
    setActiveTab,
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    isAddingToCart,
    currentImages,
    currentPrice,
    currentMrp,
    currentStock,
    discountPercentage,
    isCurrentVariantActive,
    isCurrentVariantInStock,
    canPurchase,
    breadcrumbPath,
    handleToggleWishlist,
    handleAddToCart,
  } = useProductDetails(productId);

  const reviews = React.useMemo(() => {
    return ((product?.reviews || []) as unknown) as Review[];
  }, [product?.reviews]);

  const averageRating = React.useMemo(() => {
    if (reviews.length === 0) return "0";
    const totalRating = reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0);
    return (totalRating / reviews.length).toFixed(1);
  }, [reviews]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--royal-gold)] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <p className="text-red-600 text-lg mb-4 font-semibold">{error || "Product not found."}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[var(--royal-gold)] text-white px-6 py-2 rounded-lg hover:bg-[var(--royal-gold)]/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e8ecf0]">
      <Toaster position="top-center" reverseOrder={false} />

      {/* JSON-LD Schemas */}
      {product && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org/",
                "@type": "Product",
                name: product.title,
                image: product.images,
                description: product.description.replace(/<[^>]*>/g, ""),
                sku: product.id,
                brand: { "@type": "Brand", name: product.business.name },
                offers: {
                  "@type": "Offer",
                  url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.id}`,
                  priceCurrency: "INR",
                  price: selectedVariant?.price || product.variants[0]?.price || 0,
                  availability:
                    currentStock > 0
                      ? "https://schema.org/InStock"
                      : "https://schema.org/OutOfStock",
                  itemCondition: "https://schema.org/NewCondition",
                },
                aggregateRating:
                  reviews.length > 0
                    ? {
                        "@type": "AggregateRating",
                        ratingValue: averageRating,
                        reviewCount: reviews.length,
                      }
                    : undefined,
              }),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: process.env.NEXT_PUBLIC_SITE_URL },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: breadcrumbPath,
                    item: `${process.env.NEXT_PUBLIC_SITE_URL}/category/${product.categoryId}`,
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: product.title,
                    item: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.id}`,
                  },
                ],
              }),
            }}
          />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-8 overflow-x-auto whitespace-nowrap"
          aria-label="Breadcrumb"
        >
          <div className="flex items-center gap-2">
            <span className="hover:text-gray-700 transition-colors cursor-pointer">Home</span>
            <span className="text-gray-300">/</span>
            <span className="hover:text-gray-700 transition-colors cursor-pointer truncate">{breadcrumbPath}</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium truncate max-w-[150px] sm:max-w-none">
              {product.title}
            </span>
          </div>
        </motion.nav>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-8 sm:mb-12">
          {/* LEFT: Image Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <ImageGallery images={currentImages} productTitle={product.title} />
          </motion.div>

          {/* RIGHT: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Title + Action Buttons */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start justify-between gap-3">
                <h1 className="flex-1 text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 leading-tight">
                  {product.title}
                </h1>
                <div className="flex gap-2 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleToggleWishlist}
                    disabled={isTogglingWishlist}
                    className="p-2 sm:p-2.5 rounded-xl bg-[#e8ecf0] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ boxShadow: "4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff" }}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {isTogglingWishlist ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                    ) : isWishlisted ? (
                      <HeartSolid className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-gray-600" />
                    )}
                  </motion.button>

                  <motion.button
                    onClick={handleShare}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 sm:p-2.5 rounded-xl bg-[#e8ecf0] relative"
                    style={{ boxShadow: "4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff" }}
                    aria-label="Share product"
                  >
                    {copied ? (
                      <CheckIcon className="w-5 h-5 text-green-600" />
                    ) : (
                      <ShareIcon className="w-5 h-5 text-gray-600" />
                    )}
                    {copied && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded">
                        Copied!
                      </span>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {product.isCustomizable && (
                  <div
                    className="inline-flex items-center gap-1.5 bg-white text-purple-700 px-3 py-1.5 rounded-full text-xs font-bold border-2 border-purple-500"
                    style={{
                      boxShadow: "0 4px 6px rgba(0,0,0,0.2), 0 1px 2px rgba(255,255,255,0.6) inset",
                      backgroundImage: "linear-gradient(to top, rgba(255,255,255,0.4), rgba(255,255,255,0))",
                    }}
                  >
                    <SparklesIcon className="w-3.5 h-3.5" />
                    <span>Customizable</span>
                  </div>
                )}
                {product.isFeatured && (
                  <div
                    className="bg-white text-amber-700 px-3 py-1.5 rounded-full text-xs font-bold border-2 border-amber-500"
                    style={{
                      boxShadow: "0 4px 6px rgba(0,0,0,0.2), 0 1px 2px rgba(255,255,255,0.6) inset",
                      backgroundImage: "linear-gradient(to top, rgba(255,255,255,0.4), rgba(255,255,255,0))",
                    }}
                  >
                    Featured
                  </div>
                )}
                {selectedVariant && !isCurrentVariantActive && (
                  <div
                    className="bg-white text-yellow-700 px-3 py-1.5 rounded-full text-xs font-bold border-2 border-yellow-500"
                    style={{
                      boxShadow: "0 4px 6px rgba(0,0,0,0.2), 0 1px 2px rgba(255,255,255,0.6) inset",
                      backgroundImage: "linear-gradient(to top, rgba(255,255,255,0.4), rgba(255,255,255,0))",
                    }}
                  >
                    Draft Product
                  </div>
                )}
                {isCurrentVariantInStock ? (
                  <div
                    className="flex items-center gap-1.5 text-green-700 text-xs font-bold bg-white px-3 py-1.5 rounded-full border-2 border-green-500"
                    style={{
                      boxShadow: "0 4px 6px rgba(0,0,0,0.2), 0 1px 2px rgba(255,255,255,0.6) inset",
                      backgroundImage: "linear-gradient(to top, rgba(255,255,255,0.4), rgba(255,255,255,0))",
                    }}
                  >
                    <CheckCircleIcon className="w-3.5 h-3.5" />
                    In Stock ({currentStock})
                  </div>
                ) : (
                  <div
                    className="text-red-700 text-xs font-bold bg-white px-3 py-1.5 rounded-full border-2 border-red-500"
                    style={{
                      boxShadow: "0 4px 6px rgba(0,0,0,0.2), 0 1px 2px rgba(255,255,255,0.6) inset",
                      backgroundImage: "linear-gradient(to top, rgba(255,255,255,0.4), rgba(255,255,255,0))",
                    }}
                  >
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarSolid
                      key={star}
                      className={`w-4 h-4 ${parseFloat(averageRating) >= star ? "text-amber-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {averageRating} ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>

              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                    ₹{Number(currentPrice).toLocaleString("en-IN")}
                  </span>
                  {currentMrp !== "0" && parseFloat(currentMrp) > parseFloat(currentPrice) && (
                    <span className="text-lg sm:text-xl text-gray-400 line-through">
                      ₹{Number(currentMrp).toLocaleString("en-IN")}
                    </span>
                  )}
                  {discountPercentage > 0 && (
                    <span
                      className="bg-white/40 backdrop-blur-xl text-red-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold border-2 border-red-500"
                      style={{ boxShadow: "0 2px 4px rgba(239,68,68,0.1), inset 0 2px 4px rgba(255,255,255,0.1)" }}
                    >
                      {discountPercentage}% OFF
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-500">Inclusive of all taxes</p>
              </div>
            </div>

            {/* ── Action Buttons ── */}
            <div className="space-y-3 pt-2 sticky top-0 bg-[#e8ecf0] z-10 pb-4 -mx-4 px-4 sm:static sm:mx-0 sm:px-0">
              {!canPurchase && selectedVariant && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/40 backdrop-blur-xl border-2 border-yellow-500 rounded-2xl p-3"
                  style={{ boxShadow: "0 4px 8px rgba(234,179,8,0.2), 0 8px 16px rgba(0,0,0,0.1)" }}
                >
                  <p className="text-yellow-700 text-xs sm:text-sm font-medium text-center">
                    This variant is currently
                    {isCurrentVariantInStock ? " not available for purchase" : " out of stock"}.
                  </p>
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {/* ✅ Add to Cart Button — uses isLoggedIn, NOT localStorage in JSX */}
                <motion.button
                  whileHover={{
                    scale: canPurchase && isLoggedIn ? 1.02 : 1,
                    y: canPurchase && isLoggedIn ? -2 : 0,
                  }}
                  whileTap={{
                    scale: canPurchase && isLoggedIn ? 0.98 : 1,
                    y: canPurchase && isLoggedIn ? 1 : 0,
                  }}
                  onClick={handleAddToCart}
                  disabled={!canPurchase || isAddingToCart || !isLoggedIn}
                  className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-bold transition-all duration-200 ease-out flex items-center justify-center gap-2 text-sm sm:text-base ${
                    isAddingToCart
                      ? "bg-[#e8ecf0] cursor-wait text-gray-600"
                      : isLoggedIn && canPurchase
                      ? "bg-gray-900 text-white shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30"
                      : "bg-[#e8ecf0] text-gray-500 cursor-not-allowed"
                  }`}
                  style={
                    !isAddingToCart && (!isLoggedIn || !canPurchase)
                      ? { boxShadow: "inset 0 4px 8px rgba(0,0,0,0.1), inset 0 -2px 4px rgba(255,255,255,0.5), 0 0 6px rgba(0,0,0,0.05)" }
                      : isLoggedIn && canPurchase
                      ? { boxShadow: "0 8px 16px rgba(0,0,0,0.2), 0 12px 32px rgba(0,0,0,0.15), inset 0 -4px 8px rgba(0,0,0,0.3), 0 0 12px rgba(255,255,255,0.1)" }
                      : { boxShadow: "inset 0 4px 8px rgba(0,0,0,0.1), inset 0 -2px 4px rgba(255,255,255,0.5), 0 0 6px rgba(0,0,0,0.05)" }
                  }
                >
                  {isAddingToCart ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline">Adding...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCartIcon className="w-5 h-5" />
                      {/* ✅ isLoggedIn replaces localStorage.getItem("token") */}
                      <span className="hidden sm:inline">{isLoggedIn ? "Add to Cart" : "Login to Add"}</span>
                      <span className="sm:hidden">Add</span>
                    </>
                  )}
                </motion.button>

                {/* ✅ Buy Now Button */}
                <motion.button
                  whileHover={{ scale: canPurchase ? 1.02 : 1, y: canPurchase ? -2 : 0 }}
                  whileTap={{ scale: canPurchase ? 0.98 : 1, y: canPurchase ? 1 : 0 }}
                  onClick={() => { handleAddToCart(); window.location.href = "/cart"; }}
                  disabled={!canPurchase}
                  className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-sm sm:text-base ${
                    canPurchase ? "bg-orange-500 text-white" : "bg-[#e8ecf0] text-gray-500 cursor-not-allowed"
                  }`}
                  style={
                    canPurchase
                      ? { boxShadow: "0 8px 16px rgba(249,115,22,0.3), 0 12px 32px rgba(249,115,22,0.2), inset 0 -4px 8px rgba(0,0,0,0.2)" }
                      : { boxShadow: "inset 0 4px 8px rgba(0,0,0,0.1), inset 0 -2px 4px rgba(255,255,255,0.5)" }
                  }
                >
                  <CreditCardIcon className="w-5 h-5" />
                  {/* ✅ isLoggedIn replaces localStorage.getItem("token") */}
                  <span className="hidden sm:inline">{isLoggedIn ? "Buy Now" : "Login to Buy"}</span>
                  <span className="sm:hidden">Buy</span>
                </motion.button>
              </div>

              {/* Customize Button */}
              {product.isCustomizable && (
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98, y: 1 }}
                  onClick={() => setIsCustomizationModalOpen(true)}
                  className="w-full relative overflow-hidden text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-sm sm:text-base"
                  style={{
                    background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                    boxShadow: "0 8px 16px rgba(168,85,247,0.3), 0 12px 32px rgba(236,72,153,0.25), inset 0 -4px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-40"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                      width: "50%",
                    }}
                  />
                  <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                    <WrenchScrewdriverIcon className="w-5 h-5 relative z-10" />
                  </motion.div>
                  <span className="relative z-10 hidden sm:inline">Customize This Product</span>
                  <span className="relative z-10 sm:hidden">Customize</span>
                </motion.button>
              )}
            </div>

            {/* Variant Selector */}
            {product.variants.length > 0 && selectedVariant && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Selected Variant</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVariant.attributeValues.map((attrValue) => (
                      <div
                        key={attrValue.id}
                        className="bg-[#e8ecf0] px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-gray-900"
                        style={{ boxShadow: "inset 2px 2px 4px #c5cdd5, inset -2px -2px 4px #ffffff" }}
                      >
                        <span className="text-gray-600 capitalize">{attrValue.attribute.name}:</span>{" "}
                        <span className="font-semibold capitalize">{attrValue.attributeOption.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <VariantSelector
                    variants={product.variants}
                    selectedVariant={selectedVariant}
                    onVariantChange={setSelectedVariant}
                  />
                </div>
              </motion.div>
            )}

            {/* Quantity Selector */}
            {selectedVariant && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Quantity</h4>
                <div className="flex items-center gap-4">
                  <div
                    className="flex items-center bg-[#e8ecf0] rounded-xl"
                    style={{ boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff" }}
                  >
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 sm:p-3 hover:bg-gray-200/20 rounded-l-xl transition-colors"
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <MinusIcon className="w-4 h-4 text-gray-700" />
                    </motion.button>
                    <span className="px-4 sm:px-6 py-2 font-semibold text-gray-900 min-w-[50px] sm:min-w-[60px] text-center text-sm sm:text-base">
                      {quantity}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                      className="p-2 sm:p-3 hover:bg-gray-200/20 rounded-r-xl transition-colors"
                      disabled={quantity >= currentStock || !canPurchase}
                      aria-label="Increase quantity"
                    >
                      <PlusIcon className="w-4 h-4 text-gray-700" />
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            {/* Business Info */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-[#e8ecf0] rounded-2xl p-4"
              style={{ boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff" }}
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">{product.business.name}</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5 truncate">
                    {product.business.city}, {product.business.state}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">GST: {product.business.gstNumber}</p>
                </div>
                {product.business.isVerified && (
                  <div className="flex items-center gap-1.5 text-green-700 bg-white/40 px-3 py-1.5 rounded-full border-2 border-green-500 flex-shrink-0">
                    <ShieldCheckIcon className="w-4 h-4" />
                    <span className="text-xs font-semibold">Verified</span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#e8ecf0] rounded-2xl"
          style={{ boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff" }}
        >
          <div className="border-b border-gray-300/30 overflow-x-auto">
            <nav className="-mb-px flex space-x-6 px-4 sm:px-6 min-w-min" aria-label="Tabs">
              {[
                { id: "description", label: "Description" },
                { id: "specs", label: "Specifications" },
                { id: "reviews", label: `Reviews (${reviews.length})` },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                    activeTab === tab.id
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </motion.button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "description" && (
                  <div className="prose max-w-none text-gray-700 text-sm sm:text-base">
                    <div dangerouslySetInnerHTML={{ __html: product.description || "No description available." }} />
                  </div>
                )}

                {activeTab === "specs" && (
                  <div className="space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Specifications</h3>
                    {selectedVariant ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-medium border-b border-gray-300/30 pb-2 text-gray-900 text-sm sm:text-base">
                            Product Details
                          </h4>
                          <dl className="space-y-2 text-sm">
                            <div className="flex justify-between gap-4">
                              <dt className="text-gray-600">SKU</dt>
                              <dd className="font-medium text-gray-900 text-right">{selectedVariant.sku}</dd>
                            </div>
                            <div className="flex justify-between gap-4">
                              <dt className="text-gray-600">Stock</dt>
                              <dd className="font-medium text-gray-900 text-right">{selectedVariant.stock} units</dd>
                            </div>
                            {selectedVariant.hsnCode && (
                              <div className="flex justify-between gap-4">
                                <dt className="text-gray-600">HSN Code</dt>
                                <dd className="font-medium text-gray-900 text-right">{selectedVariant.hsnCode}</dd>
                              </div>
                            )}
                          </dl>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium border-b border-gray-300/30 pb-2 text-gray-900 text-sm sm:text-base">
                            Variant Attributes
                          </h4>
                          <dl className="space-y-2 text-sm">
                            {selectedVariant.attributeValues.map((attrValue) => (
                              <div key={attrValue.id} className="flex justify-between gap-4">
                                <dt className="text-gray-600 capitalize">{attrValue.attribute.name}</dt>
                                <dd className="font-medium text-gray-900 capitalize text-right">
                                  {attrValue.attributeOption.value}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm">Select a variant to view specifications.</p>
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    {reviews.length > 0 ? (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Customer Reviews</h3>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <StarSolid
                                    key={star}
                                    className={`w-5 h-5 ${parseFloat(averageRating) >= star ? "text-amber-400" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600 font-medium">{averageRating} out of 5</span>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => (window.location.href = "/orders")}
                            className="bg-gray-900 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-sm text-sm"
                          >
                            Write a Review
                          </motion.button>
                        </div>

                        <div className="space-y-4">
                          {reviews.map((review) => (
                            <motion.div
                              key={review.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-white/40 rounded-2xl p-4 sm:p-6"
                              style={{ boxShadow: "4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff" }}
                            >
                              <div className="flex items-start gap-3 sm:gap-4">
                                {review.customerUser.picture ? (
                                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 relative">
                                    <Image
                                      src={review.customerUser.picture}
                                      alt={review.customerUser.name}
                                      fill
                                      className="object-cover"
                                      sizes="(max-width: 640px) 40px, 48px"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                                    <UserCircleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 flex-wrap">
                                    <div className="min-w-0">
                                      <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                        {review.customerUser.name}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <div className="flex">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <StarSolid
                                              key={star}
                                              className={`w-4 h-4 ${star <= review.rating ? "text-amber-400" : "text-gray-300"}`}
                                            />
                                          ))}
                                        </div>
                                        <span className="text-xs text-gray-500">
                                          {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  {review.title && (
                                    <h4 className="font-semibold text-gray-900 mt-3 text-sm sm:text-base">
                                      {review.title}
                                    </h4>
                                  )}
                                  {review.comment && (
                                    <p className="text-gray-700 mt-2 text-sm sm:text-base break-words">
                                      {review.comment}
                                    </p>
                                  )}
                                  {review.images && review.images.length > 0 && (
                                    <div className="flex gap-2 mt-3 overflow-x-auto">
                                      {review.images.map((image, idx) => (
                                        <div
                                          key={idx}
                                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 relative"
                                        >
                                          <Image
                                            src={image}
                                            alt={`Review image ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 80px, 96px"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 sm:py-12">
                        <StarIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-6">Be the first to review this product!</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => (window.location.href = "/orders")}
                          className="bg-gray-900 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-sm text-sm"
                        >
                          Write a Review
                        </motion.button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Modals & Bottom Sections */}
      {product && (
        <CustomizationModal
          isOpen={isCustomizationModalOpen}
          onClose={() => setIsCustomizationModalOpen(false)}
          product={product}
          selectedVariant={selectedVariant}
        />
      )}
      {!loading && product && <SimilarProducts slug={product.slug} currentProductId={product.id} />}
      {!loading && product && <RecentlyViewed />}
      {!loading && product && <InYourWishlist />}
    </div>
  );
}
