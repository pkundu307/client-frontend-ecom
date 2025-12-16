"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
  updateItemLocal,
  removeItemLocal,
  updateItemOnServer,
  deleteItemFromServer,
  fetchCartItems,
  setAuthStatus,
  setSelected,
} from "../store/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { CartItem } from "../store/types";
import { useRouter } from "next/navigation";

// Animation variants
const cardVariants = {
  initial: { opacity: 0, y: 12, scale: 0.99 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2 } },
};

const RoyalCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  // Safe Accessor for Redux State
  const cartState = useSelector((state: RootState) => state.cart);
  const cartItems = cartState?.items || [];
  const isAuthenticated = cartState?.isAuthenticated || false;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selectAllCheckboxRef = useRef<HTMLInputElement | null>(null);

  // 1. Sync selection with current items (if item removed, unselect it)
  useEffect(() => {
    setSelectedIds((prev) => 
      prev.filter((id) => cartItems.some((item) => item.id === id))
    );
  }, [cartItems]);

  // 2. 🟢 AUTO-SELECT FIX: Select all items when they load if nothing is selected
  useEffect(() => {
    if (cartItems.length > 0 && selectedIds.length === 0) {
      setSelectedIds(cartItems.map((item) => item.id));
    }
  }, [cartItems.length]); // Dependencies: run when cart items count changes

  // 3. Indeterminate checkbox visual logic
  useEffect(() => {
    if (!selectAllCheckboxRef.current) return;
    selectAllCheckboxRef.current.indeterminate =
      selectedIds.length > 0 && selectedIds.length < cartItems.length;
  }, [selectedIds, cartItems.length]);

  // 4. Auth Check & Initial Fetch
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        dispatch(setAuthStatus(true));
        dispatch(fetchCartItems());
      }
    }
  }, [dispatch]);

  // 🟢 HELPER: Safe Data Extraction (Prevents "Unknown Product")
  const getItemDetails = (item: CartItem) => {
    const variant = item.variant;
    const product = item.product || variant?.product;

    const title = product?.title || "Unknown Product";
    const price = Number(variant?.price ?? 0);
    
    // Image fallback logic
    let imageSrc = "/placeholder.png";
    if (item.customizationImages?.length > 0) {
       imageSrc = item.customizationImages[0];
    } else if (variant?.images?.length && variant.images[0]) {
       imageSrc = variant.images[0];
    } else if (product?.images?.length && product.images[0]) {
       imageSrc = product.images[0];
    }

    return { title, price, imageSrc };
  };

  // Calculate Subtotal based on selected items
  const subtotal = cartItems
    .filter((item) => selectedIds.includes(item.id))
    .reduce((sum, item) => {
      const { price } = getItemDetails(item);
      return sum + (price * item.quantity);
    }, 0);

  // Handlers
  const handleSelectAll = () => {
    if (selectedIds.length === cartItems.length && cartItems.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cartItems.map((item) => item.id));
    }
  };

  const handleSelectOne = (itemId: string) => {
    setSelectedIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const updateQuantity = (item: CartItem, increment: boolean) => {
    if (!item.id) return;
    const currentQty = item.quantity || 1;
    const newQty = Math.max(1, currentQty + (increment ? 1 : -1));

    if (isAuthenticated) {
      dispatch(updateItemOnServer({ id: item.id, data: { quantity: newQty } }));
    } else {
      dispatch(updateItemLocal({ id: item.id, data: { quantity: newQty } }));
    }
  };

  const removeItem = (item: CartItem) => {
    if (!item.id) return;
    if (isAuthenticated) {
      dispatch(deleteItemFromServer(item.id));
    } else {
      dispatch(removeItemLocal(item.id));
    }
    setSelectedIds((prev) => prev.filter((id) => id !== item.id));
  };

  const handleCheckout = () => {
    const selectedItems = cartItems.filter((item) => selectedIds.includes(item.id));
    dispatch(setSelected(selectedItems));
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#e8ecf0] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Shopping Cart
          </h1>
          {cartItems.length > 0 && (
            <div className="bg-[#e8ecf0] text-gray-800 rounded-full px-5 py-2 text-sm font-semibold shadow-[inset_4px_4px_8px_#c5cdd5,inset_-4px_-4px_8px_#ffffff]">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.length > 0 && (
              <div className="mb-3 flex items-center">
                <input
                  ref={selectAllCheckboxRef}
                  type="checkbox"
                  className="h-4 w-4 accent-gray-800 cursor-pointer"
                  onChange={handleSelectAll}
                  checked={selectedIds.length === cartItems.length && cartItems.length > 0}
                />
                <span className="ml-2 text-gray-800 font-medium cursor-pointer" onClick={handleSelectAll}>Select All</span>
              </div>
            )}
            
            <AnimatePresence initial={false} mode="popLayout">
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#e8ecf0] rounded-3xl p-16 text-center shadow-[12px_12px_24px_#c5cdd5,-12px_-12px_24px_#ffffff]"
                >
                  <ShoppingBagIcon className="w-24 h-24 text-gray-400 mx-auto mb-6" />
                  <p className="text-2xl text-gray-900 font-semibold">Your cart is empty</p>
                  <motion.button
                     whileTap={{ scale: 0.95 }}
                     onClick={() => router.push('/')}
                     className="mt-6 px-6 py-3 bg-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                  >
                    Continue Shopping
                  </motion.button>
                </motion.div>
              ) : (
                cartItems.map((item) => {
                  const { title, price, imageSrc } = getItemDetails(item);
                  
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      variants={cardVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="bg-[#e8ecf0] relative rounded-3xl p-6 shadow-[12px_12px_24px_#c5cdd5,-12px_-12px_24px_#ffffff]"
                    >
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <input
                          type="checkbox"
                          className="h-5 w-5 mr-2 mt-1 accent-gray-800 cursor-pointer"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleSelectOne(item.id)}
                        />
                        
                        {/* Image */}
                        <div className="shrink-0">
                          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-[inset_6px_6px_12px_#c5cdd5,inset_-6px_-6px_12px_#ffffff]">
                            <Image
                              fill
                              src={imageSrc}
                              alt={title}
                              className="object-cover"
                              sizes="(max-width: 640px) 112px, 144px"
                            />
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 w-full text-center sm:text-left">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 truncate max-w-md">
                            {title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            ₹{price.toLocaleString()} each
                          </p>

                          {/* Controls */}
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center bg-[#e8ecf0] rounded-2xl shadow-[inset_4px_4px_8px_#c5cdd5,inset_-4px_-4px_8px_#ffffff]">
                              <motion.button
                                whileTap={{ scale: 0.92 }}
                                onClick={() => updateQuantity(item, false)}
                                className="p-4 rounded-l-2xl hover:bg-gray-200/50 transition-colors"
                              >
                                <MinusIcon className="w-4 h-4 text-gray-700" />
                              </motion.button>
                              <span className="px-6 py-2 font-bold text-gray-900 min-w-[60px] text-center text-lg">
                                {item.quantity}
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.92 }}
                                onClick={() => updateQuantity(item, true)}
                                className="p-4 rounded-r-2xl hover:bg-gray-200/50 transition-colors"
                              >
                                <PlusIcon className="w-4 h-4 text-gray-700" />
                              </motion.button>
                            </div>

                            <p className="text-3xl font-bold text-gray-900">
                              ₹{(price * item.quantity).toLocaleString()}
                            </p>

                            <motion.button
                              whileTap={{ scale: 0.92 }}
                              whileHover={{ scale: 1.05 }}
                              onClick={() => removeItem(item)}
                              className="p-3 rounded-2xl bg-[#e8ecf0] shadow-[6px_6px_12px_#c5cdd5,-6px_-6px_12px_#ffffff] text-red-500 hover:text-red-600"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          {/* Summary */}
          {cartItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#e8ecf0] p-8 rounded-3xl h-fit lg:sticky top-8 shadow-[12px_12px_24px_#c5cdd5,-12px_-12px_24px_#ffffff]"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Order Summary</h2>
              <div className="space-y-6">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold text-gray-900">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="py-6 border-t border-gray-400/20">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900 font-semibold px-3 py-1 rounded-xl bg-[#e8ecf0] text-sm shadow-[inset_2px_2px_4px_#c5cdd5,inset_-2px_-2px_4px_#ffffff]">
                      Free
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-2xl font-bold pt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">₹{subtotal.toLocaleString()}</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={handleCheckout}
                  className={`w-full py-5 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 mt-8 text-lg ${
                     selectedIds.length === 0 
                     ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                     : "bg-[#e8ecf0] text-gray-900 shadow-[8px_8px_16px_#c5cdd5,-8px_-8px_16px_#ffffff]"
                  }`}
                  disabled={selectedIds.length === 0}
                >
                  <span>Proceed to Checkout</span>
                  <span className="text-2xl">→</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoyalCart;