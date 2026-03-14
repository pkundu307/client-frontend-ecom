// src/app/checkout/page.tsx
"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import type { Address } from "../store/types";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  MapPinIcon,
  PlusIcon,
  XMarkIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  HomeIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { useCheckout } from "./useCheckout";

// ── Indian States ─────────────────────────────────────────────────────────────
const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show:   { opacity: 1, y: 0,  scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 24 } },
};
const tap      = { scale: 0.97 };
const neuInset = "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff";

const AddrTypeIcon = ({ type }: { type?: string }) =>
  type === "WORK"
    ? <BuildingOfficeIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
    : <HomeIcon           className="w-4 h-4 text-green-500 flex-shrink-0" />;

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
    couponLoading,
    couponData,
    applyCoupon,
    removeCoupon,
    shippingResult,
    isFreeShippingCoupon,
    subtotal,
    shippingFee,
    codFee,
    discount,
    total,
    slideRef,
    slideProgress,
    isSliding,
    isPlacingOrder,
    handleSlide,
    handlePlaceOrder,
    handleAddAddress,
    showSuccessModal,
    orderData,
    handleSuccessOk,
    packagingFee,
  } = useCheckout();

  const hasCustomizableItems = items.some(
    (item) =>
      item.customizationDetails &&
      Object.keys(item.customizationDetails).length > 0
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (hasCustomizableItems && paymentMethod === "cod") {
      setPaymentMethod("online");
    }
  }, [items]);

  if (!mounted) return null;

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center px-4">
        <motion.div
          variants={cardVariants} initial="hidden" animate="show"
          className="bg-[#e8ecf0] rounded-3xl p-8 text-center max-w-md w-full"
          style={{ boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff" }}
        >
          <ShoppingBagIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Items in Checkout</h3>
          <p className="text-gray-600">Please select items from your cart.</p>
        </motion.div>
      </div>
    );
  }

  const COD_THRESHOLD = 600;

  return (
    <div className="min-h-screen bg-[#e8ecf0] px-3 sm:px-4 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <motion.div
          variants={cardVariants} initial="hidden" animate="show"
          className="bg-[#e8ecf0] rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-6 sm:mb-8"
          style={{ boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff" }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <ShoppingBagIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <span className="truncate">Checkout</span>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">

          {/* ── Left Column ── */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">

            {/* Delivery Address */}
            <motion.section
              variants={cardVariants} initial="hidden" animate="show"
              className="bg-[#e8ecf0] rounded-2xl sm:rounded-3xl p-4 sm:p-6"
              style={{ boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff" }}
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
                  style={{ boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff" }}
                >
                  <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">Add</span>
                </motion.button>
              </div>

              {loadingAddresses ? (
                <div className="bg-[#e8ecf0] rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center" style={{ boxShadow: neuInset }}>
                  <p className="text-gray-600 text-sm sm:text-base">Loading addresses...</p>
                </div>
              ) : addresses.length === 0 ? (
                <div className="bg-[#e8ecf0] rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center" style={{ boxShadow: neuInset }}>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {`No saved addresses. Click "Add" to add one.`}
                  </p>
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
                          type="radio" name="address" value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-0.5 sm:mt-1 accent-blue-600 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <AddrTypeIcon type={addr.type} />
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              {addr.type ?? "HOME"}
                            </span>
                            {addr.isDefault && (
                              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                ★ Default
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base break-words">{addr.street}</p>
                          {addr.landmark && (
                            <p className="text-xs text-gray-500 mt-0.5">Near: {addr.landmark}</p>
                          )}
                          <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
                            {addr.city}, {addr.state} – {addr.postalCode}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">{addr.country}</p>
                          {addr.alternativePhoneNumber && (
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center gap-1">
                              <PhoneIcon className="w-3.5 h-3.5" />
                              {addr.alternativePhoneNumber}
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

            {/* Order Items */}
            <motion.section
              variants={cardVariants} initial="hidden" animate="show"
              className="bg-[#e8ecf0] rounded-2xl sm:rounded-3xl p-4 sm:p-6"
              style={{ boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff" }}
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
                    style={{ boxShadow: neuInset }}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl bg-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                      <Image
                        src={item.variant?.product?.images?.[0] ?? "/placeholder.png"}
                        alt={item.variant?.product?.title ?? ""}
                        width={80} height={80}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">
                        {item.variant?.product?.title}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-700 font-medium mt-0.5">
                        ₹{Number(item.variant?.price ?? 0) * item.quantity}
                      </p>
                      {item.variant?.product?.business?.name && (
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                          <TruckIcon className="w-3 h-3" />
                          {item.variant.product.business.name}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* ── Right Column ── */}
          <div className="space-y-6 sm:space-y-8">

            {/* Payment Method */}
            <motion.section
              variants={cardVariants} initial="hidden" animate="show"
              className="bg-[#e8ecf0] rounded-2xl sm:rounded-3xl p-4 sm:p-6"
              style={{ boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff" }}
            >
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2 text-gray-900">
                <CreditCardIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <span>Payment Method</span>
              </h2>
              <div className="space-y-2 sm:space-y-3">
                <motion.label
                  whileTap={hasCustomizableItems ? undefined : tap}
                  className={`block bg-[#e8ecf0] rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all ${
                    hasCustomizableItems ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                  } ${paymentMethod === "cod" ? "ring-2 ring-blue-600" : ""}`}
                  style={{
                    boxShadow:
                      paymentMethod === "cod"
                        ? "inset 6px 6px 12px #c5cdd5, inset -6px -6px 12px #ffffff"
                        : "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
                  }}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <input
                      type="radio" name="payment" value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => !hasCustomizableItems && setPaymentMethod("cod")}
                      disabled={hasCustomizableItems}
                      className="accent-blue-600 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">
                        Cash on Delivery
                      </span>
                      {hasCustomizableItems && (
                        <span className="text-xs text-red-400 mt-0.5">
                          Not available for customized items
                        </span>
                      )}
                    </div>
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
                      type="radio" name="payment" value="online"
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
              variants={cardVariants} initial="hidden" animate="show"
              className="bg-[#e8ecf0] rounded-2xl sm:rounded-3xl p-4 sm:p-6"
              style={{ boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff" }}
            >
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900">
                Have a Coupon?
              </h2>

              {couponApplied && couponData ? (
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-green-800 font-mono tracking-widest">
                        {couponData.code}
                      </p>
                      <p className="text-xs text-green-600">
                        ₹{couponData.calculatedDiscount} discount applied
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={tap} onClick={removeCoupon}
                    className="text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    Remove
                  </motion.button>
                </div>
              ) : (
                <div
                  className="flex items-center bg-[#e8ecf0] rounded-xl overflow-hidden"
                  style={{ boxShadow: neuInset }}
                >
                  <input
                    type="text" placeholder="ENTER CODE"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    disabled={couponLoading}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !couponApplied) void applyCoupon();
                    }}
                    className="flex-1 px-4 py-3 bg-transparent text-gray-900 placeholder-gray-400 text-sm font-mono tracking-widest outline-none"
                  />
                  <motion.button
                    whileTap={tap}
                    onClick={() => void applyCoupon()}
                    disabled={couponLoading || !couponInput.trim()}
                    className="m-1.5 px-5 py-2.5 rounded-lg font-semibold text-sm bg-gray-800 text-white whitespace-nowrap disabled:opacity-40 flex items-center gap-2 hover:bg-gray-700"
                    style={{ boxShadow: "4px 4px 8px #c5cdd5, -2px -2px 6px #ffffff" }}
                  >
                    {couponLoading ? (
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : "Apply"}
                  </motion.button>
                </div>
              )}

              {couponError && !couponApplied && (
                <p className="mt-2 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                  <span>⚠</span> {couponError}
                </p>
              )}
            </motion.section>

            {/* Order Summary */}
            <motion.section
              variants={cardVariants} initial="hidden" animate="show"
              className="bg-[#e8ecf0] rounded-2xl sm:rounded-3xl p-4 sm:p-6"
              style={{ boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff" }}
            >
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900">
                Order Summary
              </h2>

              <div className="space-y-2 sm:space-y-3">

                {/* Subtotal */}
                <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>

                {/* Shipping Fee */}
                <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                  <div className="flex flex-col">
                    <span>Shipping Fee</span>
                    {!selectedAddressId && (
                      <span className="text-xs text-gray-400 mt-0.5">
                        Select address to calculate
                      </span>
                    )}
                    {shippingResult && shippingResult.shipments.length > 1 && !isFreeShippingCoupon && (
                      <span className="text-xs text-blue-500 mt-0.5">
                        {shippingResult.shipments.length} separate shipments
                      </span>
                    )}
                  </div>
                  {isFreeShippingCoupon ? (
                    <span className="font-semibold text-green-600">FREE</span>
                  ) : !selectedAddressId ? (
                    <span className="font-semibold text-gray-400">—</span>
                  ) : (
                    <span className="font-semibold">+₹{shippingFee}</span>
                  )}
                </div>


                {/* Per-seller shipping breakdown */}
                {shippingResult &&
                  shippingResult.shipments.length > 1 &&
                  !isFreeShippingCoupon && (
                    <div
                      className="space-y-1 ml-3 pl-3 border-l-2 border-gray-200"
                    >
                      {shippingResult.shipments.map((shipment, i) => (
                        <div key={i} className="flex justify-between text-xs text-gray-500">
                          <span className="truncate flex items-center gap-1">
                            <TruckIcon className="w-3 h-3 flex-shrink-0" />
                            {shipment.businessName}
                            <span className="text-gray-400">
                              ({(shipment.chargeableGrams / 1000).toFixed(1)}kg)
                            </span>
                          </span>
                          <span className="font-medium">₹{shipment.shippingCharge}</span>
                        </div>
                      ))}
                    </div>
                  )}

                {/* COD Fee */}
                {paymentMethod === "cod" && subtotal < COD_THRESHOLD && (
                  <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                    <div className="flex flex-col">
                      <span>COD Fee</span>
                      <span className="text-xs text-gray-400 mt-0.5">Cash handling charge</span>
                    </div>
                    <span className="font-semibold">+₹{codFee}</span>
                  </div>
                )}

                {/* Platform Fee */}
                <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                  <div className="flex flex-col">
                    <span>Platform Fee</span>
                    <span className="text-xs text-orange-400 mt-0.5">Non-refundable</span>
                  </div>
                  <span className="font-semibold">+₹4</span>
                </div>
<div className="flex justify-between text-gray-700 text-sm sm:text-base">
  <div className="flex flex-col">
    <span>Packaging & Handling</span>
    <span className="text-xs text-gray-400 mt-0.5">Safe packaging</span>
  </div>
  <span className="font-semibold">+₹{packagingFee}</span>
</div>
                {/* Coupon Discount */}
                {couponApplied && couponData && (
                  <div className="flex justify-between text-green-700 text-sm sm:text-base">
                    <span className="truncate">Coupon ({couponData.code})</span>
                    <span className="font-semibold whitespace-nowrap">
                      -₹{couponData.calculatedDiscount}
                    </span>
                  </div>
                )}

                {/* Other Discount */}
                {discount > 0 && !couponApplied && (
                  <div className="flex justify-between text-green-700 text-sm sm:text-base">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="h-px bg-gray-300 my-1" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }} />

                {/* Total */}
                <div className="flex justify-between text-gray-900 text-lg sm:text-xl font-bold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                {couponApplied && couponData && couponData.calculatedDiscount > 0 && (
                  <div className="flex items-center justify-center gap-1.5 bg-green-50 border border-green-200 rounded-xl px-3 py-2 mt-1">
                    <span className="text-green-600 text-xs font-semibold">
                      🎉 You save ₹{couponData.calculatedDiscount} on this order
                    </span>
                  </div>
                )}
              </div>

              {/* Slide to Pay (Mobile) */}
              <div className="mt-4 sm:mt-6">
                <div className="block lg:hidden">
                  <div
                    ref={slideRef}
                    className="w-full h-14 sm:h-16 bg-[#e8ecf0] rounded-full relative select-none"
                    style={{
                      touchAction: "none",
                      userSelect:  "none",
                      boxShadow:   "inset 6px 6px 12px #c5cdd5, inset -6px -6px 12px #ffffff",
                    }}
                    onPointerDown={handleSlide}
                  >
                    <motion.div
                      style={{
                        left:       `calc(${slideProgress * 100}% - ${slideProgress * 56}px)`,
                        transition: isSliding ? "none" : "left 0.3s",
                      }}
                      className="absolute z-10 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-gray-900 text-white flex items-center justify-center rounded-full shadow-lg cursor-grab active:cursor-grabbing"
                    >
                      {isPlacingOrder ? (
                        <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
                          ? paymentMethod === "online" ? "Opening..." : "Placing..."
                          : "Slide to Pay"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Desktop Button */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => void handlePlaceOrder()}
                  disabled={isPlacingOrder}
                  className="hidden lg:flex w-full py-4 px-6 bg-gray-900 text-white rounded-2xl font-bold items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff" }}
                >
                  {isPlacingOrder ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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

                <p className="text-center text-xs text-gray-400 mt-3">
                  By placing this order you agree to our{" "}
                  <a href="/terms" className="underline hover:text-gray-600">Terms & Conditions</a>.
                  Platform fee of ₹4 is non-refundable.
                </p>
              </div>
            </motion.section>

          </div>
        </div>
      </div>

      {/* ── Add Address Modal ── */}
      <AnimatePresence>
        {showAddressModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-lg flex items-center justify-center z-50 p-3 sm:p-4"
            onClick={() => setShowAddressModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#e8ecf0] rounded-2xl sm:rounded-3xl p-5 sm:p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
              style={{ boxShadow: "20px 20px 40px #c5cdd5, -20px -20px 40px #ffffff" }}
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
                  type="text" required placeholder="Street Address *"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-500 text-sm sm:text-base outline-none"
                  style={{ boxShadow: neuInset }}
                />
                <input
                  type="tel" required placeholder="Contact Number * (10 digits)"
                  value={newAddress.alternativePhoneNumber}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      alternativePhoneNumber: e.target.value.replace(/\D/g, "").slice(0, 10),
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-500 text-sm sm:text-base outline-none"
                  style={{ boxShadow: neuInset }}
                  maxLength={10}
                />
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <input
                    type="text" required placeholder="City *"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-500 text-sm sm:text-base outline-none"
                    style={{ boxShadow: neuInset }}
                  />
                  <input
                    type="text" required placeholder="Postal Code *"
                    value={newAddress.postalCode}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        postalCode: e.target.value.replace(/\D/g, "").slice(0, 6),
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-500 text-sm sm:text-base outline-none"
                    style={{ boxShadow: neuInset }}
                    maxLength={6}
                  />
                </div>

                {/* State Dropdown */}
                <div className="relative">
                  <select
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-[#e8ecf0] text-gray-900 appearance-none cursor-pointer text-sm sm:text-base outline-none"
                    style={{ boxShadow: neuInset }}
                  >
                    <option value="">Select State *</option>
                    {indianStates.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <input
                  type="text" required placeholder="Country *"
                  value={newAddress.country}
                  onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-500 text-sm sm:text-base outline-none"
                  style={{ boxShadow: neuInset }}
                />
                <input
                  type="text" placeholder="Landmark (optional)"
                  value={newAddress.landmark}
                  onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-500 text-sm sm:text-base outline-none"
                  style={{ boxShadow: neuInset }}
                />

                {/* Address Type */}
                <div className="relative">
                  <select
                    value={newAddress.type}
                    onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-[#e8ecf0] text-gray-900 appearance-none cursor-pointer text-sm sm:text-base outline-none"
                    style={{ boxShadow: neuInset }}
                  >
                    <option value="HOME">🏠 Home</option>
                    <option value="WORK">🏢 Work</option>
                    <option value="OTHER">📍 Other</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <motion.button
                  whileTap={tap}
                  onClick={() => void handleAddAddress()}
                  disabled={savingAddress}
                  className="w-full bg-gray-900 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold disabled:opacity-50 text-sm sm:text-base"
                  style={{ boxShadow: "8px 8px 16px #c5cdd5, -6px -6px 12px #ffffff" }}
                >
                  {savingAddress ? "Saving..." : "Save Address"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Order Success Modal ── */}
      <AnimatePresence>
        {showSuccessModal && orderData && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-[60] p-3 sm:p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1,   y: 0  }}
              exit={{ opacity: 0,   scale: 0.9,  y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-[#e8ecf0] rounded-3xl p-6 sm:p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto"
              style={{ boxShadow: "20px 20px 40px #c5cdd5, -20px -20px 40px #ffffff" }}
            >
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

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
                Order Placed Successfully! 🎉
              </h2>
              <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
                Thank you for your order. We&apos;ll send you updates soon.
              </p>

              <div className="bg-blue-50 rounded-2xl p-4 mb-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Order Number</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                  {orderData.orderNumber}
                </p>
              </div>

              <div className="bg-[#e8ecf0] rounded-2xl p-4 mb-6" style={{ boxShadow: neuInset }}>
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
                  {orderData.couponCode && orderData.couponDiscount && (
                    <div className="col-span-2">
                      <p className="text-xs sm:text-sm text-gray-600">Coupon Saved</p>
                      <p className="text-base font-bold text-green-600">
                        -₹{orderData.couponDiscount} ({orderData.couponCode})
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4" /> Delivery Address
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {(orderData.selectedAddress as Address).street}
                  </p>
                  {(orderData.selectedAddress as Address).landmark && (
                    <p className="text-xs text-gray-500">
                      Near: {(orderData.selectedAddress as Address).landmark}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-gray-600">
                    {(orderData.selectedAddress as Address).city},{" "}
                    {(orderData.selectedAddress as Address).state}{" "}
                    {(orderData.selectedAddress as Address).postalCode}
                  </p>
                  {(orderData.selectedAddress as Address).alternativePhoneNumber && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <PhoneIcon className="w-3.5 h-3.5" />
                      {(orderData.selectedAddress as Address).alternativePhoneNumber}
                    </p>
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleSuccessOk}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-base sm:text-lg"
                style={{ boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff" }}
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
