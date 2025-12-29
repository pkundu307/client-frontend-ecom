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
    handleSlide,
    handleAddAddress,
  } = useCheckout();

  if (!mounted) return null;

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center px-4">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="show"
          className="bg-[#e8ecf0] rounded-3xl p-8 text-center"
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
    <div className="min-h-screen bg-[#e8ecf0] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="show"
          className="bg-[#e8ecf0] rounded-3xl p-6 mb-8"
          style={{
            boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
          }}
        >
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingBagIcon className="w-8 h-8 text-blue-600" />
            Checkout
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Addresses + Order Items */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Address Section */}
            <motion.section
              variants={cardVariants}
              initial="hidden"
              animate="show"
              className="bg-[#e8ecf0] rounded-3xl p-6"
              style={{
                boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
                  <MapPinIcon className="w-6 h-6 text-blue-600" />
                  Delivery Address
                </h2>
                <motion.button
                  whileTap={tap}
                  onClick={() => setShowAddressModal(true)}
                  className="bg-[#e8ecf0] p-3 rounded-xl flex items-center gap-2 text-gray-900 font-semibold"
                  style={{
                    boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
                  }}
                >
                  <PlusIcon className="w-5 h-5" /> Add
                </motion.button>
              </div>

              {loadingAddresses ? (
                <div
                  className="bg-[#e8ecf0] rounded-2xl p-8 text-center"
                  style={{
                    boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                  }}
                >
                  <p className="text-gray-600">Loading addresses...</p>
                </div>
              ) : addresses.length === 0 ? (
                <div
                  className="bg-[#e8ecf0] rounded-2xl p-8 text-center"
                  style={{
                    boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                  }}
                >
                  <p className="text-gray-600">{`No saved addresses. Click "Add" to add one.`}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <motion.label
                      key={addr.id}
                      whileTap={tap}
                      className={`block cursor-pointer bg-[#e8ecf0] rounded-2xl p-5 transition-all ${
                        selectedAddressId === addr.id
                          ? "ring-2 ring-blue-600"
                          : ""
                      }`}
                      style={{
                        boxShadow:
                          selectedAddressId === addr.id
                            ? "inset 6px 6px 12px #c5cdd5, inset -6px -6px 12px #ffffff"
                            : "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff",
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="radio"
                          name="address"
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1 accent-blue-600 w-5 h-5"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{addr.street}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {addr.city}, {addr.state} {addr.postalCode}
                          </p>
                          <p className="text-sm text-gray-600">{addr.country}</p>
                          {addr.alternativePhoneNumber && (
                            <p className="text-sm text-gray-600 mt-1">📞 {addr.alternativePhoneNumber}</p>
                          )}
                        </div>
                        {selectedAddressId === addr.id && (
                          <CheckCircleIcon className="w-6 h-6 text-blue-600 shrink-0" />
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
              className="bg-[#e8ecf0] rounded-3xl p-6"
              style={{
                boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
              }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
                Order Items ({items.length})
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#e8ecf0] rounded-2xl p-4 flex gap-4"
                    style={{
                      boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                    }}
                  >
                    <div className="w-20 h-20 rounded-xl bg-gray-200 overflow-hidden flex items-center justify-center">
                      <Image
                        src={item.variant?.product?.images?.[0] || "/placeholder.png"}
                        alt={item.variant?.product?.title || ""}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {item.variant?.product?.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Right Column: Payment + Summary */}
          <div className="space-y-8">
            {/* Payment Method */}
            <motion.section
              variants={cardVariants}
              initial="hidden"
              animate="show"
              className="bg-[#e8ecf0] rounded-3xl p-6"
              style={{
                boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
              }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                <CreditCardIcon className="w-6 h-6 text-blue-600" />
                Payment Method
              </h2>
              <div className="space-y-3">
                <motion.label
                  whileTap={tap}
                  className={`block cursor-pointer bg-[#e8ecf0] rounded-2xl p-4 transition-all ${
                    paymentMethod === "cod" ? "ring-2 ring-blue-600" : ""
                  }`}
                  style={{
                    boxShadow:
                      paymentMethod === "cod"
                        ? "inset 6px 6px 12px #c5cdd5, inset -6px -6px 12px #ffffff"
                        : "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-blue-600 w-5 h-5"
                    />
                    <span className="font-semibold text-gray-900">Cash on Delivery</span>
                  </div>
                </motion.label>

                <motion.label
                  whileTap={tap}
                  className={`block cursor-pointer bg-[#e8ecf0] rounded-2xl p-4 transition-all ${
                    paymentMethod === "online" ? "ring-2 ring-green-600" : ""
                  }`}
                  style={{
                    boxShadow:
                      paymentMethod === "online"
                        ? "inset 6px 6px 12px #c5cdd5, inset -6px -6px 12px #ffffff"
                        : "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")}
                      className="accent-green-600 w-5 h-5"
                    />
                    <span className="font-semibold text-gray-900">Pay Online (Razorpay)</span>
                  </div>
                </motion.label>
              </div>
            </motion.section>

            {/* Coupon Section */}
            <motion.section
              variants={cardVariants}
              initial="hidden"
              animate="show"
              className="bg-[#e8ecf0] rounded-3xl p-6"
              style={{
                boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
              }}
            >
              <h2 className="text-xl font-bold mb-4 text-gray-900">Have a Coupon?</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  disabled={couponApplied}
                  className="flex-1 px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600"
                  style={{
                    boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                  }}
                />
                <motion.button
                  whileTap={tap}
                  onClick={applyCoupon}
                  disabled={couponApplied}
                  className={`px-6 py-3 rounded-xl font-semibold ${
                    couponApplied
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-900 text-white"
                  }`}
                  style={{
                    boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
                  }}
                >
                  {couponApplied ? "Applied" : "Apply"}
                </motion.button>
              </div>
              {couponError && (
                <p className="mt-2 text-sm text-red-600">{couponError}</p>
              )}
              {couponApplied && (
                <p className="mt-2 text-sm text-green-700">₹50 discount applied!</p>
              )}
            </motion.section>

            {/* Order Summary */}
            <motion.section
              variants={cardVariants}
              initial="hidden"
              animate="show"
              className="bg-[#e8ecf0] rounded-3xl p-6"
              style={{
                boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
              }}
            >
              <h2 className="text-xl font-bold mb-4 text-gray-900">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                {paymentMethod === "cod" && subtotal < COD_THRESHOLD && (
                  <div className="flex justify-between text-gray-700">
                    <span>COD Fee</span>
                    <span className="font-semibold">+₹30</span>
                  </div>
                )}
                {couponApplied && (
                  <div className="flex justify-between text-green-700">
                    <span>Coupon ({COUPON_CODE})</span>
                    <span className="font-semibold">-₹{COUPON_DISCOUNT}</span>
                  </div>
                )}
                <div
                  className="h-px bg-gray-400"
                  style={{
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                />
                <div className="flex justify-between text-gray-900 text-xl font-bold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Slide to Pay */}
              <div className="mt-6">
                <div
                  ref={slideRef}
                  className="w-full h-16 bg-[#e8ecf0] rounded-full relative select-none"
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
                    className="absolute z-10 top-1/2 -translate-y-1/2 w-14 h-14 bg-gray-900 text-white flex items-center justify-center rounded-full shadow-lg cursor-grab active:cursor-grabbing"
                  >
                    {slideProgress > 0.97 ? "✓" : <ArrowRightIcon className="w-6 h-6" />}
                  </motion.div>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-base font-bold text-gray-700">
                    {slideProgress > 0.97
                      ? paymentMethod === "online"
                        ? "Opening Razorpay..."
                        : "Placing COD order..."
                      : "Slide to Pay"}
                  </div>
                </div>
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
            className="fixed inset-0 bg-black/40 backdrop-blur-lg flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddressModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#e8ecf0] rounded-3xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
              style={{
                boxShadow: "20px 20px 40px #c5cdd5, -20px -20px 40px #ffffff",
              }}
            >
              <button
                onClick={() => setShowAddressModal(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Address</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Street Address"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600"
                  style={{
                    boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                  }}
                />
                <input
                  type="tel"
                  required
                  placeholder="Alternate Phone Number"
                  value={newAddress.alternativePhoneNumber}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      alternativePhoneNumber: e.target.value.replace(/\D/g, "").slice(0, 10),
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600"
                  style={{
                    boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                  }}
                  maxLength={10}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600"
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
                    className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600"
                    style={{
                      boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
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
                    className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600"
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
                    className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600"
                    style={{
                      boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                    }}
                  />
                </div>
                <motion.button
                  whileTap={tap}
                  onClick={handleAddAddress}
                  disabled={savingAddress}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold disabled:opacity-50"
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
    </div>
  );
};

export default CheckoutPage;
