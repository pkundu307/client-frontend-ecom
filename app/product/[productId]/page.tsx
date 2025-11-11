"use client";
import { useState, useEffect, useMemo, useCallback, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';

import Image from "next/image";
import { useAppDispatch } from '../../store/hook';
// Redux & State Management
// import { useAppDispatch } from '../../store/hooks';
import { addItemToServer,
  
  // addItemLocal 
} from '../../store/cartSlice';
import toast, { Toaster } from 'react-hot-toast';
// import { v4 as uuidv4 } from 'uuid';

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
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from "@heroicons/react/24/solid";
// import { useDispatch } from "react-redux";

const CustomizationModal = dynamic(
  () => import('./(component)/CustomizationModal'),
  { 
    ssr: false, 
    loading: () => (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
        <div className="text-white text-lg font-semibold">Loading Customizer...</div>
      </div>
    )
  }
);

// =============================================
// TYPE DEFINITIONS 
// =============================================
interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}
interface AttributeOption {
  id: number; value: string; slug: string;
}
interface Attribute {
  id: number; name: string;
}
interface AttributeValue {
  id: number; variantId: string; attributeOptionId: number; attributeId: number;
  attributeOption: AttributeOption; attribute: Attribute;
}
interface Variant {
  id: string; sku: string; price: string; stock: number; isDefault: boolean;
  weightInGrams: number | null; images: string[]; createdAt: string; updatedAt: string;
  status: "ACTIVE" | "DRAFT"; hsnCode: string; sacCode: string | null; mrp: string;
  purchasePrice: string | null; purchasePriceType: string | null; sellingPriceType: string | null;
  description: string | null; tax: string | null; unit: string | null;
  isMinStockAlertEnabled: boolean | null; minStockCount: number | null;
  openingStock: number | null; openingStockDate: string | null; productId: string;
  attributeValues: AttributeValue[];
}
interface Business {
  id: string; name: string; gstNumber: string; address: string; city: string;
  state: string; country: string; phone: string; isVerified: boolean;
}
interface Category {
  id: number; name: string; slug: string;
  parent?: { id: number; name: string; slug: string; };
}
interface ProductDetails {
  id: string; title: string; description: string; isCustomizable: boolean;
  images: string[]; isPublished: boolean; publishDate: string | null;
  isFeatured: boolean; slug: string; createdAt: string; updatedAt: string;
  businessId: string; categoryId: number; slicenseDocumentUrl: string | null;
  model3dUrl: string | null; customizationConfig: string | null; business: Business;
  category: Category; variants: Variant[]; reviews: string[];
}
interface AddToCartPayload {
  productId: string; variantId: string; quantity: number; customizationImage?: string | null;
}
// interface LocalCartItem {
//   id: string; productId: string; variantId: string; quantity: number;
//   product: { title: string; images: string[]; };
//   variant: { price: string; attributeValues: AttributeValue[]; };
//   customizationImage?: string | null;
//   customizationDetails?: Record<string, string>;
// }
// FIX: Define a specific type for tab IDs to avoid using 'any'.
type TabId = "description" | "specs" | "reviews";


