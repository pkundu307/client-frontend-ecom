"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import {
  ArrowLeftIcon,
  NoSymbolIcon,
  ClockIcon,
  CheckBadgeIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

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

const CancellationPolicyPage: React.FC = () => {
  const router = useRouter();

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
              Cancellation Policy
            </h1>
            <p className="text-sm text-gray-600">
              Guidelines for cancelling your JottoSop orders.
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
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div
              className="bg-[#e8ecf0] rounded-2xl p-4 md:col-span-2"
              style={{
                boxShadow:
                  "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckBadgeIcon className="w-5 h-5 text-emerald-600" />
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Easy Cancellations
                </p>
              </div>
              <p className="text-sm text-gray-700">
                Changed your mind? No problem. You can cancel your order easily before it enters the shipping phase. 
                Below are the details on how and when you can cancel.
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
                Processing Time
              </p>
              <p className="text-sm font-semibold text-gray-900">
                6-7 Business Days
              </p>
              <p className="text-xs text-gray-600 mt-2">
                For cancellation refunds to reflect.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left overview */}
            <div className="space-y-6 lg:col-span-1">
              <div
                className="bg-[#e8ecf0] rounded-2xl p-4"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <ClockIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Pre-Shipment</h3>
                </div>
                <p className="text-xs text-gray-700">
                  Free cancellation is only available before the order is shipped.
                </p>
              </div>

              <div
                className="bg-[#e8ecf0] rounded-2xl p-4"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <NoSymbolIcon className="w-5 h-5 text-red-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Post-Shipment</h3>
                </div>
                <p className="text-xs text-gray-700">
                  Once shipped, orders follow the Return & Refund policy.
                </p>
              </div>
            </div>

            {/* Right details */}
            <div className="space-y-6 lg:col-span-2">
              <section
                className="bg-[#e8ecf0] rounded-2xl p-5 md:p-6"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  1. How to Cancel
                </h2>
                <p className="text-sm text-gray-700 mb-3">
                  You can cancel your order through two methods:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-white/50 rounded-xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Self Service</p>
                    <p className="text-sm text-gray-800">Visit{` "My Orders"`} and click the Cancel button.</p>
                  </div>
                  <div className="p-3 bg-white/50 rounded-xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Support</p>
                    <p className="text-sm text-gray-800">Contact us via chat or email within 12 hours.</p>
                  </div>
                </div>
              </section>

              <section
                className="bg-[#e8ecf0] rounded-2xl p-5 md:p-6"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  2. Cancellation Refunds
                </h2>
                <p className="text-sm text-gray-700 mb-4">
                  If you cancel a prepaid order, the amount will be credited back to your original payment source.
                </p>
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <ClockIcon className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-900">Refund Timeframe</span>
                  </div>
                  <p className="text-sm text-emerald-800">
                    Refunds are processed and typically reflect in your account within <strong>6-7 business days</strong>.
                  </p>
                </div>
              </section>

              <section
                className="bg-[#e8ecf0] rounded-2xl p-5 md:p-6"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  3. Exceptions
                </h2>
                <p className="text-sm text-gray-700 mb-3">
                  Cancellations are not possible in the following cases:
                </p>
                <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                  <li>Orders already handed over to the courier partner (Shipped).</li>
                  <li>Personalized or custom-made items once production has started.</li>
                  <li>Bulk/Corporate orders with specific non-cancellation terms.</li>
                </ul>
              </section>

              <div className="flex justify-center pt-4">
                <button
                  onClick={() => router.push('/faq')}
                  className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  Have more questions? View FAQ
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CancellationPolicyPage;