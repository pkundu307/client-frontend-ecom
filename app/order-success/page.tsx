"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  CheckCircleIcon,
  MapPinIcon,
  ShoppingBagIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface OrderItem {
  productName: string;
  imageUrl: string;
  quantity: number;
  price: string;
}

interface SelectedAddress {
  id: string;
  city: string;
  type: string;
  state: string;
  street: string;
  country: string;
  postalCode: string;
  alternativePhoneNumber: string | null;
}

interface OrderData {
  id: string;
  orderNumber: string;
  createdAt: string;
  totalAmount: string;
  selectedAddress: SelectedAddress;
  items: OrderItem[];
}

const OrderSuccessContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { width, height } = useWindowSize();

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const dataParam = searchParams.get("data");
      if (dataParam) {
        const decoded = decodeURIComponent(dataParam);
        const parsed: OrderData = JSON.parse(decoded);
        setOrderData(parsed);
      }
    } catch (error) {
      console.error("Error parsing order data:", error);
    } finally {
      setLoading(false);
    }

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-semibold">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center px-4">
        <div className="bg-[#e8ecf0] rounded-3xl p-8 text-center max-w-md">
          <p className="text-xl font-bold text-gray-900 mb-4">Order not found</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(orderData.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-[#e8ecf0] px-3 sm:px-4 py-6 sm:py-8">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}

      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="bg-[#e8ecf0] rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8 text-center"
          style={{
            boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block"
          >
            <CheckCircleIcon className="w-20 h-20 sm:w-24 sm:h-24 text-green-600 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-4">
            Thank you for your order. We&apos;ll send you a confirmation email shortly.
          </p>
          <div className="bg-blue-50 rounded-2xl p-4 inline-block">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{orderData.orderNumber}</p>
          </div>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[#e8ecf0] rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8"
          style={{
            boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
          }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
            Order Details
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="text-base font-semibold text-gray-900">{formattedDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-xl font-bold text-gray-900">₹{orderData.totalAmount}</p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4">
            {orderData.items.map((item, index) => (
              <div
                key={index}
                className="bg-[#e8ecf0] rounded-2xl p-4 flex gap-4"
                style={{
                  boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">
                    {item.productName}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                  <p className="text-base font-bold text-gray-900 mt-1">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Delivery Address */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-[#e8ecf0] rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8"
          style={{
            boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
          }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPinIcon className="w-6 h-6 text-blue-600" />
            Delivery Address
          </h2>
          <div
            className="bg-[#e8ecf0] rounded-2xl p-5"
            style={{
              boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
            }}
          >
            <p className="font-semibold text-gray-900 text-base sm:text-lg">
              {orderData.selectedAddress.street}
            </p>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              {orderData.selectedAddress.city}, {orderData.selectedAddress.state}{" "}
              {orderData.selectedAddress.postalCode}
            </p>
            <p className="text-sm sm:text-base text-gray-600">
              {orderData.selectedAddress.country}
            </p>
            {orderData.selectedAddress.alternativePhoneNumber && (
              <p className="text-sm sm:text-base text-gray-600 mt-2">
                📞 {orderData.selectedAddress.alternativePhoneNumber}
              </p>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid sm:grid-cols-2 gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/orders")}
            className="bg-gray-900 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2"
            style={{
              boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff",
            }}
          >
            <ShoppingBagIcon className="w-5 h-5" />
            View Orders
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/")}
            className="bg-[#e8ecf0] text-gray-900 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2"
            style={{
              boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff",
            }}
          >
            <HomeIcon className="w-5 h-5" />
            Continue Shopping
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

const OrderSuccessPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-semibold">Loading...</p>
          </div>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
};

export default OrderSuccessPage;
