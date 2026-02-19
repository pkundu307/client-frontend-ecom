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
  StarIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
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
  productId: string;
  hasReview?: boolean;
  businessId?: string;
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

// ✅ Add Ticket type
type Ticket = {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  _count: {
    messages: number;
  };
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

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewProductId, setReviewProductId] = useState<string | null>(null);
  const [reviewProductName, setReviewProductName] = useState<string>("");
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const [reviewImagePreview, setReviewImagePreview] = useState<string | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // ✅ Fixed: Use proper Ticket[] type instead of any[]
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [existingTickets, setExistingTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [complaintTitle, setComplaintTitle] = useState("");
  const [complaintDescription, setComplaintDescription] = useState("");
  const [complaintPriority, setComplaintPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [submittingComplaint, setSubmittingComplaint] = useState(false);
  const [complaintError, setComplaintError] = useState<string | null>(null);

  // Add this function to fetch tickets
  const fetchOrderTickets = async () => {
    if (!orderId) return;

    setLoadingTickets(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<Ticket[]>(
        `${baseUrl}/customer/tickets/order/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExistingTickets(response.data);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setLoadingTickets(false);
    }
  };

  // Function to open complaint modal
  const openComplaintModal = async () => {
    setShowComplaintModal(true);
    setComplaintError(null);
    await fetchOrderTickets();
  };

  // ✅ Fixed line 110: Remove any type
  const handleSubmitComplaint = async () => {
    if (!complaintTitle.trim() || !complaintDescription.trim()) {
      setComplaintError("Please fill in both title and description");
      return;
    }

    if (!order?.items[0]?.businessId) {
      setComplaintError("Business information not found");
      return;
    }

    setSubmittingComplaint(true);
    setComplaintError(null);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${baseUrl}/customer/tickets`,
        {
          title: complaintTitle,
          description: complaintDescription,
          businessId: order.items[0].businessId,
          orderId: orderId,
          priority: complaintPriority,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Complaint submitted successfully!");
      setShowComplaintModal(false);
      setComplaintTitle("");
      setComplaintDescription("");
      setComplaintPriority("MEDIUM");

      await fetchOrderTickets();
    } catch (err) {
      console.error("Failed to submit complaint:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Failed to submit complaint";
      setComplaintError(errorMessage);
    } finally {
      setSubmittingComplaint(false);
    }
  };

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
        setReviewProductId(data.items[0]?.productId || null);
      } catch {
        setError("Failed to load order.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  const canCancelOrder = () => {
    if (!order) return false;
    const cancellableStatuses = ["pending", "processing"];
    const orderStatus = order.status.toLowerCase();
    return cancellableStatuses.includes(orderStatus);
  };

  const canReviewOrder = () => {
    if (!order) return false;
    return order.status.toLowerCase() === "delivered";
  };

  // ✅ Fixed line 180: Remove any type
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

      const res = await fetch(`${baseUrl}/orders/my-orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedOrder: OrderDetail = await res.json();
      setOrder(updatedOrder);

      setShowCancelModal(false);
      setSelectedReason("");
      setCustomReason("");

      alert("Order cancelled successfully!");
    } catch (err) {
      console.error("Failed to cancel order:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Failed to cancel order. Please try again.";
      setCancelError(errorMessage);
    } finally {
      setCancelling(false);
    }
  };

  const openReviewModal = (productId: string, productName: string) => {
    setReviewProductId(productId);
    setReviewProductName(productName);
    setShowReviewModal(true);
    setReviewRating(0);
    setReviewTitle("");
    setReviewComment("");
    setReviewImage(null);
    setReviewImagePreview(null);
    setReviewError(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setReviewError("Image size must be less than 5MB");
        return;
      }
      setReviewImage(file);
      setReviewImagePreview(URL.createObjectURL(file));
      setReviewError(null);
    }
  };

  const handleStarClick = (star: number) => {
    setReviewRating(star);
    setReviewError(null);
  };

  const handleSubmitReview = async () => {
    setReviewError(null);

    if (reviewRating === 0 || !reviewRating) {
      setReviewError("Please select a rating from 1 to 5 stars");
      return;
    }

    if (!reviewProductId) {
      setReviewError("Product information is missing");
      return;
    }

    setSubmittingReview(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to submit a review");
      }

      const formData = new FormData();
      formData.append("rating", reviewRating.toString());
      if (reviewTitle?.trim()) formData.append("title", reviewTitle.trim());
      if (reviewComment?.trim())
        formData.append("comment", reviewComment.trim());
      if (reviewImage) formData.append("file", reviewImage);

      await axios.post(
        `${baseUrl}/user/addresses/review/${reviewProductId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowReviewModal(false);
      setReviewRating(0);
      setReviewTitle("");
      setReviewComment("");
      setReviewImage(null);
      setReviewImagePreview(null);

      alert("Review submitted successfully! Thank you for your feedback.");

      const res = await fetch(`${baseUrl}/orders/my-orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const updatedOrder: OrderDetail = await res.json();
        setOrder(updatedOrder);
      }
    } catch (err: unknown) {
      console.error("Review submission error:", err);

      let errorMessage = "Failed to submit review. Please try again.";

      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response?.status === 400) {
          errorMessage = "Invalid review data. Please check your input.";
        } else if (err.response?.status === 409) {
          errorMessage = "You have already reviewed this product.";
        } else if (err.response?.status === 401) {
          errorMessage = "Please login to submit a review.";
        }
      }

      setReviewError(errorMessage);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center px-4">
        <div
          className="bg-[#e8ecf0] rounded-3xl px-8 py-6 text-center max-w-md w-full"
          style={{
            boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
          }}
        >
          <p className="text-red-600 font-semibold mb-4 text-lg">
            {error || "Order not found"}
          </p>
          <button
            onClick={() => router.push("/profile")}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  const address = order.selectedAddress;

  return (
    <div className="min-h-screen bg-[#e8ecf0] px-4 py-6 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Back + header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="rounded-full p-2 bg-[#e8ecf0] text-gray-700 hover:text-gray-900 transition-colors flex-shrink-0"
            style={{
              boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
            }}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
              Order Details
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 truncate">
              Order #{order.orderNumber || order.id}
            </p>
          </div>
        </div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="show"
          className="bg-[#e8ecf0] rounded-3xl p-4 sm:p-6 md:p-8"
          style={{
            boxShadow: "16px 16px 32px #c5cdd5, -16px -16px 32px #ffffff",
          }}
        >
          {/* Top summary - Responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
                <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                <span className="font-semibold text-sm sm:text-base truncate">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              {order.estimatedDeliveryDate && (
                <p className="text-xs text-gray-600 mt-2 truncate">
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
                <CreditCardIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                <span className="font-semibold text-sm sm:text-base capitalize truncate">
                  {order.paymentMethod === "cash_on_delivery"
                    ? "COD"
                    : order.paymentMethod}
                </span>
              </div>
              <p className="text-xs mt-1 text-gray-600 truncate">
                Status:{" "}
                <span className="font-semibold capitalize">
                  {order.paymentStatus}
                </span>
              </p>
            </div>

            <div
              className="bg-[#e8ecf0] rounded-2xl p-4 sm:col-span-2 lg:col-span-1"
              style={{
                boxShadow:
                  "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
              }}
            >
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Total
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 tabular-nums">
                ₹{Number(order.totalAmount).toFixed(2)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Items: {order.itemCount}
              </p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  order.status.toLowerCase() === "delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status.toLowerCase() === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>

          {/* Main content - Mobile first layout */}
          <div className="space-y-6">
            {/* Order Items Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBagIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Order Items
                </h2>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="bg-[#e8ecf0] rounded-2xl p-3 sm:p-4"
                    style={{
                      boxShadow:
                        "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                    }}
                  >
                    <div className="flex gap-3 mb-3">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.productImage || "/placeholder.png"}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          SKU: {item.variantSku}
                        </p>
                        <p className="text-xs text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base whitespace-nowrap">
                          ₹{Number(item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Review button */}
                    {canReviewOrder() && (
                      <div className="grid grid-cols-2 gap-2">
                        {!item.hasReview && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              openReviewModal(item.productId, item.productName)
                            }
                            className="bg-blue-600 text-white py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-blue-700"
                            style={{
                              boxShadow:
                                "4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff",
                            }}
                          >
                            <StarIcon className="w-4 h-4" />
                            Write Review
                          </motion.button>
                        )}

                        {item.hasReview && (
                          <div className="text-center text-xs text-green-600 font-semibold bg-green-50 py-2 rounded-xl">
                            ✓ Reviewed
                          </div>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={openComplaintModal}
                          className="bg-red-600 text-white py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-red-700"
                          style={{
                            boxShadow:
                              "4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff",
                          }}
                        >
                          <ExclamationTriangleIcon className="w-4 h-4" />
                          Raise Complaint
                        </motion.button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPinIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
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
                    <p className="mt-1">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="mt-1">{address.country}</p>
                  </>
                ) : (
                  <p className="text-gray-500">No address information.</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              {canCancelOrder() && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCancelModal(true)}
                  className="w-full bg-red-600 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors text-sm sm:text-base"
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
                className="w-full bg-gray-900 text-white py-3 rounded-2xl font-semibold hover:bg-gray-800 transition-colors text-sm sm:text-base"
                style={{
                  boxShadow: "8px 8px 16px #c5cdd5, -6px -6px 12px #ffffff",
                }}
              >
                Back to Orders
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full bg-[#e8ecf0] text-gray-900 py-3 rounded-2xl font-semibold hover:text-blue-600 transition-colors text-sm sm:text-base"
                style={{
                  boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
                }}
              >
                Continue Shopping
              </button>
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
            className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50 p-4"
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
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 disabled:opacity-50 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-100 rounded-full p-3">
                  <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Cancel Order
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    Order #{order.orderNumber}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-6 text-sm sm:text-base">
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
                        className="accent-red-600 w-5 h-5 cursor-pointer flex-shrink-0"
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
                  className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600 mb-6 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-red-600 text-sm"
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
                  className="flex-1 bg-[#e8ecf0] text-gray-900 py-3 rounded-xl font-semibold disabled:opacity-50 hover:text-blue-600 transition-colors text-sm"
                  style={{
                    boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
                  }}
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling || !selectedReason}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors text-sm"
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

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50 p-4"
            onClick={() => {
              if (!submittingReview) {
                setShowReviewModal(false);
                setReviewError(null);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#e8ecf0] rounded-3xl p-6 sm:p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto custom-scrollbar"
              style={{
                boxShadow: "20px 20px 40px #c5cdd5, -20px -20px 40px #ffffff",
              }}
            >
              <button
                onClick={() => {
                  if (!submittingReview) {
                    setShowReviewModal(false);
                    setReviewError(null);
                  }
                }}
                disabled={submittingReview}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 disabled:opacity-50 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
                  <StarIcon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Write a Review
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {reviewProductName}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3 text-center sm:text-left">
                  Rating *{" "}
                  {reviewRating > 0 && (
                    <span className="text-blue-600">
                      ({reviewRating} star{reviewRating > 1 ? "s" : ""})
                    </span>
                  )}
                </label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStarClick(star)}
                      disabled={submittingReview}
                      className="disabled:opacity-50 focus:outline-none transition-transform"
                    >
                      {star <= reviewRating ? (
                        <StarSolidIcon className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
                      ) : (
                        <StarIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 hover:text-yellow-200 transition-colors" />
                      )}
                    </motion.button>
                  ))}
                </div>
                {reviewError && reviewRating === 0 && (
                  <p className="text-xs text-red-600 mt-2 text-center">
                    {reviewError}
                  </p>
                )}
              </div>

              {/* Title */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Review Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Great product!"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  disabled={submittingReview}
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 text-sm"
                  style={{
                    boxShadow:
                      "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                  }}
                />
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Your Review (Optional)
                </label>
                <textarea
                  placeholder="Share your experience..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  disabled={submittingReview}
                  maxLength={500}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 text-sm"
                  style={{
                    boxShadow:
                      "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                  }}
                />
                <p className="text-xs text-gray-600 mt-1 text-right">
                  {reviewComment.length}/500
                </p>
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Add Photo (Optional)
                </label>
                {reviewImagePreview ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={reviewImagePreview}
                      alt="Review preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <button
                      onClick={() => {
                        setReviewImage(null);
                        setReviewImagePreview(null);
                      }}
                      disabled={submittingReview}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <label
                    className="block cursor-pointer bg-[#e8ecf0] rounded-xl p-6 sm:p-8 text-center hover:bg-gray-100 transition-colors"
                    style={{
                      boxShadow:
                        "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                    }}
                  >
                    <PhotoIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-medium">
                      Click to upload
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Max 5MB (JPG, PNG)
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={submittingReview}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {reviewError && reviewRating > 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{reviewError}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewError(null);
                  }}
                  disabled={submittingReview}
                  className="flex-1 bg-[#e8ecf0] text-gray-900 py-3 rounded-xl font-semibold disabled:opacity-50 hover:text-blue-600 transition-colors text-sm"
                  style={{
                    boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={submittingReview || reviewRating === 0}
                  className={`flex-1 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm ${
                    reviewRating === 0
                      ? "bg-gray-400 text-gray-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  style={{
                    boxShadow:
                      reviewRating === 0
                        ? "4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff"
                        : "8px 8px 16px #c5cdd5, -6px -6px 12px #ffffff",
                  }}
                >
                  {submittingReview ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting...
                    </span>
                  ) : reviewRating === 0 ? (
                    "Select Rating"
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complaint Modal */}
      <AnimatePresence>
        {showComplaintModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50 p-4"
            onClick={() => {
              if (!submittingComplaint) {
                setShowComplaintModal(false);
                setComplaintError(null);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#e8ecf0] rounded-3xl p-6 sm:p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar"
              style={{
                boxShadow: "20px 20px 40px #c5cdd5, -20px -20px 40px #ffffff",
              }}
            >
              <button
                onClick={() => {
                  if (!submittingComplaint) {
                    setShowComplaintModal(false);
                    setComplaintError(null);
                  }
                }}
                disabled={submittingComplaint}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 disabled:opacity-50 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-100 rounded-full p-3 flex-shrink-0">
                  <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Raise a Complaint
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    Order #{order.orderNumber}
                  </p>
                </div>
              </div>

              {/* Existing Tickets */}
              {loadingTickets ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  <p className="text-sm text-gray-600 mt-2">Loading tickets...</p>
                </div>
              ) : existingTickets.length > 0 ? (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Existing Complaints:
                  </h4>
                  <div className="space-y-2">
                    {existingTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="bg-[#e8ecf0] rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                        style={{
                          boxShadow:
                            "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                        }}
                        onClick={() => router.push(`/profile/tickets/${ticket.id}`)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-semibold text-gray-900 text-sm">
                            {ticket.title}
                          </p>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              ticket.status === "OPEN"
                                ? "bg-yellow-100 text-yellow-700"
                                : ticket.status === "RESOLVED"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {ticket._count.messages} messages •{" "}
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <p className="text-sm font-semibold text-gray-900 mb-3">
                      Or create a new complaint:
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600 mb-4">
                  No existing complaints for this order. Create one below:
                </p>
              )}

              {/* New Complaint Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Complaint Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Defective Product Received"
                    value={complaintTitle}
                    onChange={(e) => setComplaintTitle(e.target.value)}
                    disabled={submittingComplaint}
                    maxLength={100}
                    className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50 text-sm"
                    style={{
                      boxShadow:
                        "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Description *
                  </label>
                  <textarea
                    placeholder="Describe your issue in detail..."
                    value={complaintDescription}
                    onChange={(e) => setComplaintDescription(e.target.value)}
                    disabled={submittingComplaint}
                    maxLength={500}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50 text-sm"
                    style={{
                      boxShadow:
                        "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                    }}
                  />
                  <p className="text-xs text-gray-600 mt-1 text-right">
                    {complaintDescription.length}/500
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Priority
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["LOW", "MEDIUM", "HIGH"] as const).map((priority) => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => setComplaintPriority(priority)}
                        disabled={submittingComplaint}
                        className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                          complaintPriority === priority
                            ? priority === "HIGH"
                              ? "bg-red-600 text-white"
                              : priority === "MEDIUM"
                              ? "bg-yellow-600 text-yellow-50"
                              : "bg-green-600 text-white"
                            : "bg-[#e8ecf0] text-gray-700"
                        }`}
                        style={{
                          boxShadow:
                            complaintPriority === priority
                              ? "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff"
                              : "4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff",
                        }}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>

                {complaintError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600">{complaintError}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowComplaintModal(false);
                      setComplaintError(null);
                    }}
                    disabled={submittingComplaint}
                    className="flex-1 bg-[#e8ecf0] text-gray-900 py-3 rounded-xl font-semibold disabled:opacity-50 hover:text-blue-600 transition-colors text-sm"
                    style={{
                      boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitComplaint}
                    disabled={
                      submittingComplaint ||
                      !complaintTitle.trim() ||
                      !complaintDescription.trim()
                    }
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors text-sm"
                    style={{
                      boxShadow: "8px 8px 16px #c5cdd5, -6px -6px 12px #ffffff",
                    }}
                  >
                    {submittingComplaint ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      "Submit Complaint"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #e8ecf0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c5cdd5;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8b3bd;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default OrderDetailPage;
