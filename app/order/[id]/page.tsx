"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { baseUrl } from "../../utilities/baseUrl";

type OrderItem = {
  id: string;
  quantity: number;
  price: string;
  productName: string;
  productImage: string;
  productSlug: string;
  variantSku: string;
};

type Address = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type OrderDetail = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: string;
  createdAt: string;
  estimatedDeliveryDate: string | null;
  selectedAddress: Address | null;
  items: OrderItem[];
  itemCount: number;
};

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

const CANCELLATION_REASONS = [
  "Ordered by mistake",
  "Found a better price elsewhere",
  "Changed my mind",
  "Delivery time too long",
  "Wrong product selected",
  "Other (specify below)",
];

const OrderDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const orderId = params.id;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cancel modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setError("Please login to view this order.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${baseUrl}/orders/my-orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.message || "Failed to load order.");
          setLoading(false);
          return;
        }

        const data: OrderDetail = await res.json();
        setOrder(data);
      } catch {
        setError("Failed to load order.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  // Check if order can be cancelled
  const canCancelOrder = () => {
    if (!order) return false;
    
    const cancellableStatuses = ["pending", "processing"];
    const orderStatus = order.status.toLowerCase();
    
    // Check if order is in cancellable status
    if (!cancellableStatuses.includes(orderStatus)) return false;
    
    // For processing status, check if any item is customizable
    if (orderStatus === "processing") {
      // You can add logic here to check if items are customizable
      // For now, we'll allow cancellation of processing orders
      // Add your customizable product check logic here if needed
      return true;
    }
    
    return true;
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    const finalReason =
      selectedReason === "Other (specify below)"
        ? customReason.trim()
        : selectedReason;

    if (!finalReason) {
      setCancelError("Please select or enter a cancellation reason.");
      return;
    }

    setCancelling(true);
    setCancelError(null);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${baseUrl}/orders/${order.id}/cancel`,
        { reason: finalReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh order data
      const res = await fetch(`${baseUrl}/orders/my-orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedOrder: OrderDetail = await res.json();
      setOrder(updatedOrder);

      setShowCancelModal(false);
      setSelectedReason("");
      setCustomReason("");
      
      // Show success message
      alert("Order cancelled successfully!");
    } catch (err: unknown) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to cancel order. Please try again.";
      setCancelError(errorMessage);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center">
        <p className="text-gray-600">Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center">
        <div
          className="bg-[#e8ecf0] rounded-3xl px-8 py-6 text-center"
          style={{
            boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
          }}
        >
          <p className="text-red-600 font-semibold mb-3">
            {error || "Order not found"}
          </p>
          <button
            onClick={() => router.push("/profile")}
            className="text-blue-700 font-semibold hover:underline"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  const address = order.selectedAddress;

  return (
    <div className="min-h-screen bg-[#e8ecf0] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Back + header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="rounded-full p-2 bg-[#e8ecf0] text-gray-700"
            style={{
              boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
            }}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Order Details
            </h1>
            <p className="text-sm text-gray-600">
              Order #{order.orderNumber || order.id}
            </p>
          </div>
        </div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="show"
          className="bg-[#e8ecf0] rounded-3xl p-6 md:p-8"
          style={{
            boxShadow: "16px 16px 32px #c5cdd5, -16px -16px 32px #ffffff",
          }}
        >
          {/* Top summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div
              className="bg-[#e8ecf0] rounded-2xl p-4"
              style={{
                boxShadow:
                  "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
              }}
            >
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Order Date
              </p>
              <div className="flex items-center gap-2 text-gray-900">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              {order.estimatedDeliveryDate && (
                <p className="text-xs text-gray-600 mt-2">
                  Est. delivery:{" "}
                  {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                </p>
              )}
            </div>

            <div
              className="bg-[#e8ecf0] rounded-2xl p-4"
              style={{
                boxShadow:
                  "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
              }}
            >
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Payment
              </p>
              <div className="flex items-center gap-2 text-gray-900">
                <CreditCardIcon className="w-5 h-5 text-blue-600" />
                <span className="font-semibold capitalize">
                  {order.paymentMethod === "cash_on_delivery"
                    ? "Cash on Delivery"
                    : order.paymentMethod}
                </span>
              </div>
              <p className="text-xs mt-1 text-gray-600">
                Status:{" "}
                <span className="font-semibold capitalize">
                  {order.paymentStatus}
                </span>
              </p>
            </div>

            <div
              className="bg-[#e8ecf0] rounded-2xl p-4"
              style={{
                boxShadow:
                  "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
              }}
            >
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Total
              </p>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">
                ₹{Number(order.totalAmount).toFixed(2)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Items: {order.itemCount}
              </p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                  order.status === "delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items list */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBagIcon className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Items
                </h2>
              </div>
              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#e8ecf0] rounded-2xl p-3 flex gap-3"
                    style={{
                      boxShadow:
                        "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                    }}
                  >
                    <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.productImage || "/placeholder.png"}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm md:text-base">
                        {item.productName}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        SKU: {item.variantSku}
                      </p>
                      <p className="text-xs text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 text-sm md:text-base">
                        ₹{Number(item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & actions */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPinIcon className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Delivery Address
                  </h2>
                </div>
                <div
                  className="bg-[#e8ecf0] rounded-2xl p-4 text-sm text-gray-700"
                  style={{
                    boxShadow:
                      "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                  }}
                >
                  {address ? (
                    <>
                      <p className="font-semibold text-gray-900">
                        {address.street}
                      </p>
                      <p>
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p>{address.country}</p>
                    </>
                  ) : (
                    <p className="text-gray-500">No address information.</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {/* Cancel Order Button */}
                {canCancelOrder() && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCancelModal(true)}
                    className="w-full bg-red-600 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2"
                    style={{
                      boxShadow: "8px 8px 16px #c5cdd5, -6px -6px 12px #ffffff",
                    }}
                  >
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    Cancel Order
                  </motion.button>
                )}

                <button
                  onClick={() => router.push("/profile")}
                  className="w-full bg-gray-900 text-white py-3 rounded-2xl font-semibold"
                  style={{
                    boxShadow: "8px 8px 16px #c5cdd5, -6px -6px 12px #ffffff",
                  }}
                >
                  Back to Orders
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="w-full bg-[#e8ecf0] text-gray-900 py-3 rounded-2xl font-semibold"
                  style={{
                    boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Cancel Order Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-80 p-4"
            onClick={() => {
              if (!cancelling) {
                setShowCancelModal(false);
                setCancelError(null);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#e8ecf0] rounded-3xl p-6 sm:p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
              style={{
                boxShadow: "20px 20px 40px #c5cdd5, -20px -20px 40px #ffffff",
              }}
            >
              <button
                onClick={() => {
                  if (!cancelling) {
                    setShowCancelModal(false);
                    setCancelError(null);
                  }
                }}
                disabled={cancelling}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-100 rounded-full p-3">
                  <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Cancel Order
                  </h3>
                  <p className="text-sm text-gray-600">
                    Order #{order.orderNumber}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Please select a reason for cancelling your order:
              </p>

              <div className="space-y-3 mb-6">
                {CANCELLATION_REASONS.map((reason) => (
                  <motion.label
                    key={reason}
                    whileTap={{ scale: 0.98 }}
                    className={`block cursor-pointer bg-[#e8ecf0] rounded-xl p-4 transition-all ${
                      selectedReason === reason ? "ring-2 ring-red-600" : ""
                    }`}
                    style={{
                      boxShadow:
                        selectedReason === reason
                          ? "inset 6px 6px 12px #c5cdd5, inset -6px -6px 12px #ffffff"
                          : "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="reason"
                        value={reason}
                        checked={selectedReason === reason}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="accent-red-600 w-5 h-5"
                        disabled={cancelling}
                      />
                      <span className="text-gray-900 font-medium text-sm">
                        {reason}
                      </span>
                    </div>
                  </motion.label>
                ))}
              </div>

              {selectedReason === "Other (specify below)" && (
                <textarea
                  placeholder="Please specify your reason..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  disabled={cancelling}
                  maxLength={255}
                  className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600 mb-6 min-h-[100px] resize-none"
                  style={{
                    boxShadow:
                      "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                  }}
                />
              )}

              {cancelError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{cancelError}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelError(null);
                    setSelectedReason("");
                    setCustomReason("");
                  }}
                  disabled={cancelling}
                  className="flex-1 bg-[#e8ecf0] text-gray-900 py-3 rounded-xl font-semibold disabled:opacity-50"
                  style={{
                    boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
                  }}
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling || !selectedReason}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    boxShadow: "8px 8px 16px #c5cdd5, -6px -6px 12px #ffffff",
                  }}
                >
                  {cancelling ? "Cancelling..." : "Confirm Cancel"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderDetailPage;