// API call function
const fetchProductDetails = async (productId: string): Promise<ProductDetails> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/public/${productId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch product details: ${response.status} ${response.statusText}`);
  }
  return await response.json();
};

// Image Gallery Component
const ImageGallery = ({ images, productTitle }: { images: string[]; productTitle: string }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
              target.src = "/placeholder-product.jpg";
            }}
          />
        </motion.div>
        
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg z-10"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg z-10"
              aria-label="Next image"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
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
                  target.src = "/placeholder-product.jpg";
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
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
              aria-label="Close fullscreen"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
            <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <Image
                src={images[currentImageIndex]}
                alt={`${productTitle} - Fullscreen`}
                width={1200}
                height={900}
                className="max-w-full max-h-full object-contain rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-product.jpg";
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
        options: Array.from(group.options.values()).sort((a, b) => a.value.localeCompare(b.value)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [variants]);

  const [currentSelections, setCurrentSelections] = useState<{ [attributeName: string]: number | null }>({});

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

  const findBestMatchingVariant = useCallback((selectionIds: { [attributeName: string]: number | null }): Variant | null => {
    let bestMatch: Variant | null = null;
    let bestMatchCount = -1;
    let bestScore = -1;

    for (const variant of variants) {
        let currentMatchCount = 0;
        let isValidCandidate = true;
        const currentVariantAttrMap = new Map<string, number>();
        variant.attributeValues.forEach(av => currentVariantAttrMap.set(av.attribute.name, av.attributeOption.id));

        for (const [attrName, selectedOptionId] of Object.entries(selectionIds)) {
            if (selectedOptionId !== null) {
                if (currentVariantAttrMap.get(attrName) === selectedOptionId) {
                    currentMatchCount++;
                } else {
                    isValidCandidate = false;
                    break; 
                }
            }
        }

        if (!isValidCandidate) continue;

        let currentScore = 0;
        if (variant.status === "ACTIVE") currentScore += 100;
        if (variant.isDefault) currentScore += 50;
        if (variant.stock > 0) currentScore += 20;

        if (currentMatchCount > bestMatchCount) {
            bestMatchCount = currentMatchCount;
            bestScore = currentScore;
            bestMatch = variant;
        } else if (currentMatchCount === bestMatchCount) {
            if (currentScore > bestScore) {
                bestScore = currentScore;
                bestMatch = variant;
            }
        }
    }
    
    if (!bestMatch && variants.length > 0) {
        bestMatch =
          variants.find(v => v.isDefault && v.status === "ACTIVE" && v.stock > 0) ||
          variants.find(v => v.status === "ACTIVE" && v.stock > 0) ||
          variants.find(v => v.status === "ACTIVE") ||
          variants.find(v => v.isDefault) ||
          variants[0] || 
          null;
    }

    return bestMatch;
  }, [variants]);

  const checkIsOptionEnabled = useCallback((
    attrNameBeingChecked: string, 
    optionIdBeingChecked: number, 
    baseSelections: { [attributeName: string]: number | null }
  ): boolean => {
      const potentialSelectionsForCheck = { ...baseSelections, [attrNameBeingChecked]: optionIdBeingChecked };
      return variants.some(variant => {
          const variantAttrMap = new Map<string, number>();
          variant.attributeValues.forEach(av => variantAttrMap.set(av.attribute.name, av.attributeOption.id));
          return Object.entries(potentialSelectionsForCheck).every(([attrName, selectedOptionId]) => {
              if (selectedOptionId === null) return true;
              return variantAttrMap.get(attrName) === selectedOptionId;
          });
      });
  }, [variants]);

  const handleAttributeChange = useCallback((attributeName: string, option: AttributeOption) => {
    const isCurrentlySelected = currentSelections[attributeName] === option.id;
    const newClickedSelectionId = isCurrentlySelected ? null : option.id;

    const updatedSelections: { [attributeName: string]: number | null } = {
        ...currentSelections,
        [attributeName]: newClickedSelectionId,
    };

    for (const attrGroup of allAttributeGroups) {
        const otherAttrName = attrGroup.name;
        if (otherAttrName === attributeName) continue;
        const otherSelectedOptionId = updatedSelections[otherAttrName];
        if (otherSelectedOptionId !== null) {
            const isOtherOptionStillEnabled = checkIsOptionEnabled(otherAttrName, otherSelectedOptionId, updatedSelections);
            if (!isOtherOptionStillEnabled) {
                updatedSelections[otherAttrName] = null;
            }
        }
    }

    setCurrentSelections(updatedSelections);
    const bestVariant = findBestMatchingVariant(updatedSelections);
    
    if (bestVariant) {
        onVariantChange(bestVariant);
    } else if (variants.length > 0) {
        const fallbackVariant: Variant | null =
            variants.find(v => v.isDefault && v.status === "ACTIVE" && v.stock > 0) ||
            variants.find(v => v.status === "ACTIVE" && v.stock > 0) ||
            variants.find(v => v.isDefault) ||
            variants[0] ||
            null;
        if (fallbackVariant) {
            onVariantChange(fallbackVariant);
        }
    }
  }, [currentSelections, allAttributeGroups, checkIsOptionEnabled, findBestMatchingVariant, variants, onVariantChange]);

  const getIsOptionEnabledForRender = useCallback((attrName: string, optionId: number): boolean => {
    return checkIsOptionEnabled(attrName, optionId, currentSelections);
  }, [checkIsOptionEnabled, currentSelections]);

  if (allAttributeGroups.length === 0) {
    return null;
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
                
                const variantForOption = isEnabled ? findBestMatchingVariant({ ...currentSelections, [attributeName]: option.id }) : null;
                const isOutOfStock = variantForOption && variantForOption.stock <= 0;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleAttributeChange(attributeName, option)}
                    disabled={!isEnabled}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all capitalize relative 
                      ${isSelected 
                        ? "border-[var(--royal-gold)] bg-[var(--royal-gold)] text-white shadow-md" 
                        : isEnabled
                          ? isOutOfStock
                            ? "border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed line-through"
                            : "border-gray-300 hover:border-[var(--royal-gold)] text-gray-700"
                          : "border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                      }
                    `}
                    aria-pressed={isSelected}
                    aria-label={`${attributeName} ${option.value}`}
                  >
                    {option.value}
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
export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(
    params instanceof Promise ? params : Promise.resolve(params)
  );
  const { productId } = resolvedParams;

  
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("description");
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await fetchProductDetails(productId);
        setProduct(productData);
        
        const defaultVariant: Variant | null =
          productData.variants.find(v => v.isDefault && v.status === "ACTIVE" && v.stock > 0) ||
          productData.variants.find(v => v.status === "ACTIVE" && v.stock > 0) ||
          productData.variants.find(v => v.status === "ACTIVE") ||
          productData.variants.find(v => v.isDefault) ||
          (productData.variants.length > 0 ? productData.variants[0] : null);
        
        setSelectedVariant(defaultVariant);
        setError(null);
      } catch (err) {
        console.error("Error loading product:", err);
        setError(err instanceof Error ? err.message : "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const currentImages = selectedVariant?.images?.length ? selectedVariant.images : product?.images || [];
  const currentPrice = selectedVariant?.price || "0";
  const currentMrp = selectedVariant?.mrp || "0";
  const currentStock = selectedVariant?.stock || 0;
  
  const discountPercentage = currentMrp !== "0" && parseFloat(currentMrp) > parseFloat(currentPrice)
    ? Math.round(((parseFloat(currentMrp) - parseFloat(currentPrice)) / parseFloat(currentMrp)) * 100)
    : 0;

  const isCurrentVariantActive = selectedVariant?.status === "ACTIVE";
  const isCurrentVariantInStock = currentStock > 0;
  const canPurchase = isCurrentVariantActive && isCurrentVariantInStock;

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) {
      toast.error("Product details are not available. Please refresh.");
      return;
    }
    if (!canPurchase) {
      toast.error("This item cannot be purchased at the moment.");
      return;
    }

    setIsAddingToCart(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    try {
      if (token) {
        const payload: AddToCartPayload = {
          productId: product.id,
          variantId: selectedVariant.id,
          quantity: quantity,
        };
        console.log("Dispatching addItemToServer with payload:", payload);
        
        // FIX: Removed `as any`. For full type safety, configure a typed `useAppDispatch` hook in your Redux store setup.
        // This will allow `dispatch` to correctly infer the types of async thunks.
        await (dispatch(addItemToServer(payload))).unwrap();
        
        toast.success(`${product.title} added to your cart!`);
      } else {
        // const localCartItem: LocalCartItem = {
        //   id: uuidv4(),
        //   productId: product.id,
        //   variantId: selectedVariant.id,
        //   quantity: quantity,
        //   product: { title: product.title, images: currentImages },
        //   variant: { price: selectedVariant.price, attributeValues: selectedVariant.attributeValues },
        // };
        // dispatch(addItemLocal(localCartItem));
        // toast.success(`${product.title} added to your cart!`);
      }
    // FIX: Changed `err: any` to `err: unknown` for better type safety.
    } catch (err: unknown) {
      console.error("Failed to add to cart:", err);
      // Use a type guard to safely access the error message
      let errorMessage = "Could not add item to cart. Please try again.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsAddingToCart(false);
    }
  };

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
  
  const breadcrumbPath = product.category.parent 
    ? `${product.category.parent.name} / ${product.category.name}`
    : product.category.name;

  return (
 <div className="min-h-screen bg-gradient-to-br from-gray-50 via-grey-500 to-gray-200">
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
        <span className="text-gray-900 font-medium">{product.title}</span>
      </div>
    </motion.nav>

    {/* Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
      {/* Image Gallery */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
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
        <div>
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight">
              {product.title}
            </h1>
            <div className="flex gap-2">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsWishlisted(!isWishlisted)} 
                className="p-2.5 rounded-xl bg-white/40 backdrop-blur-xl border border-gray-200/60 hover:border-red-300 transition-all shadow-sm" 
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isWishlisted ? (
                  <HeartSolid className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-5 h-5 text-gray-600" />
                )}
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-xl bg-white/40 backdrop-blur-xl border border-gray-200/60 hover:border-gray-300 transition-all shadow-sm" 
                aria-label="Share product"
              >
                <ShareIcon className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>
          </div>
          
          {/* Badges */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {product.isCustomizable && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl text-purple-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-purple-200/60"
              >
                <SparklesIcon className="w-3.5 h-3.5" />
                <span>Customizable</span>
              </motion.div>
            )}
            {product.isFeatured && (
              <span className="bg-amber-500/10 backdrop-blur-xl text-amber-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-amber-200/60">
                Featured
              </span>
            )}
            {selectedVariant && !isCurrentVariantActive && (
              <span className="bg-yellow-500/10 backdrop-blur-xl text-yellow-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-yellow-200/60">
                Draft Product
              </span>
            )}
            {isCurrentVariantInStock ? (
              <span className="flex items-center gap-1.5 text-green-700 text-xs font-semibold bg-green-500/10 backdrop-blur-xl px-3 py-1.5 rounded-full border border-green-200/60">
                <CheckCircleIcon className="w-3.5 h-3.5" />
                In Stock ({currentStock})
              </span>
            ) : (
              <span className="text-red-700 text-xs font-semibold bg-red-500/10 backdrop-blur-xl px-3 py-1.5 rounded-full border border-red-200/60">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Business Info */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-white/40 backdrop-blur-xl rounded-2xl p-4 border border-gray-200/60 shadow-sm"
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
              <div className="flex items-center gap-1.5 text-green-700 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-200/60">
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
          <span className="text-sm text-gray-600 font-medium">
            ({product.reviews.length} reviews)
          </span>
        </div>

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-4xl lg:text-5xl font-bold text-gray-900">
              ₹{Number(currentPrice).toLocaleString('en-IN')}
            </span>
            {currentMrp !== "0" && parseFloat(currentMrp) > parseFloat(currentPrice) && (
              <span className="text-xl text-gray-400 line-through">
                ₹{Number(currentMrp).toLocaleString('en-IN')}
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-red-500/10 backdrop-blur-xl text-red-700 px-3 py-1.5 rounded-full text-sm font-bold border border-red-200/60">
                {discountPercentage}% OFF
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">Inclusive of all taxes</p>
        </div>

        {/* Variant Selector */}
        {product.variants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
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
              <div className="flex items-center bg-white/40 backdrop-blur-xl border border-gray-200/60 rounded-xl shadow-sm">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="p-3 hover:bg-white/60 rounded-l-xl transition-colors" 
                  disabled={quantity <= 1} 
                  aria-label="Decrease quantity"
                >
                  <MinusIcon className="w-4 h-4 text-gray-700" />
                </motion.button>
                <span className="px-6 py-2 border-x border-gray-200/60 font-semibold text-gray-900 min-w-[60px] text-center">
                  {quantity}
                </span>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))} 
                  className="p-3 hover:bg-white/60 rounded-r-xl transition-colors" 
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
              className="bg-yellow-50/40 backdrop-blur-xl border border-yellow-200/60 rounded-xl p-3 shadow-sm"
            >
              <p className="text-yellow-800 text-sm font-medium">
                This variant is currently {isCurrentVariantInStock ? "not available for purchase" : "out of stock"}.
              </p>
            </motion.div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: canPurchase && localStorage.getItem("token") ? 1.02 : 1 }}
              whileTap={{ scale: canPurchase && localStorage.getItem("token") ? 0.98 : 1 }}
              onClick={handleAddToCart}
              disabled={!canPurchase || isAddingToCart || !localStorage.getItem("token")}
              className={`flex-1 py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
                isAddingToCart 
                  ? "bg-gray-400 cursor-wait text-white" 
                  : localStorage.getItem("token") && canPurchase
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
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
              whileHover={{ scale: canPurchase ? 1.02 : 1 }}
              whileTap={{ scale: canPurchase ? 0.98 : 1 }}
              disabled={!canPurchase} 
              className="flex-1 bg-orange-500 text-white py-3.5 px-6 rounded-xl font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <CreditCardIcon className="w-5 h-5" /> 
              Buy Now
            </motion.button>
          </div>
          
          {product.isCustomizable && (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCustomizationModalOpen(true)} 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3.5 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <WrenchScrewdriverIcon className="w-5 h-5" /> 
              Customize This Product
            </motion.button>
          )}
        </div>

        {/* Delivery Info */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-blue-50/40 backdrop-blur-xl rounded-2xl p-4 border border-blue-200/60 shadow-sm"
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
      className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/60"
    >
      <div className="border-b border-gray-200/60">
        <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
          {[
            { id: "description", label: "Description" }, 
            { id: "specs", label: "Specifications" }, 
            { id: "reviews", label: `Reviews (${product.reviews.length})` }
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
                      <h4 className="font-medium border-b border-gray-200 pb-2 text-gray-900">Product Details</h4>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-gray-600">SKU:</dt>
                          <dd className="font-medium text-gray-900">{selectedVariant.sku}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Stock:</dt>
                          <dd className="font-medium text-gray-900">{selectedVariant.stock} units</dd>
                        </div>
                        {selectedVariant.hsnCode && (
                          <div className="flex justify-between">
                            <dt className="text-gray-600">HSN Code:</dt>
                            <dd className="font-medium text-gray-900">{selectedVariant.hsnCode}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium border-b border-gray-200 pb-2 text-gray-900">Variant Attributes</h4>
                      <dl className="space-y-2">
                        {selectedVariant.attributeValues.map((attrValue) => (
                          <div key={attrValue.id} className="flex justify-between">
                            <dt className="text-gray-600 capitalize">{attrValue.attribute.name}:</dt>
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
};

// export default ProductDetailsPage;