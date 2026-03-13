"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
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

const RefundPolicyPage: React.FC = () => {
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
              Refund Policy
            </h1>
            <p className="text-sm text-gray-600">
              Your satisfaction is our priority at JottoSop.
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
          {/* Intro + last updated */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div
              className="bg-[#e8ecf0] rounded-2xl p-4 md:col-span-2"
              style={{
                boxShadow:
                  "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Fair & Transparent Returns
                </p>
              </div>
              <p className="text-sm text-gray-700">
                We want you to love what you buy. If you are not completely satisfied with your purchase, 
                our refund policy is designed to be straightforward and customer-friendly.
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
                Last updated
              </p>
              <p className="text-sm font-semibold text-gray-900">
                14 March 2026
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Standard processing: 6-7 business days.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Summary cards */}
            <div className="space-y-6 lg:col-span-1">
              <div
                className="bg-[#e8ecf0] rounded-2xl p-4"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <ArrowPathIcon className="w-5 h-5 text-green-600" />
                  <h3 className="text-sm font-semibold text-gray-900">7-Day Return</h3>
                </div>
                <p className="text-xs text-gray-700">
                  Return window for most items after delivery.
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
                  <ClockIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Processing</h3>
                </div>
                <p className="text-xs text-gray-700 font-medium">
                  6-7 Business Days
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
                  <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Condition</h3>
                </div>
                <p className="text-xs text-gray-700">
                  Unused, original tags and packaging required.
                </p>
              </div>
            </div>

            {/* Right: details */}
            <div className="space-y-6 lg:col-span-2">
              <section
                className="bg-[#e8ecf0] rounded-2xl p-5 md:p-6"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  1. Refund Eligibility
                </h2>
                <p className="text-sm text-gray-700 mb-3">
                  To be eligible for a refund, please ensure that:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>The item was purchased in the last 7 days.</li>
                  <li>The item is in its original packaging.</li>
                  <li>The item {`isn't`} used or damaged.</li>
                  <li>You have the receipt or proof of purchase.</li>
                </ul>
              </section>

              <section
                className="bg-[#e8ecf0] rounded-2xl p-5 md:p-6"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  2. The Refund Process
                </h2>
                <p className="text-sm text-gray-700 mb-3">
                  Once we receive your item, we will inspect it and notify you that we have received your returned item. 
                </p>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-3">
                  <p className="text-sm text-blue-900 font-semibold">
                    Processing Time: 6-7 Business Days
                  </p>
                  <p className="text-xs text-blue-800 mt-1">
                    If approved, your refund will be initiated to your original method of payment within 6-7 business days.
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
                  3. Non-Refundable Items
                </h2>
                <p className="text-sm text-gray-700">
                  Certain items cannot be returned for a refund, including:
                </p>
                <ul className="list-disc list-inside text-xs text-gray-600 mt-2 space-y-1">
                  <li>Perishable goods (food, flowers, or plants).</li>
                  <li>Custom products (special orders or personalized items).</li>
                  <li>Personal care goods (beauty products).</li>
                  <li>Sale items or gift cards.</li>
                </ul>
              </section>

              <section
                className="bg-[#e8ecf0] rounded-2xl p-5 md:p-6"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  4. Contact Support
                </h2>
                <p className="text-sm text-gray-700 mb-3">
                  Ready to start a return? Contact our team:
                </p>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex items-center gap-3">
                  <EnvelopeIcon className="w-5 h-5 text-gray-500" />
                  <p className="font-semibold text-gray-900">
                    support@jottosop.in
                  </p>
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;