// components/cart/RoyalCart.tsx

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { motion, AnimatePresence, Variants } from "framer-motion";
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { CartItem } from "../store/types";
import { useRouter } from "next/navigation";

const cardVariants: Variants = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
  exit: {
    opacity: 0, y: -8, scale: 0.98,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

const RoyalCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const cartState = useSelector((state: RootState) => state.cart);
  const cartItems = useMemo(() => cartState?.items || [], [cartState?.items]);
  const isAuthenticated = cartState?.isAuthenticated || false;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selectAllCheckboxRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setSelectedIds((prev) =>
      prev.filter((id) => cartItems.some((item) => item.id === id))
    );
  }, [cartItems]);

  useEffect(() => {
    if (cartItems.length > 0 && selectedIds.length === 0) {
      setSelectedIds(cartItems.map((item) => item.id));
    }
  }, [cartItems, selectedIds.length]);

  useEffect(() => {
    if (!selectAllCheckboxRef.current) return;
    selectAllCheckboxRef.current.indeterminate =
      selectedIds.length > 0 && selectedIds.length < cartItems.length;
  }, [selectedIds, cartItems.length]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        dispatch(setAuthStatus(true));
        dispatch(fetchCartItems());
      }
    }
  }, [dispatch]);

  const getItemDetails = (item: CartItem) => {
    const variant = item.variant;
    const product = item.product || variant?.product;
    const title = product?.title || "Unknown Product";
    const price = Number(variant?.price ?? 0);
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

  const subtotal = cartItems
    .filter((item) => selectedIds.includes(item.id))
    .reduce((sum, item) => {
      const { price } = getItemDetails(item);
      return sum + price * item.quantity;
    }, 0);

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
    const newQty = Math.max(1, (item.quantity || 1) + (increment ? 1 : -1));
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
    <div className="min-h-screen bg-[#e8ecf0] py-6 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Shopping Cart
          </h1>
          {cartItems.length > 0 && (
            <div className="bg-[#e8ecf0] text-gray-800 rounded-full px-4 py-1.5 text-sm font-semibold shadow-[inset_4px_4px_8px_#c5cdd5,inset_-4px_-4px_8px_#ffffff]">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items Column */}
          <div className="lg:col-span-2 space-y-4">

            {/* Select All */}
            {cartItems.length > 0 && (
              <div className="flex items-center gap-2 px-1">
                <input
                  ref={selectAllCheckboxRef}
                  type="checkbox"
                  className="h-4 w-4 accent-gray-800 cursor-pointer"
                  onChange={handleSelectAll}
                  checked={selectedIds.length === cartItems.length && cartItems.length > 0}
                />
                <span
                  className="text-gray-800 font-medium cursor-pointer text-sm"
                  onClick={handleSelectAll}
                >
                  Select All
                </span>
              </div>
            )}

            <AnimatePresence initial={false} mode="popLayout">
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#e8ecf0] rounded-3xl p-16 text-center shadow-[12px_12px_24px_#c5cdd5,-12px_-12px_24px_#ffffff]"
                >
                  <ShoppingBagIcon className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                  <p className="text-xl text-gray-900 font-semibold">Your cart is empty</p>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/")}
                    className="mt-6 px-6 py-3 bg-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                  >
                    Continue Shopping
                  </motion.button>
                </motion.div>
              ) : (
                cartItems.map((item) => {
                  const { title, price, imageSrc } = getItemDetails(item);
                  const isSelected = selectedIds.includes(item.id);

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      variants={cardVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="bg-[#e8ecf0] rounded-3xl p-4 sm:p-6 shadow-[12px_12px_24px_#c5cdd5,-12px_-12px_24px_#ffffff]"
                    >
                      {/* Row: checkbox + image + details */}
                      <div className="flex items-start gap-3 sm:gap-5">

                        {/* Checkbox — always top-left */}
                        <div className="pt-1 shrink-0">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-gray-800 cursor-pointer"
                            checked={isSelected}
                            onChange={() => handleSelectOne(item.id)}
                          />
                        </div>

                        {/* Image */}
                        <div className="shrink-0">
                          <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-[inset_6px_6px_12px_#c5cdd5,inset_-6px_-6px_12px_#ffffff]">
                            <Image
                              fill
                              src={imageSrc}
                              alt={title}
                              className="object-cover"
                              sizes="(max-width: 640px) 80px, 112px"
                            />
                          </div>
                        </div>

                        {/* Details — right of image */}
                        <div className="flex-1 min-w-0">
                          {/* Title + delete on same row */}
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug line-clamp-2">
                              {title}
                            </h3>
                            <motion.button
                              whileTap={{ scale: 0.92 }}
                              onClick={() => removeItem(item)}
                              className="shrink-0 p-2 rounded-xl bg-[#e8ecf0] shadow-[4px_4px_8px_#c5cdd5,-4px_-4px_8px_#ffffff] text-red-400 hover:text-red-600"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </motion.button>
                          </div>

                          <p className="text-xs text-gray-500 mb-3">
                            ₹{price.toLocaleString()} each
                          </p>

                          {/* Quantity + Total on same row */}
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            {/* Qty stepper */}
                            <div className="flex items-center bg-[#e8ecf0] rounded-xl shadow-[inset_3px_3px_6px_#c5cdd5,inset_-3px_-3px_6px_#ffffff]">
                              <motion.button
                                whileTap={{ scale: 0.92 }}
                                onClick={() => updateQuantity(item, false)}
                                className="p-2.5 sm:p-3 rounded-l-xl hover:bg-gray-200/50 transition-colors"
                              >
                                <MinusIcon className="w-3.5 h-3.5 text-gray-700" />
                              </motion.button>
                              <span className="px-4 py-1 font-bold text-gray-900 text-sm sm:text-base min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.92 }}
                                onClick={() => updateQuantity(item, true)}
                                className="p-2.5 sm:p-3 rounded-r-xl hover:bg-gray-200/50 transition-colors"
                              >
                                <PlusIcon className="w-3.5 h-3.5 text-gray-700" />
                              </motion.button>
                            </div>

                            {/* Item total */}
                            <p className="text-lg sm:text-xl font-bold text-gray-900">
                              ₹{(price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#e8ecf0] p-6 sm:p-8 rounded-3xl h-fit lg:sticky lg:top-8 shadow-[12px_12px_24px_#c5cdd5,-12px_-12px_24px_#ffffff]"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-base sm:text-lg">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold text-gray-900">₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="border-t border-gray-400/20 pt-4">
                  <div className="flex justify-between text-lg sm:text-2xl font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">₹{subtotal.toLocaleString()}</span>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: selectedIds.length === 0 ? 1 : 1.02 }}
                  onClick={handleCheckout}
                  disabled={selectedIds.length === 0}
                  className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 mt-4 text-base sm:text-lg ${
                    selectedIds.length === 0
                      ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                      : "bg-[#e8ecf0] text-gray-900 shadow-[8px_8px_16px_#c5cdd5,-8px_-8px_16px_#ffffff]"
                  }`}
                >
                  <span>Proceed to Checkout</span>
                  <span className="text-xl">→</span>
                </motion.button>

                {selectedIds.length > 0 && (
                  <p className="text-center text-xs text-gray-400">
                    {selectedIds.length} of {cartItems.length} item{cartItems.length > 1 ? "s" : ""} selected
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoyalCart;