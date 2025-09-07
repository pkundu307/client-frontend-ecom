"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { use } from "react";
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
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from "@heroicons/react/24/solid";
import Image from "next/image";

// Types based on your API response
interface AttributeOption {
  id: number;
  value: string;
  slug: string;
}

interface Attribute {
  id: number;
  name: string;
}

interface AttributeValue {
  id: number;
  variantId: string;
  attributeOptionId: number;
  attributeId: number;
  attributeOption: AttributeOption;
  attribute: Attribute;
}

interface Variant {
  id: string;
  sku: string;
  price: string;
  stock: number;
  isDefault: boolean;
  weightInGrams: number | null;
  images: string[];
  createdAt: string;
  updatedAt: string;
  status: "ACTIVE" | "DRAFT";
  hsnCode: string;
  sacCode: string | null;
  mrp: string;
  purchasePrice: string | null;
  purchasePriceType: string | null;
  sellingPriceType: string | null;
  description: string | null;
  tax: string | null;
  unit: string | null;
  isMinStockAlertEnabled: boolean | null;
  minStockCount: number | null;
  openingStock: number | null;
  openingStockDate: string | null;
  productId: string;
  attributeValues: AttributeValue[];
}

interface Business {
  id: string;
  name: string;
  gstNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  isVerified: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  parent?: {
    id: number;
    name: string;
    slug: string;
  };
}

interface ProductDetails {
  id: string;
  title: string;
  description: string;
  isCustomizable: boolean;
  images: string[];
  isPublished: boolean;
  publishDate: string | null;
  isFeatured: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
  businessId: string;
  categoryId: number;
  model3dUrl: string | null;
  customizationConfig: any | null;
  business: Business;
  category: Category;
  variants: Variant[];
  reviews: any[];
}

// API call function
const fetchProductDetails = async (productId: string): Promise<ProductDetails> => {
  const response = await fetch(`https://krg7j44d-3001.inc1.devtunnels.ms/products/public/${productId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch product details: ${response.status} ${response.statusText}`);
  }
  return await response.json();
};

// Image Gallery Component
const ImageGallery = ({ images, productTitle }: { images: string[]; productTitle: string }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reset current image index when images change
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-200 rounded-xl flex items-center justify-center">
        <span className="text-gray-500">No image available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="aspect-square relative bg-gray-100 rounded-xl overflow-hidden cursor-pointer"
          onClick={() => setIsFullscreen(true)}
        >
          <Image
            src={images[currentImageIndex]}
            alt={`${productTitle} - Image ${currentImageIndex + 1}`}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-product.jpg"; // Fallback image
            }}
          />
        </motion.div>
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal from opening
                setCurrentImageIndex(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg z-10"
              aria-label="Previous image"
            >
              <MinusIcon className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal from opening
                setCurrentImageIndex(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg z-10"
              aria-label="Next image"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                index === currentImageIndex ? "border-[var(--royal-gold)]" : "border-gray-200"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${productTitle} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-product.jpg"; // Fallback image
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setIsFullscreen(false)} // Close on background click
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
              aria-label="Close fullscreen"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
            <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}> {/* Prevent modal closure on image click */}
              <Image
                src={images[currentImageIndex]}
                alt={`${productTitle} - Fullscreen`}
                width={800} // Adjust based on common screen sizes
                height={600} // Adjust based on common screen sizes
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-product.jpg"; // Fallback image
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Variant Selector Component
const VariantSelector = ({ 
  variants, 
  selectedVariant, 
  onVariantChange 
}: { 
  variants: Variant[]; 
  selectedVariant: Variant | null; 
  onVariantChange: (variant: Variant) => void; 
}) => {
  // Memoize attribute groups extraction for performance and consistent order
  const allAttributeGroups = useMemo(() => {
    const allAttributesMap = variants.reduce((acc, variant) => {
      variant.attributeValues.forEach(({ attribute, attributeOption }) => {
        if (!acc[attribute.id]) {
          acc[attribute.id] = { 
            attributeName: attribute.name, 
            options: new Map<number, AttributeOption>() 
          };
        }
        acc[attribute.id].options.set(attributeOption.id, attributeOption);
      });
      return acc;
    }, {} as { [attributeId: number]: { attributeName: string; options: Map<number, AttributeOption> } });

    return Object.values(allAttributesMap)
      .map(group => ({
        name: group.attributeName,
        options: Array.from(group.options.values()).sort((a, b) => a.value.localeCompare(b.value)), // Sort options
      }))
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort attribute groups
  }, [variants]);

  // Internal state to track currently selected options for each attribute type by ID
  const [currentSelections, setCurrentSelections] = useState<{ [attributeName: string]: number | null }>({});

  // Effect to update internal state when selectedVariant prop changes (e.g., on initial load or if parent forces a variant)
  useEffect(() => {
    if (selectedVariant) {
      const newSelections: { [attributeName: string]: number | null } = {};
      selectedVariant.attributeValues.forEach(av => {
        newSelections[av.attribute.name] = av.attributeOption.id;
      });
      setCurrentSelections(newSelections);
    } else {
      setCurrentSelections({});
    }
  }, [selectedVariant]);

  // Helper to find the "best" variant that matches current selections (or closest)
  const findBestMatchingVariant = useCallback((selectionIds: { [attributeName: string]: number | null }): Variant | null => {
    let bestMatch: Variant | null = null;
    let bestMatchCount = -1; // Number of explicitly selected attributes matched
    let bestScore = -1; // Additional score for status, default, stock

    for (const variant of variants) {
        let currentMatchCount = 0;
        let isValidCandidate = true; // Flag to ensure all explicit selections are met by this variant
        let currentVariantAttrMap = new Map<string, number>();
        variant.attributeValues.forEach(av => currentVariantAttrMap.set(av.attribute.name, av.attributeOption.id));


        // Check how many of the user's explicit (non-null) selections this variant matches
        for (const [attrName, selectedOptionId] of Object.entries(selectionIds)) {
            if (selectedOptionId !== null) { // If user has explicitly selected this attribute
                if (currentVariantAttrMap.get(attrName) === selectedOptionId) {
                    currentMatchCount++;
                } else {
                    // This variant does NOT match an explicit selection, so it's not a valid candidate for "best match"
                    isValidCandidate = false;
                    break; 
                }
            }
        }

        if (!isValidCandidate) {
            continue; // Skip this variant if it doesn't match all explicit (non-null) selections
        }

        // Apply secondary scoring for non-attribute preferences (status, default, stock)
        let currentScore = 0;
        if (variant.status === "ACTIVE") currentScore += 100;
        if (variant.isDefault) currentScore += 50;
        if (variant.stock > 0) currentScore += 20;

        // Decision logic:
        // 1. Prioritize by matching more of the explicit selections.
        // 2. Then, prioritize by status, default, stock score.
        if (currentMatchCount > bestMatchCount) {
            bestMatchCount = currentMatchCount;
            bestScore = currentScore;
            bestMatch = variant;
        } else if (currentMatchCount === bestMatchCount) {
            if (currentScore > bestScore) { // Tie-break with secondary score
                bestScore = currentScore;
                bestMatch = variant;
            }
        }
    }
    
    // Fallback if no selections or no good match was found from above (e.g. initial load logic if selectionIds is all null)
    if (!bestMatch && variants.length > 0) {
        // Find the "best" default variant from ALL variants
        let fallbackVariant: Variant | null = null;
        fallbackVariant = variants.find(v => v.isDefault && v.status === "ACTIVE" && v.stock > 0);
        if (!fallbackVariant) fallbackVariant = variants.find(v => v.status === "ACTIVE" && v.stock > 0);
        if (!fallbackVariant) fallbackVariant = variants.find(v => v.status === "ACTIVE");
        if (!fallbackVariant) fallbackVariant = variants.find(v => v.isDefault);
        if (!fallbackVariant) fallbackVariant = variants[0]; // Last resort, just the first variant
        bestMatch = fallbackVariant;
    }

    return bestMatch;
  }, [variants]);

  // Helper to determine if an option is clickable/enabled given a potential set of selections
  const checkIsOptionEnabled = useCallback((
    attrNameBeingChecked: string, 
    optionIdBeingChecked: number, 
    baseSelections: { [attributeName: string]: number | null }
  ): boolean => {
      // Create a temporary selection set that includes the option being evaluated
      const potentialSelectionsForCheck = { ...baseSelections, [attrNameBeingChecked]: optionIdBeingChecked };

      // Check if ANY variant exists that matches all non-null options in potentialSelectionsForCheck
      return variants.some(variant => {
          const variantAttrMap = new Map<string, number>();
          variant.attributeValues.forEach(av => variantAttrMap.set(av.attribute.name, av.attributeOption.id));

          return Object.entries(potentialSelectionsForCheck).every(([attrName, selectedOptionId]) => {
              if (selectedOptionId === null) return true; // Treat null selections as wildcards for checking combinability
              return variantAttrMap.get(attrName) === selectedOptionId;
          });
      });
  }, [variants]);


  const handleAttributeChange = useCallback((attributeName: string, option: AttributeOption) => {
    // 1. Determine new explicit selection for the clicked attribute
    const isCurrentlySelected = currentSelections[attributeName] === option.id;
    const newClickedSelectionId = isCurrentlySelected ? null : option.id; // Allow deselection

    let updatedSelections: { [attributeName: string]: number | null } = {
        ...currentSelections,
        [attributeName]: newClickedSelectionId,
    };

    // 2. "Clean" other selections if they become impossible with the new clicked selection
    for (const attrGroup of allAttributeGroups) { // Iterate through all attribute types
        const otherAttrName = attrGroup.name;
        if (otherAttrName === attributeName) continue; // Skip the attribute that was just clicked

        const otherSelectedOptionId = updatedSelections[otherAttrName];
        
        if (otherSelectedOptionId !== null) { // If there's an existing selection for this other attribute
            // Check if this existing selection is still valid/enabled given the `updatedSelections`
            // (especially considering the `newClickedSelectionId` for `attributeName`)
            const isOtherOptionStillEnabled = checkIsOptionEnabled(
                otherAttrName, 
                otherSelectedOptionId, 
                updatedSelections // Pass the potentially updated selections (including the new click)
            );

            if (!isOtherOptionStillEnabled) {
                updatedSelections[otherAttrName] = null; // Clear the impossible selection
            }
        }
    }

    // 3. Update internal state with the cleaned selections
    setCurrentSelections(updatedSelections);

    // 4. Find the best variant based on these (cleaned) selections
    const bestVariant = findBestMatchingVariant(updatedSelections);

    if (bestVariant) {
        onVariantChange(bestVariant);
    } else if (variants.length > 0) {
        // Fallback: if even after cleaning, no variant perfectly matches,
        // revert to the product's overall best default or first available.
        // This scenario should be rare if checkIsOptionEnabled prevents truly impossible selections.
        // This logic mirrors the fallback in findBestMatchingVariant to ensure `onVariantChange` is always called
        let fallbackVariant: Variant | null = null;
        fallbackVariant = variants.find(v => v.isDefault && v.status === "ACTIVE" && v.stock > 0);
        if (!fallbackVariant) fallbackVariant = variants.find(v => v.status === "ACTIVE" && v.stock > 0);
        if (!fallbackVariant) fallbackVariant = variants.find(v => v.status === "ACTIVE");
        if (!fallbackVariant) fallbackVariant = variants.find(v => v.isDefault);
        if (!fallbackVariant) fallbackVariant = variants[0];
        
        if (fallbackVariant) {
            onVariantChange(fallbackVariant);
        }
    }

  }, [currentSelections, allAttributeGroups, checkIsOptionEnabled, findBestMatchingVariant, variants, onVariantChange]);

  // `getIsOptionEnabledForRender` for button rendering needs to use `currentSelections` from state
  const getIsOptionEnabledForRender = useCallback((attrName: string, optionId: number): boolean => {
    return checkIsOptionEnabled(attrName, optionId, currentSelections);
  }, [checkIsOptionEnabled, currentSelections]);

  if (allAttributeGroups.length === 0) {
    return null; // No attributes to display
  }

  return (
    <div className="space-y-6">
      {allAttributeGroups.map(({ name: attributeName, options }) => {
        const currentSelectedOptionId = currentSelections[attributeName];
        const currentSelectedOption = options.find(o => o.id === currentSelectedOptionId);
        
        return (
          <div key={attributeName}>
            <h4 className="font-medium text-gray-900 mb-3 capitalize">
              {attributeName}: <span className="text-[var(--royal-gold)]">{currentSelectedOption?.value || "Select"}</span>
            </h4>
            <div className="flex flex-wrap gap-3">
              {options.map((option) => {
                const isSelected = currentSelectedOptionId === option.id;
                const isEnabled = getIsOptionEnabledForRender(attributeName, option.id);

                // Get variant info for badges if enabled
                let targetVariantInfo: { status: "ACTIVE" | "DRAFT"; stock: number } | null = null;
                if (isEnabled) {
                    // Temporarily create a potential selection to find the *exact* variant if this option were selected
                    // This uses the "cleaned" currentSelections + the option being evaluated for a precise match
                    const tempSelections = { ...currentSelections, [attributeName]: option.id };
                    const variantForOption = findBestMatchingVariant(tempSelections); // Use the robust finder
                    if (variantForOption) {
                        targetVariantInfo = { status: variantForOption.status, stock: variantForOption.stock };
                    }
                }
                
                const isActiveVariant = targetVariantInfo?.status === "ACTIVE";
                const isOutOfStock = targetVariantInfo && targetVariantInfo.stock === 0;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleAttributeChange(attributeName, option)}
                    disabled={!isEnabled}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all capitalize relative 
                      ${isSelected 
                        ? "border-[var(--royal-gold)] bg-[var(--royal-gold)] text-white" 
                        : isEnabled
                          ? isOutOfStock
                            ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" // Enabled but Out of Stock
                            : "border-gray-300 hover:border-[var(--royal-gold)] text-gray-700"
                          : "border-gray-200 text-gray-400 cursor-not-allowed opacity-50" // Not enabled (impossible combination)
                      }
                    `}
                    aria-pressed={isSelected}
                    aria-label={`${attributeName} ${option.value}`}
                  >
                    {option.value}
                    {isEnabled && targetVariantInfo && !isActiveVariant && (
                      <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs px-1 rounded-full">
                        Draft
                      </span>
                    )}
                    {isEnabled && targetVariantInfo && isOutOfStock && !isSelected && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                        OOS
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Main Product Details Component
const ProductDetailsPage = ({ params }: { params: Promise<{ productId: string }> }) => {
  const { productId } = use(params);
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await fetchProductDetails(productId);
        setProduct(productData);
        
        // Set default variant with a specific priority
        let defaultVariant: Variant | null = null;
        
        // 1. Try to find an ACTIVE variant that is explicitly marked as default and in stock
        defaultVariant = productData.variants.find(v => v.isDefault && v.status === "ACTIVE" && v.stock > 0) || null;
        
        // 2. If no explicit active default, try to find any ACTIVE variant that is in stock
        if (!defaultVariant) {
          defaultVariant = productData.variants.find(v => v.status === "ACTIVE" && v.stock > 0) || null;
        }

        // 3. If no active in-stock variant, try to find any ACTIVE variant (even if out of stock)
        if (!defaultVariant) {
          defaultVariant = productData.variants.find(v => v.status === "ACTIVE") || null;
        }
        
        // 4. If still no active variant, try to find any variant marked as default (even if DRAFT or OOS)
        if (!defaultVariant) {
          defaultVariant = productData.variants.find(v => v.isDefault) || null;
        }
        
        // 5. If still no default or active variant, just take the first available variant
        if (!defaultVariant && productData.variants.length > 0) {
          defaultVariant = productData.variants[0];
        }
        
        setSelectedVariant(defaultVariant);
        setError(null);
      } catch (err) {
        console.error("Error loading product:", err);
        setError(err instanceof Error ? err.message : "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error || "Product not found."}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[var(--royal-gold)] text-white px-6 py-2 rounded-lg hover:bg-[var(--royal-gold)]/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Get current variant details or fallback to product defaults / zeroes
  const currentImages = selectedVariant?.images?.length 
    ? selectedVariant.images 
    : product.images?.length 
    ? product.images 
    : [];
    
  const currentPrice = selectedVariant?.price || "0";
  const currentMrp = selectedVariant?.mrp || "0";
  const currentStock = selectedVariant?.stock || 0;
  
  const discountPercentage = currentMrp !== "0" && parseFloat(currentMrp) > parseFloat(currentPrice)
    ? Math.round(((parseFloat(currentMrp) - parseFloat(currentPrice)) / parseFloat(currentMrp)) * 100)
    : 0;

  const breadcrumbPath = product.category.parent 
    ? `${product.category.parent.name} / ${product.category.name}`
    : product.category.name;

  // Check if current variant is active and in stock
  const isCurrentVariantActive = selectedVariant?.status === "ACTIVE";
  const isCurrentVariantInStock = currentStock > 0;
  const canPurchase = isCurrentVariantActive && isCurrentVariantInStock;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span>{breadcrumbPath}</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Image Gallery */}
          <div>
            <ImageGallery images={currentImages} productTitle={product.title} />
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Product Title & Badges */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="p-2 rounded-full border border-gray-300 hover:border-red-500 transition-colors"
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {isWishlisted ? (
                      <HeartSolid className="w-6 h-6 text-red-500" />
                    ) : (
                      <HeartIcon className="w-6 h-6 text-gray-600" />
                    )}
                  </button>
                  <button className="p-2 rounded-full border border-gray-300 hover:border-gray-400 transition-colors" aria-label="Share product">
                    <ShareIcon className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {product.isCustomizable && (
                  <div className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    <SparklesIcon className="w-4 h-4" />
                    <span>Customizable</span>
                  </div>
                )}
                {product.isFeatured && (
                  <span className="bg-[var(--royal-gold)] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </span>
                )}
                {selectedVariant && !isCurrentVariantActive && (
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Draft Product
                  </span>
                )}
                {isCurrentVariantInStock ? (
                  <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <CheckCircleIcon className="w-4 h-4" />
                    In Stock ({currentStock} available)
                  </span>
                ) : (
                  <span className="text-red-600 text-sm font-medium">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Business Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-[var(--royal-gold)]">{product.business.name}</p>
                  <p className="text-sm text-gray-600">{product.business.city}, {product.business.state}</p>
                  <p className="text-xs text-gray-500">GST: {product.business.gstNumber}</p>
                </div>
                {product.business.isVerified && (
                  <div className="flex items-center gap-1 text-green-600">
                    <ShieldCheckIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarSolid key={star} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-600">({product.reviews.length} reviews)</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-[var(--royal-green)]">₹{currentPrice}</span>
                {currentMrp !== "0" && parseFloat(currentMrp) > parseFloat(currentPrice) && (
                  <span className="text-xl text-gray-500 line-through">₹{currentMrp}</span>
                )}
                {discountPercentage > 0 && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                    -{discountPercentage}% OFF
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">Price inclusive of all taxes</p>
            </div>

            {/* Variant Selection */}
            {product.variants.length > 0 && ( // Render selector even if only one variant, but only if there are attributes
              <VariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onVariantChange={setSelectedVariant}
              />
            )}

            {/* Quantity Selection */}
            {selectedVariant && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Quantity</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100 rounded-l-lg"
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                      className="p-2 hover:bg-gray-100 rounded-r-lg"
                      disabled={quantity >= currentStock || !canPurchase}
                      aria-label="Increase quantity"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">Maximum {currentStock} items</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              {!canPurchase && selectedVariant && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-800 text-sm">
                    This variant is currently {isCurrentVariantInStock ? "in draft mode" : "out of stock"} and cannot be purchased.
                  </p>
                </div>
              )}
              
              <div className="flex gap-4">
                <button
                  disabled={!canPurchase}
                  className="flex-1 bg-[var(--royal-gold)] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[var(--royal-gold)]/90 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  disabled={!canPurchase}
                  className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CreditCardIcon className="w-5 h-5" />
                  Buy Now
                </button>
              </div>
              
              {product.isCustomizable && (
                <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 flex items-center justify-center gap-2">
                  <WrenchScrewdriverIcon className="w-5 h-5" />
                  Customize This Product
                </button>
              )}
            </div>

            {/* Delivery Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <TruckIcon className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Delivery Information</span>
              </div>
              <ul className="text-sm text-blue-800 space-y-1 ml-8 list-disc">
                <li>Free delivery on orders above ₹500</li>
                <li>Standard delivery: 3-5 business days</li>
                <li>Express delivery: 1-2 business days</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {[
                { id: "description", label: "Description" },
                { id: "specs", label: "Specifications" },
                { id: "reviews", label: `Reviews (${product.reviews.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-[var(--royal-gold)] text-[var(--royal-gold)]"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "description" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Product Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {product.description || "No description available for this product."}
                    </p>
                    {selectedVariant && (
                      <div className="space-y-3 pt-4 border-t border-gray-100 mt-4">
                        <h4 className="font-medium">Current Variant Overview:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">SKU:</span>
                            <span className="ml-2 font-medium">{selectedVariant.sku}</span>
                          </div>
                          {selectedVariant.hsnCode && (
                            <div>
                              <span className="text-gray-600">HSN Code:</span>
                              <span className="ml-2 font-medium">{selectedVariant.hsnCode}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-600">Status:</span>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                              selectedVariant.status === "ACTIVE" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {selectedVariant.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "specs" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Specifications</h3>
                    {selectedVariant ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-medium border-b pb-2">Product Details</h4>
                          <dl className="space-y-2">
                            <div className="flex justify-between">
                              <dt className="text-gray-600">SKU:</dt>
                              <dd className="font-medium">{selectedVariant.sku}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-600">Stock:</dt>
                              <dd className="font-medium">{selectedVariant.stock} units</dd>
                            </div>
                            {selectedVariant.hsnCode && (
                              <div className="flex justify-between">
                                <dt className="text-gray-600">HSN Code:</dt>
                                <dd className="font-medium">{selectedVariant.hsnCode}</dd>
                              </div>
                            )}
                            {/* Add more variant-specific specs here if available */}
                          </dl>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium border-b pb-2">Variant Attributes</h4>
                          <dl className="space-y-2">
                            {selectedVariant.attributeValues.map((attrValue) => (
                              <div key={attrValue.id} className="flex justify-between">
                                <dt className="text-gray-600 capitalize">{attrValue.attribute.name}:</dt>
                                <dd className="font-medium capitalize">{attrValue.attributeOption.value}</dd>
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
                    <button className="bg-[var(--royal-gold)] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[var(--royal-gold)]/90">
                      Write a Review
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;