"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { HeartIcon, ShoppingCartIcon, TrashIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { useAppDispatch } from "../store/hook";
import { addItemToServer } from "../store/cartSlice";

// Animation variants
const cardVariants: Variants = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
    },
  },
};

// Types
interface WishlistItem {
  wishlistItemId: string;
  addedAt: string;
  product: {
    id: string;
    title: string;
    slug: string;
    image: string | null;
    category: string;
  };
}

interface ProductVariant {
  id: string;
  isDefault: boolean;
  status: "ACTIVE" | "DRAFT";
  stock: number;
  price: string;
}

interface ProductDetails {
  id: string;
  title: string;
  variants: ProductVariant[];
}

interface AddToCartPayload {
  productId: string;
  variantId: string;
  quantity: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const WishlistPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [addingToCartIds, setAddingToCartIds] = useState<Set<string>>(new Set());

  // Memoize the items to prevent unnecessary re-renders
  const items = useMemo(() => wishlistItems, [wishlistItems]);

  // Fetch wishlist items
  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Please login to view your wishlist");
        router.push("/");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get<WishlistItem[]>(`${API_URL}/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWishlistItems(response.data);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            toast.error("Session expired. Please login again");
            localStorage.removeItem("token");
            router.push("/");
          } else {
            toast.error("Failed to load wishlist");
          }
        } else {
          toast.error("Failed to load wishlist");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [router]);

  // Remove from wishlist
  const handleRemoveFromWishlist = async (wishlistItemId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login");
      return;
    }

    setRemovingIds((prev) => new Set(prev).add(wishlistItemId));

    try {
      await axios.delete(`${API_URL}/wishlist/${wishlistItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlistItems((prev) => prev.filter((item) => item.wishlistItemId !== wishlistItemId));
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      toast.error("Failed to remove item");
    } finally {
      setRemovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(wishlistItemId);
        return newSet;
      });
    }
  };

  // Add to cart
  const handleAddToCart = async (productId: string, wishlistItemId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add items to cart");
      return;
    }

    setAddingToCartIds((prev) => new Set(prev).add(wishlistItemId));

    try {
      // Fetch product details to get default variant
      const productResponse = await axios.get<ProductDetails>(`${API_URL}/products/public/${productId}`);
      const product = productResponse.data;

      // Find default variant
      const defaultVariant: ProductVariant | undefined =
        product.variants.find((v) => v.isDefault && v.status === "ACTIVE" && v.stock > 0) ||
        product.variants.find((v) => v.status === "ACTIVE" && v.stock > 0) ||
        product.variants[0];

      if (!defaultVariant) {
        toast.error("Product variant not available");
        return;
      }

      const payload: AddToCartPayload = {
        productId: product.id,
        variantId: defaultVariant.id,
        quantity: 1,
      };

      await dispatch(addItemToServer(payload)).unwrap();
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      
      if (error instanceof Error) {
        toast.error(error.message || "Failed to add to cart");
      } else {
        toast.error("Failed to add to cart");
      }
    } finally {
      setAddingToCartIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(wishlistItemId);
        return newSet;
      });
    }
  };

  // Navigate to product details
  const handleViewProduct = (slug: string) => {
    router.push(`/product/${slug}`);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e8ecf0] py-8 px-4">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <div className="flex items-center gap-4">
            <HeartSolid className="w-10 h-10 text-red-500" />
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          {items.length > 0 && (
            <div className="bg-[#e8ecf0] text-gray-800 rounded-full px-5 py-2 text-sm font-semibold shadow-[inset_4px_4px_8px_#c5cdd5,inset_-4px_-4px_8px_#ffffff]">
              {items.length} {items.length === 1 ? "item" : "items"}
            </div>
          )}
        </motion.div>

        {/* Wishlist Items */}
        <AnimatePresence initial={false} mode="popLayout">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#e8ecf0] rounded-3xl p-16 text-center shadow-[12px_12px_24px_#c5cdd5,-12px_-12px_24px_#ffffff]"
            >
              <HeartIcon className="w-24 h-24 text-gray-400 mx-auto mb-6" />
              <p className="text-2xl text-gray-900 font-semibold mb-2">Your wishlist is empty</p>
              <p className="text-gray-600 mb-6">Start adding products you love!</p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/")}
                className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-[8px_8px_16px_#c5cdd5,-8px_-8px_16px_#ffffff]"
              >
                Continue Shopping
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <motion.div
                  key={item.wishlistItemId}
                  layout
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="bg-[#e8ecf0] relative rounded-3xl p-6 shadow-[12px_12px_24px_#c5cdd5,-12px_-12px_24px_#ffffff] group"
                >
                  {/* Remove Button */}
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleRemoveFromWishlist(item.wishlistItemId)}
                    disabled={removingIds.has(item.wishlistItemId)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-[#e8ecf0] shadow-[6px_6px_12px_#c5cdd5,-6px_-6px_12px_#ffffff] text-red-500 hover:text-red-600 z-10 disabled:opacity-50"
                  >
                    {removingIds.has(item.wishlistItemId) ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                    ) : (
                      <TrashIcon className="w-5 h-5" />
                    )}
                  </motion.button>

                  {/* Product Image */}
                  <div
                    className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 cursor-pointer shadow-[inset_6px_6px_12px_#c5cdd5,inset_-6px_-6px_12px_#ffffff]"
                    onClick={() => handleViewProduct(item.product.slug)}
                  >
                    <Image
                      fill
                      src={item.product.image || "/placeholder.png"}
                      alt={item.product.title}
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.png";
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="space-y-3">
                    <h3
                      className="text-lg font-bold text-gray-900 line-clamp-2 cursor-pointer hover:text-gray-700"
                      onClick={() => handleViewProduct(item.product.id)}
                    >
                      {item.product.title}
                    </h3>

                    <div className="flex items-center gap-2">
                      <span className="text-xs px-3 py-1 bg-white/40 rounded-full text-gray-700 font-medium shadow-[inset_2px_2px_4px_#c5cdd5,inset_-2px_-2px_4px_#ffffff]">
                        {item.product.category}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500">
                      Added {formatDate(item.addedAt)}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleViewProduct(item.product.id)}
                        className="flex-1 py-3 px-4 rounded-xl bg-[#e8ecf0] text-gray-900 font-semibold shadow-[6px_6px_12px_#c5cdd5,-6px_-6px_12px_#ffffff] hover:shadow-[inset_4px_4px_8px_#c5cdd5,inset_-4px_-4px_8px_#ffffff] transition-all"
                      >
                        View
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleAddToCart(item.product.id, item.wishlistItemId)}
                        disabled={addingToCartIds.has(item.wishlistItemId)}
                        className="flex-1 py-3 px-4 rounded-xl bg-gray-900 text-white font-semibold shadow-[8px_8px_16px_#c5cdd5,-8px_-8px_16px_#ffffff] hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {addingToCartIds.has(item.wishlistItemId) ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span className="text-sm">Adding...</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCartIcon className="w-5 h-5" />
                            <span className="text-sm">Add to Cart</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Continue Shopping Button */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => router.push("/")}
              className="px-8 py-4 bg-[#e8ecf0] text-gray-900 rounded-2xl font-bold shadow-[8px_8px_16px_#c5cdd5,-8px_-8px_16px_#ffffff] hover:shadow-[inset_4px_4px_8px_#c5cdd5,inset_-4px_-4px_8px_#ffffff] transition-all"
            >
              Continue Shopping
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
