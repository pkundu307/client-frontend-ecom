"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import {
  ArrowLeftIcon,
  CalendarIcon,
//   CreditCardIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { useOrdersData } from "./hooks/useOrdersData";

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

const OrdersPage: React.FC = () => {
  const router = useRouter();
  const { orders, loading, error } = useOrdersData();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center">
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (error || orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center">
        <div
          className="bg-[#e8ecf0] rounded-3xl px-8 py-6 text-center"
          style={{
            boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
          }}
        >
          <p className="text-gray-700 font-semibold mb-3">
            {error || "No orders found."}
          </p>
          <button
            onClick={() => router.push("/")}
            className="text-blue-700 font-semibold hover:underline"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e8ecf0] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push("/profile")}
            className="rounded-full p-2 bg-[#e8ecf0] text-gray-700"
            style={{
              boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
            }}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              My Orders
            </h1>
            <p className="text-sm text-gray-600">
              You have {orders.length} order{orders.length > 1 ? "s" : ""}.
            </p>
          </div>
        </div>

        {/* Orders list */}
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              variants={cardVariants}
              initial="hidden"
              animate="show"
              className="bg-[#e8ecf0] rounded-3xl p-4 md:p-6 cursor-pointer"
              style={{
                boxShadow: "16px 16px 32px #c5cdd5, -16px -16px 32px #ffffff",
              }}
              onClick={() => router.push(`/order/${order.id}`)}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left: main info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <ShoppingBagIcon className="w-5 h-5 text-blue-600" />
                    <p className="text-sm font-semibold text-gray-900">
                      Order #{order.orderNumber || order.id}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4 text-blue-600" />
                      <span>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="h-1 w-1 rounded-full bg-gray-400" />
                    <span>Items: {order.itemCount}</span>
                    <span className="h-1 w-1 rounded-full bg-gray-400" />
                    <span>
                      Payment:{" "}
                      {order.paymentMethod === "cash_on_delivery"
                        ? "Cash on Delivery"
                        : order.paymentMethod}
                    </span>
                  </div>

                  {order.estimatedDeliveryDate && (
                    <p className="text-xs text-gray-600">
                      Est. delivery:{" "}
                      {new Date(
                        order.estimatedDeliveryDate
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Right: price + statuses */}
                <div className="flex flex-col items-start md:items-end gap-1">
                  <p className="text-xl font-bold text-gray-900 tabular-nums">
                    ₹{Number(order.totalAmount).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600">
                    Payment:{" "}
                    <span className="font-semibold capitalize">
                      {order.paymentStatus}
                    </span>
                  </p>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold capitalize ${
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

              {/* Small preview of first item */}
              {order.items[0] && (
                <div className="mt-4 flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-12 h-12 rounded-xl bg-gray-200 overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={order.items[0].productImage || "/placeholder.png"}
                      alt={order.items[0].productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 line-clamp-1">
                      {order.items[0].productName}
                    </p>
                    {order.itemCount > 1 && (
                      <p className="text-xs text-gray-600">
                        + {order.itemCount - 1} more item
                        {order.itemCount - 1 > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
