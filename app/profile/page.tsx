// src/app/profile/page.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MapPinIcon,
  EnvelopeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  ShoppingBagIcon,
  CalendarIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  StarIcon,
  HomeIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { useProfileData, Address, Order } from "./hooks/useProfileData";

// ─── Constants ───────────────────────────────────────────────────────────────

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
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

const tap = { scale: 0.97 };

const neuShadow = "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff";
const neuInset  = "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff";

// ─── Empty form helper ────────────────────────────────────────────────────────

const emptyForm = (): Omit<Address, "id"> => ({
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  landmark: "",
  alternativePhoneNumber: "",
  isDefault: false,
  type: "HOME",
});

// ─── Component ────────────────────────────────────────────────────────────────

const ProfilePage: React.FC = () => {
  const router = useRouter();

  const {
    user,
    addresses,
    orders,
    isLoading,
    isAddressMutating,
    addAddress,
    updateAddress,
    deleteAddress,
  } = useProfileData();

  const [isAddModalOpen,  setIsAddModalOpen]  = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAddress,  setEditingAddress]  = useState<Address | null>(null);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [showAllOrders,    setShowAllOrders]    = useState(false);
  const [expandedOrderId,  setExpandedOrderId]  = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Address, "id">>(emptyForm());

  // ── Handlers ────────────────────────────────────────────────────────────────

  const openAddModal = () => {
    setFormData(emptyForm());
    setIsAddModalOpen(true);
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      street:                 address.street,
      city:                   address.city,
      state:                  address.state,
      postalCode:             address.postalCode,
      country:                address.country,
      landmark:               address.landmark               || "",
      alternativePhoneNumber: address.alternativePhoneNumber || "",
      isDefault:              address.isDefault              ?? false,
      type:                   address.type                   || "HOME",
    });
    setIsEditModalOpen(true);
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingAddress(null);
    setFormData(emptyForm());
  };

  const handleSaveAddress = async () => {
    if (isEditModalOpen && editingAddress) {
      await updateAddress(editingAddress.id, formData);
    } else {
      await addAddress(formData);
    }
    if (!isAddressMutating) closeModals();
  };

  const set = (field: keyof Omit<Address, "id">, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  // ── Guards ──────────────────────────────────────────────────────────────────

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center">
        <p className="text-gray-600">Please login to view your profile</p>
      </div>
    );
  }

  const visibleAddresses = !showAllAddresses && addresses.length > 2
    ? addresses.slice(0, 2)
    : addresses;

  const visibleOrders: Order[] = !showAllOrders && orders.length > 3
    ? orders.slice(0, 3)
    : orders;

  const userPhoto =
    typeof window !== "undefined" ? localStorage.getItem("profilePhoto") : null;

  // ── Address type icon helper ─────────────────────────────────────────────────

  const TypeIcon = ({ type }: { type?: string }) => {
    if (type === "WORK") return <BuildingOfficeIcon className="w-4 h-4 text-blue-500" />;
    return <HomeIcon className="w-4 h-4 text-green-500" />;
  };

  // ── JSX ─────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#e8ecf0] px-4 py-8">
      <div className="max-w-5xl mx-auto">

        {/* ── Profile Header ── */}
        <motion.div
          variants={cardVariants} initial="hidden" animate="show"
          className="bg-[#e8ecf0] rounded-3xl p-6 sm:p-8"
          style={{ boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff" }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="rounded-full p-1" style={{ boxShadow: neuShadow }}>
              <Image
                src={userPhoto || "/avatar.jpg"}
                alt={user.name}
                width={104} height={104}
                className="rounded-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              {user.email && (
                <div className="mt-2 flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                  <EnvelopeIcon className="w-5 h-5" />
                  <span>{user.email}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Quick Actions Grid ── */}
        <section className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Wishlist */}
            <motion.div
              variants={cardVariants} initial="hidden" animate="show"
              whileHover={{ scale: 1.02 }} whileTap={tap}
              onClick={() => router.push("/wishlist")}
              className="bg-[#e8ecf0] rounded-2xl p-6 cursor-pointer group"
              style={{ boxShadow: neuShadow }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <HeartIcon className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">My Wishlist</h3>
                  <p className="text-sm text-gray-600 mt-1">View saved items</p>
                </div>
                <svg className="w-6 h-6 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>

            {/* Tickets */}
            <motion.div
              variants={cardVariants} initial="hidden" animate="show"
              whileHover={{ scale: 1.02 }} whileTap={tap}
              onClick={() => router.push("/profile/tickets")}
              className="bg-[#e8ecf0] rounded-2xl p-6 cursor-pointer group"
              style={{ boxShadow: neuShadow }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">My Tickets</h3>
                  <p className="text-sm text-gray-600 mt-1">View support tickets</p>
                </div>
                <svg className="w-6 h-6 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>

            {/* Orders */}
            <motion.div
              variants={cardVariants} initial="hidden" animate="show"
              whileHover={{ scale: 1.02 }} whileTap={tap}
              onClick={() => router.push("/orders")}
              className="bg-[#e8ecf0] rounded-2xl p-6 cursor-pointer group"
              style={{ boxShadow: neuShadow }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <ShoppingBagIcon className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">All Orders</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {orders.length} {orders.length === 1 ? "order" : "orders"}
                  </p>
                </div>
                <svg className="w-6 h-6 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>

            {/* Add Address */}
            <motion.div
              variants={cardVariants} initial="hidden" animate="show"
              whileHover={{ scale: 1.02 }} whileTap={tap}
              onClick={openAddModal}
              className="bg-[#e8ecf0] rounded-2xl p-6 cursor-pointer group"
              style={{ boxShadow: neuShadow }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <MapPinIcon className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Add Address</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {addresses.length} {addresses.length === 1 ? "address" : "addresses"} saved
                  </p>
                </div>
                <svg className="w-6 h-6 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>

          </div>
        </section>

        {/* ── Saved Addresses ── */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
              <MapPinIcon className="w-6 h-6 text-blue-600" /> Saved Addresses
            </h2>
            <motion.button
              whileTap={tap} onClick={openAddModal}
              className="bg-[#e8ecf0] p-3 rounded-xl flex items-center gap-2 text-gray-900 font-semibold"
              style={{ boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff" }}
            >
              <PlusIcon className="w-5 h-5" /> Add
            </motion.button>
          </div>

          {addresses.length === 0 ? (
            <div className="bg-[#e8ecf0] rounded-2xl p-8 text-center" style={{ boxShadow: neuShadow }}>
              <p className="text-gray-600">No addresses saved yet</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2">
                <AnimatePresence initial={false}>
                  {visibleAddresses.map((address) => (
                    <motion.div
                      key={address.id}
                      variants={cardVariants} initial="hidden" animate="show"
                      exit={{ opacity: 0, y: -8 }}
                      className="bg-[#e8ecf0] rounded-2xl p-5 relative group"
                      style={{ boxShadow: neuShadow }}
                    >
                      {/* Action Buttons */}
                      <div className="absolute top-3 right-3 flex gap-2 z-10">
                        <motion.button
                          whileTap={tap} onClick={() => openEditModal(address)}
                          className="bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-100"
                          title="Edit address"
                        >
                          <PencilIcon className="w-5 h-5 text-gray-700" />
                        </motion.button>
                        <motion.button
                          whileTap={tap} onClick={() => deleteAddress(address.id)}
                          disabled={isAddressMutating}
                          className="bg-white w-10 h-10 rounded-xl flex items-center justify-center ring-2 ring-red-100 hover:bg-red-50"
                          style={{ boxShadow: "0 4px 16px #ff3333" }}
                          title="Delete address"
                        >
                          <TrashIcon className="w-5 h-5 text-red-500" />
                        </motion.button>
                      </div>

                      {/* Address Type + Default Badge */}
                      <div className="flex items-center gap-2 mb-2">
                      <TypeIcon type={address.type ?? undefined} />

                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {address.type || "HOME"}
                        </span>
                        {address.isDefault && (
                          <span className="ml-1 flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <StarSolid className="w-3 h-3" /> Default
                          </span>
                        )}
                      </div>

                      {/* Address Details */}
                      <p className="font-semibold text-gray-900 pr-24">{address.street}</p>
                      {address.landmark && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          Near: {address.landmark}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        {address.city}, {address.state} – {address.postalCode}
                      </p>
                      <p className="text-sm text-gray-600">{address.country}</p>
                      {address.alternativePhoneNumber && (
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <PhoneIcon className="w-4 h-4" />
                          {address.alternativePhoneNumber}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {addresses.length > 2 && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => setShowAllAddresses((v) => !v)}
                    className="text-blue-600 font-semibold text-sm hover:underline"
                  >
                    {showAllAddresses ? "Show Less" : `View All (${addresses.length})`}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* ── Order History ── */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
              <ShoppingBagIcon className="w-6 h-6 text-blue-600" /> Order History
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="bg-[#e8ecf0] rounded-2xl p-8 text-center" style={{ boxShadow: neuShadow }}>
              <p className="text-gray-600">No orders found</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {visibleOrders.map((order) => {
                    const isExpanded = expandedOrderId === order.id;
                    return (
                      <motion.div
                        key={order.id}
                        variants={cardVariants} initial="hidden" animate="show"
                        exit={{ opacity: 0, y: -8 }}
                        className="bg-[#e8ecf0] rounded-2xl p-5 flex flex-col gap-4 cursor-pointer"
                        style={{ boxShadow: neuShadow }}
                        onClick={() => router.push(`/order/${order.id}`)}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <p className="font-semibold text-gray-900">
                              Order #{order.orderNumber || order.id}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <CalendarIcon className="w-4 h-4" />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">Payment: {order.paymentMethod}</p>
                            <p className="text-sm text-gray-600">Items: {order.itemCount}</p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="font-bold text-2xl text-gray-900 tabular-nums">
                              ₹{Number(order.totalAmount).toFixed(2)}
                            </p>
                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                              order.status === "delivered"
                                ? "bg-white/40 backdrop-blur-xl text-green-700 border-2 border-green-500"
                                : "bg-white/40 backdrop-blur-xl text-yellow-700 border-2 border-yellow-500"
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedOrderId((prev) => (prev === order.id ? null : order.id));
                          }}
                          className="text-blue-600 text-sm font-semibold self-start hover:underline"
                        >
                          {isExpanded ? "Hide details" : "Show details"}
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-2 space-y-3 text-sm text-gray-700">
                                {order.selectedAddress && (
                                  <div>
                                    <p className="font-semibold text-gray-900">Delivery Address</p>
                                    <p>{order.selectedAddress.street}</p>
                                    <p>
                                      {order.selectedAddress.city}, {order.selectedAddress.state}{" "}
                                      {order.selectedAddress.postalCode}
                                    </p>
                                    <p>{order.selectedAddress.country}</p>
                                  </div>
                                )}
                                {order.items && order.items.length > 0 && (
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex items-center justify-center">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={order.items[0].productImage || "/placeholder.png"}
                                        alt={order.items[0].productName}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-semibold text-gray-900">
                                        {order.items[0].productName}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        Qty: {order.items[0].quantity}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {orders.length > 3 && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => setShowAllOrders((v) => !v)}
                    className="text-blue-600 font-semibold text-sm hover:underline"
                  >
                    {showAllOrders ? "Show Less" : `View All (${orders.length})`}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* ── Add / Edit Address Modal ── */}
        <AnimatePresence>
          {(isAddModalOpen || isEditModalOpen) && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-lg flex items-center justify-center z-50 p-4"
              onClick={closeModals}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#e8ecf0] rounded-3xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
                style={{ boxShadow: "20px 20px 40px #c5cdd5, -20px -20px 40px #ffffff" }}
              >
                <button onClick={closeModals} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900">
                  <XMarkIcon className="w-6 h-6" />
                </button>

                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {isEditModalOpen ? "Edit Address" : "Add New Address"}
                </h3>

                <div className="space-y-4">

                  {/* Street */}
                  <input
                    type="text" placeholder="Street Address *"
                    value={formData.street}
                    onChange={(e) => set("street", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-500 outline-none"
                    style={{ boxShadow: neuInset }}
                  />

                  {/* City */}
                  <input
                    type="text" placeholder="City *"
                    value={formData.city}
                    onChange={(e) => set("city", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-500 outline-none"
                    style={{ boxShadow: neuInset }}
                  />

                  {/* State Dropdown */}
                  <div className="relative">
                    <select
                      value={formData.state}
                      onChange={(e) => set("state", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 appearance-none cursor-pointer outline-none"
                      style={{ boxShadow: neuInset }}
                    >
                      <option value="">Select State *</option>
                      {indianStates.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Postal Code */}
                  <input
                    type="text" placeholder="Postal Code *"
                    value={formData.postalCode}
                    onChange={(e) => set("postalCode", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-500 outline-none"
                    style={{ boxShadow: neuInset }}
                  />

                  {/* Country */}
                  <input
                    type="text" placeholder="Country *"
                    value={formData.country}
                    onChange={(e) => set("country", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-500 outline-none"
                    style={{ boxShadow: neuInset }}
                  />

                  {/* Landmark */}
                  <input
                    type="text" placeholder="Landmark (optional)"
                    value={formData.landmark || ""}
                    onChange={(e) => set("landmark", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-500 outline-none"
                    style={{ boxShadow: neuInset }}
                  />

                  {/* Alternative Phone */}
                  <input
                    type="tel" placeholder="Alternative Phone (optional)"
                    value={formData.alternativePhoneNumber || ""}
                    onChange={(e) => set("alternativePhoneNumber", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-500 outline-none"
                    style={{ boxShadow: neuInset }}
                  />

                  {/* Address Type */}
                  <div className="relative">
                    <select
                      value={formData.type || "HOME"}
                      onChange={(e) => set("type", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 appearance-none cursor-pointer outline-none"
                      style={{ boxShadow: neuInset }}
                    >
                      <option value="HOME">🏠 Home</option>
                      <option value="WORK">🏢 Work</option>
                      <option value="OTHER">📍 Other</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Set as Default Toggle */}
                  <label className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer" style={{ boxShadow: neuInset }}>
                    <div className="flex items-center gap-2 text-gray-900 font-medium">
                      <StarIcon className="w-5 h-5 text-amber-500" />
                      Set as Default Address
                    </div>
                    <div
                      onClick={() => set("isDefault", !formData.isDefault)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                        formData.isDefault ? "bg-gray-900" : "bg-gray-300"
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                        formData.isDefault ? "translate-x-7" : "translate-x-1"
                      }`} />
                    </div>
                  </label>

                  {/* Submit Button */}
                  <motion.button
                    whileTap={tap}
                    onClick={handleSaveAddress}
                    disabled={isAddressMutating}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold disabled:opacity-50"
                    style={{ boxShadow: "8px 8px 16px #c5cdd5, -6px -6px 12px #ffffff" }}
                  >
                    {isAddressMutating
                      ? "Saving..."
                      : isEditModalOpen
                      ? "Update Address"
                      : "Add Address"}
                  </motion.button>

                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default ProfilePage;
