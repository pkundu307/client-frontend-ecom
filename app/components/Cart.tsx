"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
  updateItemLocal,
  removeItemLocal,
  updateItemOnServer,
  deleteItemFromServer,
  fetchCartItems,
  setAuthStatus,
} from "../store/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import { TrashIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { CartItem } from "../store/types";

const cardVariants = {
  initial: { opacity: 0, y: 12, scale: 0.99, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 420, damping: 30, mass: 0.7 },
  },
  exit: { opacity: 0, y: -10, scale: 0.99, filter: "blur(4px)", transition: { duration: 0.18 } },
};

const tapBounce = { scale: 0.96 };

const RoyalCart = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { items: cartItems, isAuthenticated } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setAuthStatus(true));
      dispatch(fetchCartItems());
    }
  }, [dispatch]);

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.variant?.price || 0) * item.quantity, 0);

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
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Heading */}
        <div className="flex items-center justify-between mb-6 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--royal-gold)] to-[var(--accent-primary)]">
              Cart
            </span>
          </h1>
          {cartItems.length > 0 && (
            <span className="chip-contrast rounded-full px-3 py-1 text-sm border border-[rgba(255,255,255,0.14)]">
              {cartItems.length} items
            </span>
          )}
        </div>

        {/* Layout */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <AnimatePresence initial={false}>
              {cartItems.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-[var(--royal-gold)] text-lg font-medium py-12"
                >
                  Your cart is empty.
                </motion.p>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="glass-strong relative rounded-xl p-4 sm:p-6 border border-[rgba(255,255,255,0.12)] shadow-2xl overflow-hidden"
                  >
                    {/* Decorative liquid highlight */}
                    <div
                      className="pointer-events-none absolute inset-0 opacity-70"
                      style={{
                        background:
                          "radial-gradient(140% 70% at 0% 0%, rgba(255,255,255,0.10), rgba(255,255,255,0.04) 40%, transparent 70%)",
                      }}
                    />

                    <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                      {/* Image */}
                      <div className="shrink-0">
                        <Image
                          width={128}
                          height={128}
                          src={
                            item.variant?.images?.[0] ||
                            item.variant?.product?.images?.[0] ||
                            "/placeholder.png"
                          }
                          alt={item.variant?.product?.title || "Cart item"}
                          className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-[rgba(255,255,255,0.18)] shadow-lg"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-lg sm:text-xl font-semibold">
                          <span className="text-[var(--foreground)]">{item.variant?.product?.title || "Product"}</span>
                        </h3>

                        {/* Controls */}
                        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
                          {/* Quantity */}
                          <div className="flex items-center gap-2 rounded-full px-3 py-2 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.14)] backdrop-blur-md">
                            <motion.button
                              whileTap={tapBounce}
                              onClick={() => updateQuantity(item, false)}
                              className="text-[var(--royal-gold)] hover:opacity-80"
                            >
                              <ChevronDownIcon className="w-5 h-5" />
                            </motion.button>
                            <span className="text-lg font-medium">{item.quantity}</span>
                            <motion.button
                              whileTap={tapBounce}
                              onClick={() => updateQuantity(item, true)}
                              className="text-[var(--royal-gold)] hover:opacity-80"
                            >
                              <ChevronUpIcon className="w-5 h-5" />
                            </motion.button>
                          </div>

                          {/* Price */}
                          <p className="text-xl sm:text-2xl font-extrabold text-[var(--royal-gold)] tabular-nums">
                            ${Number(Number(item.variant?.price || 0) * item.quantity).toFixed(2)}
                          </p>

                          {/* Remove */}
                          <motion.button
                            whileTap={tapBounce}
                            onClick={() => removeItem(item)}
                            className="ml-auto text-red-400 hover:text-red-300 transition-colors"
                            aria-label="Remove item"
                          >
                            <TrashIcon className="w-6 h-6" />
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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="glass-strong p-6 sm:p-8 rounded-2xl h-fit lg:sticky top-8 border border-[rgba(255,255,255,0.14)] shadow-2xl"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-4 sm:mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span>Subtotal</span>
                  <span className="font-extrabold text-[var(--royal-gold)] tabular-nums">${subtotal.toFixed(2)}</span>
                </div>

                <div className="py-4 border-y border-[rgba(255,255,255,0.14)]">
                  <div className="flex justify-between mb-1">
                    <span>Shipping</span>
                    <span className="text-[var(--royal-gold)]">Free</span>
                  </div>
                  <p className="text-sm opacity-75">Royal Priority Shipping</p>
                </div>

                <motion.button
                  whileTap={tapBounce}
                  className="text-white w-full btn-accent py-3 sm:py-4 rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                 <p
                 className="text-white"
                 >Proceed to Checkout <span className="text-xl sm:text-2xl">→</span></p> 
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
