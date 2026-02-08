import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/app/store/hook';
import { addItemToServer } from '@/app/store/cartSlice';
import { addToRecentlyViewed } from '@/app/utilities/recentlyViewed';

// =============================================
// TYPE DEFINITIONS
// =============================================
export interface AttributeOption {
  id: number;
  value: string;
  slug: string;
}

export interface Attribute {
  id: number;
  name: string;
}

export interface AttributeValue {
  id: number;
  variantId: string;
  attributeOptionId: number;
  attributeId: number;
  attributeOption: AttributeOption;
  attribute: Attribute;
}
export interface Review {
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

export interface Variant {
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

export interface Business {
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

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent?: { id: number; name: string; slug: string };
}

export interface ProductDetails {
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
  slicenseDocumentUrl: string | null;
  model3dUrl: string | null;
  customizationConfig: string | null;
  business: Business;
  category: Category;
  variants: Variant[];
  reviews: string[];
}

export interface AddToCartPayload {
  productId: string;
  variantId: string;
  quantity: number;
  customizationImage?: string | null;
}

export type TabId = "description" | "specs" | "reviews";

export interface WishlistItem {
  wishlistItemId: string;
  product: {
    id: string;
  };
}

export interface WishlistApiItem extends WishlistItem {

    createdAt: string;
    updatedAt: string;
}

// =============================================
// API FUNCTIONS
// =============================================
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchProductDetails = async (productId: string): Promise<ProductDetails> => {
  const response = await fetch(`${API_URL}/products/public/${productId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch product details: ${response.status} ${response.statusText}`);
  }
  return await response.json();
};

export const addToWishlistAPI = async (productId: string, token: string) => {
  const response = await axios.post(
    `${API_URL}/wishlist`,
    { productId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const removeFromWishlistAPI = async (wishlistItemId: string, token: string) => {
  const response = await axios.delete(`${API_URL}/wishlist/${wishlistItemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getWishlistAPI = async (token: string) => {
  const response = await axios.get(`${API_URL}/wishlist`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// =============================================
// CUSTOM HOOK
// =============================================
export const useProductDetails = (productId: string) => {
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("description");
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const dispatch = useAppDispatch();

  // Load product details
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await fetchProductDetails(productId);
        setProduct(productData);

        const defaultVariant: Variant | null =
          productData.variants.find((v) => v.isDefault && v.status === "ACTIVE" && v.stock > 0) ||
          productData.variants.find((v) => v.status === "ACTIVE" && v.stock > 0) ||
          productData.variants.find((v) => v.status === "ACTIVE") ||
          productData.variants.find((v) => v.isDefault) ||
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

  // Check wishlist status
  useEffect(() => {
    const checkWishlistStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token || !product) return;

      try {
        const wishlistItems = await getWishlistAPI(token);
        const wishlistItem = wishlistItems.find((item: WishlistItem) => item.product.id === product.id);

        if (wishlistItem) {
          setIsWishlisted(true);
          setWishlistItemId(wishlistItem.wishlistItemId);
        }
      } catch (error) {
        console.error("Failed to check wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [product]);

  // Track recently viewed
  useEffect(() => {
    if (product && selectedVariant) {
      const firstImage =
        product.images?.[0] || selectedVariant.images?.[0] || "/placeholder-product.jpg";

      const cleanDescription =
        product.description?.replace(/<[^>]*>/g, "")?.trim()?.slice(0, 150) ||
        "No description available";

      const recentProduct = {
        id: product.id,
        title: product.title,
        image: firstImage,
        slug: product.slug,
        description: cleanDescription,
      };

      addToRecentlyViewed(recentProduct);
    }
  }, [product, selectedVariant]);

  // Toggle wishlist
  const handleToggleWishlist = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to add items to your wishlist");
      return;
    }

    if (!product) {
      toast.error("Product information not available");
      return;
    }

    setIsTogglingWishlist(true);

    try {
      if (isWishlisted && wishlistItemId) {
        await removeFromWishlistAPI(wishlistItemId, token);
        setIsWishlisted(false);
        setWishlistItemId(null);
        toast.success("Removed from wishlist");
      } else {
        const response = await addToWishlistAPI(product.id, token);
        setIsWishlisted(true);
        setWishlistItemId(response.data.id);
        toast.success("Added to wishlist");
      }
    } catch (error: unknown) {
      console.error("Wishlist toggle error:", error);

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number } };
        if (axiosError.response?.status === 409) {
          toast.error("This product is already in your wishlist");
        } else if (axiosError.response?.status === 401) {
          toast.error("Session expired. Please login again");
          localStorage.removeItem("token");
        } else {
          toast.error(isWishlisted ? "Failed to remove from wishlist" : "Failed to add to wishlist");
        }
      } else {
        toast.error(isWishlisted ? "Failed to remove from wishlist" : "Failed to add to wishlist");
      }
    } finally {
      setIsTogglingWishlist(false);
    }
  }, [isWishlisted, wishlistItemId, product]);

  // Add to cart
  const handleAddToCart = useCallback(async () => {
    if (!product || !selectedVariant) {
      toast.error("Product details are not available. Please refresh.");
      return;
    }

    const isCurrentVariantActive = selectedVariant.status === "ACTIVE";
    const isCurrentVariantInStock = selectedVariant.stock > 0;
    const canPurchase = isCurrentVariantActive && isCurrentVariantInStock;

    if (!canPurchase) {
      toast.error("This item cannot be purchased at the moment.");
      return;
    }

    setIsAddingToCart(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    try {
      if (token) {
        const payload: AddToCartPayload = {
          productId: product.id,
          variantId: selectedVariant.id,
          quantity: quantity,
        };

        await dispatch(addItemToServer(payload)).unwrap();
        toast.success(`${product.title} added to your cart!`);
      } else {
        toast.error("Please login to add items to cart");
      }
    } catch (err: unknown) {
      console.error("Failed to add to cart:", err);
      let errorMessage = "Could not add item to cart. Please try again.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, selectedVariant, quantity, dispatch]);

  // Computed values
  const currentImages = product
    ? [...(product.images ?? []), ...(selectedVariant?.images ?? [])]
    : [];
  const currentPrice = selectedVariant?.price || "0";
  const currentMrp = selectedVariant?.mrp || "0";
  const currentStock = selectedVariant?.stock || 0;

  const discountPercentage =
    currentMrp !== "0" && parseFloat(currentMrp) > parseFloat(currentPrice)
      ? Math.round(((parseFloat(currentMrp) - parseFloat(currentPrice)) / parseFloat(currentMrp)) * 100)
      : 0;

  const isCurrentVariantActive = selectedVariant?.status === "ACTIVE";
  const isCurrentVariantInStock = currentStock > 0;
  const canPurchase = isCurrentVariantActive && isCurrentVariantInStock;

  const breadcrumbPath = product?.category.parent
    ? `${product.category.parent.name} / ${product.category.name}`
    : product?.category.name || "";

  return {
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
  };
};
