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
  const { items: cartItems, isAuthenticated } = useSelector((state: RootState) => state.cart);

  // Selection logic
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selectAllCheckboxRef = useRef<HTMLInputElement | null>(null);

  // Keep selection valid if cart changes
  useEffect(() => {
    setSelectedIds(prev => prev.filter(id => cartItems.some(item => item.id === id)));
  }, [cartItems]);

  // Set native indeterminate property on checkbox
  useEffect(() => {
    if (!selectAllCheckboxRef.current) return;
    selectAllCheckboxRef.current.indeterminate =
      selectedIds.length > 0 && selectedIds.length < cartItems.length;
  }, [selectedIds, cartItems.length]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setAuthStatus(true));
      dispatch(fetchCartItems());
    }
  }, [dispatch]);

  const subtotal = cartItems
    .filter(item => selectedIds.includes(item.id))
    .reduce((sum, item) => sum + Number(item.variant?.price || 0) * item.quantity, 0);

  // Select / deselect logic
  const handleSelectAll = () => {
    if (selectedIds.length === cartItems.length && cartItems.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cartItems.map(item => item.id));
    }
  };

  const handleSelectOne = (itemId: string) => {
    setSelectedIds(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const updateQuantity = (item: CartItem, increment: boolean) => {
    if (!item.id) return;
    const newQty = Math.max(1, item.quantity + (increment ? 1 : -1));
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
    setSelectedIds(prev => prev.filter(id => id !== item.id));
  };

  // Proceed to checkout: dispatch selected items to Redux and route
  const handleCheckout = () => {
    const selectedItems = cartItems.filter(item => selectedIds.includes(item.id));
    dispatch(setSelected(selectedItems));
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#e8ecf0] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Shopping Cart
          </h1>
          {cartItems.length > 0 && (
            <div
              className="bg-[#e8ecf0] text-gray-800 rounded-full px-5 py-2 text-sm font-semibold"
              style={{ boxShadow: 'inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff' }}
            >
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </div>
          )}
        </motion.div>

        {/* Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.length > 0 && (
              <div className="mb-3 flex items-center">
                <input
                  ref={selectAllCheckboxRef}
                  type="checkbox"
                  className="h-4 w-4"
                  onChange={handleSelectAll}
                  checked={selectedIds.length === cartItems.length && cartItems.length > 0}
                  aria-label="Select all items"
                />
                <span className="ml-2 text-gray-800 font-medium">Select All</span>
              </div>
            )}
            <AnimatePresence initial={false}>
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#e8ecf0] rounded-3xl p-16 text-center"
                  style={{
                    boxShadow: '12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff'
                  }}
                >
                  <ShoppingBagIcon className="w-24 h-24 text-gray-400 mx-auto mb-6" />
                  <p className="text-2xl text-gray-900 font-semibold">Your cart is empty</p>
                  <p className="text-sm text-gray-600 mt-3">Add some products to get started!</p>
                </motion.div>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="bg-[#e8ecf0] relative rounded-3xl p-6"
                    style={{
                      boxShadow: '12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff'
                    }}
                  >
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                      <input
                        type="checkbox"
                        className="h-5 w-5 mr-2 mt-1"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleSelectOne(item.id)}
                        aria-label="Select item"
                      />
                      {/* Image */}
                      <div className="shrink-0">
                        <div
                          className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden"
                          style={{
                            boxShadow: 'inset 6px 6px 12px #c5cdd5, inset -6px -6px 12px #ffffff'
                          }}
                        >
                          <Image
                            fill
                            src={
                              item.variant?.images?.[0] ||
                              item.variant?.product?.images?.[0] ||
                              "/placeholder.png"
                            }
                            alt={item.variant?.product?.title || "Cart item"}
                            className="object-cover"
                          />
                        </div>
                      </div>
                      {/* Details */}
                      <div className="flex-1 w-full text-center sm:text-left">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {item.variant?.product?.title || "Product"}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          ${Number(item.variant?.price || 0).toFixed(2)} each
                        </p>
                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                          {/* Quantity */}
                          <div
                            className="flex items-center bg-[#e8ecf0] rounded-2xl"
                            style={{
                              boxShadow: 'inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff'
                            }}
                          >
                            <motion.button
                              whileTap={{ scale: 0.92 }}
                              onClick={() => updateQuantity(item, false)}
                              className="p-4 rounded-l-2xl hover:text-gray-900 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <MinusIcon className="w-4 h-4 text-gray-700" />
                            </motion.button>
                            <span className="px-6 py-2 font-bold text-gray-900 min-w-[60px] text-center text-lg">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.92 }}
                              onClick={() => updateQuantity(item, true)}
                              className="p-4 rounded-r-2xl hover:text-gray-900 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <PlusIcon className="w-4 h-4 text-gray-700" />
                            </motion.button>
                          </div>
                          {/* Price */}
                          <p className="text-3xl font-bold text-gray-900">
                            ${Number(Number(item.variant?.price || 0) * item.quantity).toFixed(2)}
                          </p>
                          {/* Remove */}
                          <motion.button
                            whileTap={{ scale: 0.92 }}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => removeItem(item)}
                            className="p-3 rounded-2xl bg-[#e8ecf0]"
                            style={{
                              boxShadow: '6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff'
                            }}
                            aria-label="Remove item"
                          >
                            <TrashIcon className="w-5 h-5 text-gray-700" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
          {/* Summary */}
          {cartItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-[#e8ecf0] p-8 rounded-3xl h-fit lg:sticky top-8"
              style={{
                boxShadow: '12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff'
              }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Order Summary
              </h2>
              <div className="space-y-6">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="py-6 border-t border-b border-gray-400/20">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Shipping</span>
                    <span
                      className="text-gray-900 font-semibold px-3 py-1 rounded-xl bg-[#e8ecf0] text-sm"
                      style={{
                        boxShadow: 'inset 2px 2px 4px #c5cdd5, inset -2px -2px 4px #ffffff'
                      }}
                    >
                      Free
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Standard delivery: 3-5 business days</p>
                </div>
                <div className="flex justify-between text-2xl font-bold pt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={handleCheckout}
                  className="w-full bg-[#e8ecf0] text-gray-900 py-5 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 mt-8 text-lg"
                  style={{
                    boxShadow: '8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff'
                  }}
                  disabled={selectedIds.length === 0}
                >
                  <span>Proceed to Checkout</span>
                  <span className="text-2xl">→</span>
                </motion.button>
                <p className="text-xs text-center text-gray-600 mt-4">
                  🔒 Secure checkout • SSL encrypted
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoyalCart;
