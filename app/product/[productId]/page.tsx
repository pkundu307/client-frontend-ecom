"use client";
import React, { use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";

// Icons
import {
  StarIcon,
  HeartIcon,
  ShareIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  TruckIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  CheckCircleIcon,

} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from "@heroicons/react/24/solid";

// Components
import ImageGallery from "./(component)/ImageGallery";
import VariantSelector from "./(component)/VariantSelector";

// Hooks & Types
import { useProductDetails } from "../hooks/useProductDetails";
import type { TabId } from "../hooks/useProductDetails";

const CustomizationModal = dynamic(() => import("./(component)/CustomizationModal"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="text-white text-lg font-semibold">Loading Customizer...</div>
    </div>
  ),
});

// =============================================
// MAIN COMPONENT
// =============================================
interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params instanceof Promise ? params : Promise.resolve(params));
  const { productId } = resolvedParams;

  const {
    // State
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

    // Computed
    currentImages,
    currentPrice,
    currentMrp,
    currentStock,
    discountPercentage,
    isCurrentVariantActive,
    isCurrentVariantInStock,
    canPurchase,
    breadcrumbPath,

    // Handlers
    handleToggleWishlist,
    handleAddToCart,
  } = useProductDetails(productId);

  // Loading State
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

  // Error State
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-500 mb-8"
          aria-label="Breadcrumb"
        >
          <div className="flex items-center gap-2">
            <span className="hover:text-gray-700 transition-colors cursor-pointer">Home</span>
            <span className="text-gray-300">/</span>
            <span className="hover:text-gray-700 transition-colors cursor-pointer">{breadcrumbPath}</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">
              {product.title.length > 13 ? product.title.slice(0, 20) : product.title}
            </span>
          </div>
        </motion.nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Image Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <ImageGallery images={currentImages} productTitle={product.title} />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="space-y-4">
              {/* Title and Action Buttons */}
              <div className="flex items-start justify-between gap-3">
                <h1 className="flex-1 text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight break-words overflow-hidden">
                  {product.title.length > 13 ? product.title.slice(0, 30) : product.title}
                </h1>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleToggleWishlist}
                    disabled={isTogglingWishlist}
                    className="p-2 sm:p-2.5 rounded-xl bg-[#e8ecf0] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      boxShadow: "4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff",
                    }}
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
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 sm:p-2.5 rounded-xl bg-[#e8ecf0]"
                    style={{
                      boxShadow: "4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff",
                    }}
                    aria-label="Share product"
                  >
                    <ShareIcon className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {product.isCustomizable && (
                  <div
                    className="inline-flex items-center gap-1.5 bg-white text-purple-700 px-3 py-1.5 rounded-full text-xs font-bold border-2 border-purple-500"
                    style={{
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(255, 255, 255, 0.6) inset",
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
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(255, 255, 255, 0.6) inset",
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
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(255, 255, 255, 0.6) inset",
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
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(255, 255, 255, 0.6) inset",
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
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(255, 255, 255, 0.6) inset",
                      backgroundImage: "linear-gradient(to top, rgba(255,255,255,0.4), rgba(255,255,255,0))",
                    }}
                  >
                    Out of Stock
                  </div>
                )}
              </div>
            </div>

            {/* Business Info */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-[#e8ecf0] rounded-2xl p-4"
              style={{
                boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-gray-900">{product.business.name}</p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {product.business.city}, {product.business.state}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">GST: {product.business.gstNumber}</p>
                </div>
                {product.business.isVerified && (
                  <div className="flex items-center gap-1.5 text-green-700 bg-white/40 px-3 py-1.5 rounded-full border-2 border-green-500">
                    <ShieldCheckIcon className="w-4 h-4" />
                    <span className="text-xs font-semibold">Verified</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarSolid key={star} className="w-5 h-5 text-amber-400" />
                ))}
              </div>
              <span className="text-sm text-gray-600 font-medium">({product.reviews.length} reviews)</span>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl lg:text-5xl font-bold text-gray-900">
                  ₹{Number(currentPrice).toLocaleString("en-IN")}
                </span>
                {currentMrp !== "0" && parseFloat(currentMrp) > parseFloat(currentPrice) && (
                  <span className="text-xl text-gray-400 line-through">
                    ₹{Number(currentMrp).toLocaleString("en-IN")}
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span
                    className="bg-white/40 backdrop-blur-xl text-red-700 px-3 py-1.5 rounded-full text-sm font-bold border-2 border-red-500"
                    style={{
                      boxShadow: "0 2px 4px rgba(239, 68, 68, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">Inclusive of all taxes</p>
            </div>

            {/* Variant Selector */}
            {product.variants.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <VariantSelector
                  variants={product.variants}
                  selectedVariant={selectedVariant}
                  onVariantChange={setSelectedVariant}
                />
              </motion.div>
            )}

            {/* Quantity Selector */}
            {selectedVariant && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Quantity</h4>
                <div className="flex items-center gap-4">
                  <div
                    className="flex items-center bg-[#e8ecf0] rounded-xl"
                    style={{
                      boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                    }}
                  >
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-gray-200/20 rounded-l-xl transition-colors"
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <MinusIcon className="w-4 h-4 text-gray-700" />
                    </motion.button>
                    <span className="px-6 py-2 font-semibold text-gray-900 min-w-[60px] text-center">{quantity}</span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                      className="p-3 hover:bg-gray-200/20 rounded-r-xl transition-colors"
                      disabled={quantity >= currentStock || !canPurchase}
                      aria-label="Increase quantity"
                    >
                      <PlusIcon className="w-4 h-4 text-gray-700" />
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              {!canPurchase && selectedVariant && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/40 backdrop-blur-xl border-2 border-yellow-500 rounded-2xl p-3"
                  style={{
                    boxShadow: "0 4px 8px rgba(234, 179, 8, 0.2), 0 8px 16px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <p className="text-yellow-700 text-sm font-medium text-center">
                    This variant is currently{" "}
                    {isCurrentVariantInStock ? "not available for purchase" : "out of stock"}.
                  </p>
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{
                    scale: canPurchase && localStorage.getItem("token") ? 1.02 : 1,
                    y: canPurchase && localStorage.getItem("token") ? -2 : 0,
                  }}
                  whileTap={{
                    scale: canPurchase && localStorage.getItem("token") ? 0.98 : 1,
                    y: canPurchase && localStorage.getItem("token") ? 1 : 0,
                  }}
                  onClick={handleAddToCart}
                  disabled={!canPurchase || isAddingToCart || !localStorage.getItem("token")}
                  className={`flex-1 py-4 px-6 rounded-2xl font-bold transition-all duration-200 ease-out flex items-center justify-center gap-2 transform motion-safe:hover:scale-[1.03] motion-safe:active:scale-[0.97] ${
                    isAddingToCart
                      ? "bg-[#e8ecf0] cursor-wait text-gray-600"
                      : localStorage.getItem("token") && canPurchase
                      ? "bg-gray-900 text-white shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30"
                      : "bg-[#e8ecf0] text-gray-500 cursor-not-allowed"
                  }`}
                  style={
                    !isAddingToCart && (!localStorage.getItem("token") || !canPurchase)
                      ? {
                          boxShadow:
                            "inset 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 -2px 4px rgba(255, 255, 255, 0.5), 0 0 6px rgba(0, 0, 0, 0.05)",
                        }
                      : localStorage.getItem("token") && canPurchase
                      ? {
                          boxShadow:
                            "0 8px 16px rgba(0, 0, 0, 0.2), 0 12px 32px rgba(0, 0, 0, 0.15), inset 0 -4px 8px rgba(0, 0, 0, 0.3), 0 0 12px rgba(255, 255, 255, 0.1)",
                        }
                      : {
                          boxShadow:
                            "inset 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 -2px 4px rgba(255, 255, 255, 0.5), 0 0 6px rgba(0, 0, 0, 0.05)",
                        }
                  }
                >
                  {isAddingToCart ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCartIcon className="w-5 h-5" />
                      {localStorage.getItem("token") ? "Add to Cart" : "Login to Add"}
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{
                    scale: canPurchase ? 1.02 : 1,
                    y: canPurchase ? -2 : 0,
                  }}
                  whileTap={{
                    scale: canPurchase ? 0.98 : 1,
                    y: canPurchase ? 1 : 0,
                  }}
                  disabled={!canPurchase}
                  className={`flex-1 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                    canPurchase ? "bg-orange-500 text-white" : "bg-[#e8ecf0] text-gray-500 cursor-not-allowed"
                  }`}
                  style={
                    canPurchase
                      ? {
                          boxShadow:
                            "0 8px 16px rgba(249, 115, 22, 0.3), 0 12px 32px rgba(249, 115, 22, 0.2), inset 0 -4px 8px rgba(0, 0, 0, 0.2)",
                        }
                      : {
                          boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 -2px 4px rgba(255, 255, 255, 0.5)",
                        }
                  }
                >
                  <CreditCardIcon className="w-5 h-5" />
                  Buy Now
                </motion.button>
              </div>

              {product.isCustomizable && (
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.98,
                    y: 1,
                  }}
                  onClick={() => setIsCustomizationModalOpen(true)}
                  className="w-full relative overflow-hidden text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                    boxShadow:
                      "0 8px 16px rgba(168, 85, 247, 0.3), 0 12px 32px rgba(236, 72, 153, 0.25), inset 0 -4px 8px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-40"
                    animate={{
                      x: ["-100%", "200%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)",
                      width: "50%",
                    }}
                  />

                  <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                    <WrenchScrewdriverIcon className="w-5 h-5 relative z-10" />
                  </motion.div>
                  <span className="relative z-10">Customize This Product</span>
                </motion.button>
              )}
            </div>

            {/* Delivery Info */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-[#e8ecf0] rounded-2xl p-4"
              style={{
                boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff",
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <TruckIcon className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Delivery Information</span>
              </div>
              <ul className="text-sm text-blue-800 space-y-1.5 ml-8 list-disc">
                <li>Free delivery on orders above ₹500</li>
                <li>Standard delivery: 3-5 business days</li>
                <li>Express delivery available</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#e8ecf0] rounded-2xl"
          style={{
            boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
          }}
        >
          <div className="border-b border-gray-300/30">
            <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
              {[
                { id: "description", label: "Description" },
                { id: "specs", label: "Specifications" },
                { id: "reviews", label: `Reviews (${product.reviews.length})` },
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

          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "description" && (
                  <div className="prose max-w-none text-gray-700">
                    <div dangerouslySetInnerHTML={{ __html: product.description || "No description available." }} />
                  </div>
                )}

                {activeTab === "specs" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
                    {selectedVariant ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-medium border-b border-gray-300/30 pb-2 text-gray-900">Product Details</h4>
                          <dl className="space-y-2">
                            <div className="flex justify-between">
                              <dt className="text-gray-600">SKU</dt>
                              <dd className="font-medium text-gray-900">{selectedVariant.sku}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-600">Stock</dt>
                              <dd className="font-medium text-gray-900">{selectedVariant.stock} units</dd>
                            </div>
                            {selectedVariant.hsnCode && (
                              <div className="flex justify-between">
                                <dt className="text-gray-600">HSN Code</dt>
                                <dd className="font-medium text-gray-900">{selectedVariant.hsnCode}</dd>
                              </div>
                            )}
                          </dl>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium border-b border-gray-300/30 pb-2 text-gray-900">
                            Variant Attributes
                          </h4>
                          <dl className="space-y-2">
                            {selectedVariant.attributeValues.map((attrValue) => (
                              <div key={attrValue.id} className="flex justify-between">
                                <dt className="text-gray-600 capitalize">{attrValue.attribute.name}</dt>
                                <dd className="font-medium text-gray-900 capitalize">{attrValue.attributeOption.value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600">Select a variant to view specifications.</p>
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="text-center py-12">
                    <StarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-gray-600 mb-6">Be the first to review this product!</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-sm"
                    >
                      Write a Review
                    </motion.button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Customization Modal */}
      {product && (
        <CustomizationModal
          isOpen={isCustomizationModalOpen}
          onClose={() => setIsCustomizationModalOpen(false)}
          product={product}
          selectedVariant={selectedVariant}
        />
      )}
    </div>
  );
}
