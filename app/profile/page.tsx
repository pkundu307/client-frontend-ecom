"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPinIcon,
  EnvelopeIcon,
  ShoppingBagIcon,
  CalendarIcon,
  PlusIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { baseUrl } from "../utilities/baseUrl";

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

interface User {
  name: string;
  email?: string;
  picture?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

const tap = { scale: 0.97 };

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders] = useState<Order[]>([]); // Orders will be implemented later
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch addresses
  const fetchAddresses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${baseUrl}/user/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Add address
  const handleAddAddress = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add address");
      return;
    }

    if (!formData.street || !formData.city || !formData.state || !formData.postalCode || !formData.country) {
      toast.error("Please fill all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${baseUrl}/user/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Address added successfully!");
        setIsAddModalOpen(false);
        setFormData({ street: "", city: "", state: "", postalCode: "", country: "" });
        fetchAddresses();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to add address");
      }
    } catch (error) {
      toast.error("Error adding address");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update address
  const handleUpdateAddress = async () => {
    const token = localStorage.getItem("token");
    if (!token || !editingAddress) return;

    if (!formData.street || !formData.city || !formData.state || !formData.postalCode || !formData.country) {
      toast.error("Please fill all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${baseUrl}/user/addresses/${editingAddress.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Address updated successfully!");
        setIsEditModalOpen(false);
        setEditingAddress(null);
        setFormData({ street: "", city: "", state: "", postalCode: "", country: "" });
        fetchAddresses();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update address");
      }
    } catch (error) {
      toast.error("Error updating address");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Open edit modal
  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    });
    setIsEditModalOpen(true);
  };

  // Close modals
  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingAddress(null);
    setFormData({ street: "", city: "", state: "", postalCode: "", country: "" });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center">
        <p className="text-gray-600">Please login to view your profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e8ecf0] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="show"
          className="bg-[#e8ecf0] rounded-3xl p-6 sm:p-8"
          style={{
            boxShadow: '12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff'
          }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div
              className="rounded-full p-1"
              style={{
                boxShadow: '8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff'
              }}
            >
              <Image
                src={localStorage.getItem("photo") || "/avatar.jpg"}
                alt={user.name}
                width={104}
                height={104}
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

        {/* Addresses */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
              <MapPinIcon className="w-6 h-6 text-blue-600" /> Saved Addresses
            </h2>
            <motion.button
              whileTap={tap}
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#e8ecf0] p-3 rounded-xl flex items-center gap-2 text-gray-900 font-semibold"
              style={{
                boxShadow: '6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff'
              }}
            >
              <PlusIcon className="w-5 h-5" />
              Add
            </motion.button>
          </div>
          
          {addresses.length === 0 ? (
            <div className="bg-[#e8ecf0] rounded-2xl p-8 text-center" style={{ boxShadow: '8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff' }}>
              <p className="text-gray-600">No addresses saved yet</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              <AnimatePresence initial={false}>
                {addresses.map((address) => (
                  <motion.div
                    key={address.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, y: -8 }}
                    className="bg-[#e8ecf0] rounded-2xl p-5 relative group"
                    style={{
                      boxShadow: '8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff'
                    }}
                  >
                    <motion.button
                      whileTap={tap}
                      onClick={() => openEditModal(address)}
                      className="absolute top-3 right-3 bg-[#e8ecf0] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        boxShadow: '4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff'
                      }}
                    >
                      <PencilIcon className="w-4 h-4 text-gray-700" />
                    </motion.button>
                    <p className="font-semibold text-gray-900">{address.street}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-sm text-gray-600">{address.country}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Orders */}
        <section className="mt-10 pb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
            <ShoppingBagIcon className="w-6 h-6 text-blue-600" /> Order History
          </h2>
          {orders.length === 0 ? (
            <div className="bg-[#e8ecf0] rounded-2xl p-8 text-center" style={{ boxShadow: '8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff' }}>
              <p className="text-gray-600">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, y: -8 }}
                    className="bg-[#e8ecf0] rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    style={{
                      boxShadow: '8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff'
                    }}
                  >
                    <div>
                      <p className="font-semibold text-gray-900">Order #{order.id}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <CalendarIcon className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">Payment: {order.paymentMethod}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-bold text-2xl text-gray-900 tabular-nums">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                      <motion.span
                        whileTap={tap}
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === "delivered"
                            ? "bg-white/40 backdrop-blur-xl text-green-700 border-2 border-green-500"
                            : "bg-white/40 backdrop-blur-xl text-yellow-700 border-2 border-yellow-500"
                        }`}
                        style={{
                          boxShadow: order.status === "delivered"
                            ? '0 2px 4px rgba(34, 197, 94, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.3)'
                            : '0 2px 4px rgba(234, 179, 8, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.3)'
                        }}
                      >
                        {order.status}
                      </motion.span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>

      {/* Add/Edit Address Modal */}
      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-lg flex items-center justify-center z-50 p-4"
            onClick={closeModals}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#e8ecf0] rounded-3xl p-6 w-full max-w-md relative"
              style={{
                boxShadow: '20px 20px 40px #c5cdd5, -20px -20px 40px #ffffff'
              }}
            >
              <button
                onClick={closeModals}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {isEditModalOpen ? "Edit Address" : "Add New Address"}
              </h3>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600"
                  style={{
                    boxShadow: 'inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff'
                  }}
                />
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600"
                  style={{
                    boxShadow: 'inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff'
                  }}
                />
                <input
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600"
                  style={{
                    boxShadow: 'inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff'
                  }}
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600"
                  style={{
                    boxShadow: 'inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff'
                  }}
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600"
                  style={{
                    boxShadow: 'inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff'
                  }}
                />

                <motion.button
                  whileTap={tap}
                  onClick={isEditModalOpen ? handleUpdateAddress : handleAddAddress}
                  disabled={isLoading}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold disabled:opacity-50"
                  style={{
                    boxShadow: '8px 8px 16px #c5cdd5, -6px -6px 12px #ffffff'
                  }}
                >
                  {isLoading ? "Saving..." : isEditModalOpen ? "Update Address" : "Add Address"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
