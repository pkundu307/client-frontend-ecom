"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  MapPinIcon,
  PlusIcon,
  XMarkIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useCheckout } from "./useCheckout";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
    },
  },
};

const tap = { scale: 0.97 };

const CheckoutPage: React.FC = () => {
  const {
    mounted,
    items,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    paymentMethod,
    setPaymentMethod,
    loadingAddresses,
    showAddressModal,
    setShowAddressModal,
    newAddress,
    setNewAddress,
    savingAddress,
    couponInput,
    setCouponInput,
    couponApplied,
    couponError,
    applyCoupon,
    subtotal,
    total,
    slideRef,
    slideProgress,
    isSliding,
    isPlacingOrder,
    handleSlide,
    handleAddAddress,
    handlePlaceOrder,
    showSuccessModal,
  orderData,
  handleSuccessOk,
  } = useCheckout();

  if (!mounted) return null;

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center px-4">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="show"
          className="bg-[#e8ecf0] rounded-3xl p-8 text-center max-w-md w-full"
          style={{
            boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
          }}
        >
          <ShoppingBagIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Items in Checkout</h3>
          <p className="text-gray-600">Please select items from your cart.</p>
        </motion.div>
      </div>
    );
  }

  const COD_THRESHOLD = 600;
  const COUPON_CODE = "jotto50";
  const COUPON_DISCOUNT = 50;

  return (
    <div className="min-h-screen bg-[#e8ecf0] px-3 sm:px-4 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="show"
          className="bg-[#e8ecf0] rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-6 sm:mb-8"
          style={{
            boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
          }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <ShoppingBagIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <span className="truncate">Checkout</span>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column: Addresses + Order Items */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Delivery Address Section */}
            <motion.section
              variants={cardVariants}
              initial="hidden"
              animate="show"
              className="bg-[#e8ecf0] rounded-2xl sm:rounded-3xl p-4 sm:p-6"
              style={{
                boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
              }}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold flex items-center gap-2 text-gray-900">
                  <MapPinIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  <span className="truncate">Delivery Address</span>
                </h2>
                <motion.button
                  whileTap={tap}
                  onClick={() => setShowAddressModal(true)}
                  className="bg-[#e8ecf0] p-2 sm:p-3 rounded-lg sm:rounded-xl flex items-center gap-1 sm:gap-2 text-gray-900 font-semibold text-sm sm:text-base whitespace-nowrap"
                  style={{
                    boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
                  }}
                >
                  <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">Add</span>
                </motion.button>
              </div>

              {loadingAddresses ? (
                <div
                  className="bg-[#e8ecf0] rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center"
                  style={{
                    boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                  }}
                >
                  <p className="text-gray-600 text-sm sm:text-base">Loading addresses...</p>
                </div>
              ) : addresses.length === 0 ? (
                <div
                  className="bg-[#e8ecf0] rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center"
                  style={{
                    boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                  }}
                >
                  <p className="text-gray-600 text-sm sm:text-base">{`No saved addresses. Click "Add" to add one.`}</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {addresses.map((addr) => (
                    <motion.label
                      key={addr.id}
                      whileTap={tap}
                      className={`block cursor-pointer bg-[#e8ecf0] rounded-xl sm:rounded-2xl p-4 sm:p-5 transition-all ${
                        selectedAddressId === addr.id ? "ring-2 ring-blue-600" : ""
                      }`}
                      style={{
                        boxShadow:
                          selectedAddressId === addr.id
                            ? "inset 6px 6px 12px #c5cdd5, inset -6px -6px 12px #ffffff"
                            : "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff",
                      }}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <input
                          type="radio"
                          name="address"
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-0.5 sm:mt-1 accent-blue-600 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                            {addr.street}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
                            {addr.city}, {addr.state} {addr.postalCode}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">{addr.country}</p>
                          {addr.alternativePhoneNumber && (
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                              📞 {addr.alternativePhoneNumber}
                            </p>
                          )}
                        </div>
                        {selectedAddressId === addr.id && (
                          <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                    </motion.label>
                  ))}
                </div>
              )}
            </motion.section>

            {/* Order Items Section */}
            <motion.section
              variants={cardVariants}
              initial="hidden"
              animate="show"
              className="bg-[#e8ecf0] rounded-2xl sm:rounded-3xl p-4 sm:p-6"
              style={{
                boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
              }}
            >
              <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 text-gray-900">
                <ShoppingBagIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <span>Order Items ({items.length})</span>
              </h2>
              <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#e8ecf0] rounded-xl sm:rounded-2xl p-3 sm:p-4 flex gap-3 sm:gap-4"
                    style={{
                      boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                    }}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl bg-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                      <Image
                        src={item.variant?.product?.images?.[0] || "/placeholder.png"}
                        alt={item.variant?.product?.title || ""}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">
                        {item.variant?.product?.title}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Right Column: Payment + Summary */}
          <div className="space-y-6 sm:space-y-8">
            {/* Payment Method */}
            <motion.section
              variants={cardVariants}
              initial="hidden"
              animate="show"
              className="bg-[#e8ecf0] rounded-2xl sm:rounded-3xl p-4 sm:p-6"
              style={{
                boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
              }}
            >
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2 text-gray-900">
                <CreditCardIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <span>Payment Method</span>
              </h2>
              <div className="space-y-2 sm:space-y-3">
                <motion.label
                  whileTap={tap}
                  className={`block cursor-pointer bg-[#e8ecf0] rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all ${
                    paymentMethod === "cod" ? "ring-2 ring-blue-600" : ""
                  }`}
                  style={{
                    boxShadow:
                      paymentMethod === "cod"
                        ? "inset 6px 6px 12px #c5cdd5, inset -6px -6px 12px #ffffff"
                        : "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
                  }}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-blue-600 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                    />
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">
                      Cash on Delivery
                    </span>
                  </div>
                </motion.label>

                <motion.label
                  whileTap={tap}
                  className={`block cursor-pointer bg-[#e8ecf0] rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all ${
                    paymentMethod === "online" ? "ring-2 ring-green-600" : ""
                  }`}
                  style={{
                    boxShadow:
                      paymentMethod === "online"
                        ? "inset 6px 6px 12px #c5cdd5, inset -6px -6px 12px #ffffff"
                        : "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
                  }}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")}
                      className="accent-green-600 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                    />
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">
                      Pay Online (Razorpay)
                    </span>
                  </div>
                </motion.label>
              </div>
            </motion.section>

            {/* Coupon Section */}
            <motion.section
              variants={cardVariants}
              initial="hidden"
              animate="show"
              className="bg-[#e8ecf0] rounded-2xl sm:rounded-3xl p-4 sm:p-6"
              style={{
                boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
              }}
            >
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900">
                Have a Coupon?
              </h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  disabled={couponApplied}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600 text-sm sm:text-base"
                  style={{
                    boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                  }}
                />
                <motion.button
                  whileTap={tap}
                  onClick={applyCoupon}
                  disabled={couponApplied}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base whitespace-nowrap ${
                    couponApplied ? "bg-green-100 text-green-800" : "bg-gray-900 text-white"
                  }`}
                  style={{
                    boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
                  }}
                >
                  {couponApplied ? "✓" : "Apply"}
                </motion.button>
              </div>
              {couponError && <p className="mt-2 text-xs sm:text-sm text-red-600">{couponError}</p>}
              {couponApplied && (
                <p className="mt-2 text-xs sm:text-sm text-green-700">₹50 discount applied!</p>
              )}
            </motion.section>

            {/* Order Summary */}
            <motion.section
              variants={cardVariants}
              initial="hidden"
              animate="show"
              className="bg-[#e8ecf0] rounded-2xl sm:rounded-3xl p-4 sm:p-6"
              style={{
                boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
              }}
            >
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900">
                Order Summary
              </h2>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                {paymentMethod === "cod" && subtotal < COD_THRESHOLD && (
                  <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                    <span>COD Fee</span>
                    <span className="font-semibold">+₹30</span>
                  </div>
                )}
                {couponApplied && (
                  <div className="flex justify-between text-green-700 text-sm sm:text-base">
                    <span className="truncate">Coupon ({COUPON_CODE})</span>
                    <span className="font-semibold whitespace-nowrap">-₹{COUPON_DISCOUNT}</span>
                  </div>
                )}
                <div
                  className="h-px bg-gray-400"
                  style={{
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                />
                <div className="flex justify-between text-gray-900 text-lg sm:text-xl font-bold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Slide to Pay (Mobile/Tablet) or Button (Desktop) */}
              <div className="mt-4 sm:mt-6">
                {/* Mobile/Tablet: Slide to Pay */}
                <div className="block lg:hidden">
                  <div
                    ref={slideRef}
                    className="w-full h-14 sm:h-16 bg-[#e8ecf0] rounded-full relative select-none"
                    style={{
                      touchAction: "none",
                      userSelect: "none",
                      boxShadow: "inset 6px 6px 12px #c5cdd5, inset -6px -6px 12px #ffffff",
                    }}
                    onPointerDown={handleSlide}
                  >
                    <motion.div
                      style={{
                        left: `calc(${slideProgress * 100}% - ${slideProgress * 56}px)`,
                        transition: isSliding ? "none" : "left 0.3s",
                      }}
                      className="absolute z-10 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-gray-900 text-white flex items-center justify-center rounded-full shadow-lg cursor-grab active:cursor-grabbing"
                    >
                      {isPlacingOrder ? (
                        <svg
                          className="animate-spin h-5 w-5 sm:h-6 sm:w-6"
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
                      ) : slideProgress > 0.97 ? (
                        "✓"
                      ) : (
                        <ArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}
                    </motion.div>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-sm sm:text-base font-bold text-gray-700 px-16">
                      <span className="truncate">
                        {isPlacingOrder
                          ? "Processing..."
                          : slideProgress > 0.97
                          ? paymentMethod === "online"
                            ? "Opening..."
                            : "Placing..."
                          : "Slide to Pay"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Desktop: Button */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="hidden lg:flex w-full py-4 px-6 bg-gray-900 text-white rounded-2xl font-bold items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff",
                  }}
                >
                  {isPlacingOrder ? (
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
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-6 h-6" />
                      {paymentMethod === "online" ? "Pay Now" : "Place Order"}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.section>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-lg flex items-center justify-center z-50 p-3 sm:p-4"
            onClick={() => setShowAddressModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#e8ecf0] rounded-2xl sm:rounded-3xl p-5 sm:p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
              style={{
                boxShadow: "20px 20px 40px #c5cdd5, -20px -20px 40px #ffffff",
              }}
            >
              <button
                onClick={() => setShowAddressModal(false)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-600 hover:text-gray-900"
              >
                <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 pr-8">
                Add New Address
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Street Address"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600 text-sm sm:text-base"
                  style={{
                    boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                  }}
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone Number (10 digits)"
                  value={newAddress.alternativePhoneNumber}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      alternativePhoneNumber: e.target.value.replace(/\D/g, "").slice(0, 10),
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600 text-sm sm:text-base"
                  style={{
                    boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                  }}
                  maxLength={10}
                />
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600 text-sm sm:text-base"
                    style={{
                      boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddress.state}
                    required
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600 text-sm sm:text-base"
                    style={{
                      boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <input
                    required
                    type="text"
                    placeholder="Postal Code"
                    value={newAddress.postalCode}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        postalCode: e.target.value.replace(/\D/g, "").slice(0, 6),
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600 text-sm sm:text-base"
                    style={{
                      boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                    }}
                    maxLength={6}
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    required
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600 text-sm sm:text-base"
                    style={{
                      boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                    }}
                  />
                </div>
                <motion.button
                  whileTap={tap}
                  onClick={handleAddAddress}
                  disabled={savingAddress}
                  className="w-full bg-gray-900 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold disabled:opacity-50 text-sm sm:text-base"
                  style={{
                    boxShadow: "8px 8px 16px #c5cdd5, -6px -6px 12px #ffffff",
                  }}
                >
                  {savingAddress ? "Saving..." : "Save Address"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Order Success Modal */}
<AnimatePresence>
  {showSuccessModal && orderData && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-[60] p-3 sm:p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-[#e8ecf0] rounded-3xl p-6 sm:p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto"
        style={{
          boxShadow: "20px 20px 40px #c5cdd5, -20px -20px 40px #ffffff",
        }}
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircleIcon className="w-16 h-16 sm:w-20 sm:h-20 text-green-600" />
          </div>
        </motion.div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
          Order Placed Successfully! 🎉
        </h2>
        <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
          Thank you for your order. We&apos;ll send you updates soon.
        </p>

        {/* Order Number */}
        <div className="bg-blue-50 rounded-2xl p-4 mb-6 text-center">
          <p className="text-sm text-gray-600 mb-1">Order Number</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">
            {orderData.orderNumber}
          </p>
        </div>

        {/* Order Details */}
        <div
          className="bg-[#e8ecf0] rounded-2xl p-4 mb-6"
          style={{
            boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
          }}
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Amount</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                ₹{orderData.totalAmount}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Items</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                {orderData.items.length}
              </p>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="border-t border-gray-300 pt-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-2 flex items-center gap-1">
              <MapPinIcon className="w-4 h-4" />
              Delivery Address
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {orderData.selectedAddress.street}
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              {orderData.selectedAddress.city}, {orderData.selectedAddress.state}{" "}
              {orderData.selectedAddress.postalCode}
            </p>
          </div>
        </div>

        {/* OK Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSuccessOk}
          className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-base sm:text-lg"
          style={{
            boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff",
          }}
        >
          OK
        </motion.button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  );
};

export default CheckoutPage;
