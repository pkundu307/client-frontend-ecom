"use client";

import React from "react";
// import { useNavigate } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import {
  ArrowLeftIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  TruckIcon,
  CreditCardIcon,
//   ScaleIcon,
//   ClockIcon,
  ChatBubbleLeftIcon,
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

const TermsOfServicePage: React.FC = () => {
//   const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#e8ecf0] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Back + header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            // onClick={() => navigate(-1)}
            className="rounded-full p-2 bg-[#e8ecf0] text-gray-700"
            style={{
              boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
            }}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Terms of Service
            </h1>
            <p className="text-sm text-gray-600">
              The agreement between you and JottoSop for shopping and services.
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
                  Fair terms for great shopping
                </p>
              </div>
              <p className="text-sm text-gray-700">
                Welcome to <span className="font-semibold">JottoSop</span>. These
                Terms of Service outline the rules for using our website,
                placing orders, customizing products, and receiving deliveries.
                By using JottoSop, you agree to these terms.
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
                25 December 2025
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Effective immediately for new orders.
              </p>
            </div>
          </div>

          {/* Main content split columns */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Service overview cards */}
            <div className="space-y-6 lg:col-span-1">
              {/* Shopping & Orders */}
              <div
                className="bg-[#e8ecf0] rounded-2xl p-4"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBagIcon className="w-5 h-5 text-green-600" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Shopping & Orders
                  </h3>
                </div>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Browse and order online</li>
                  <li>• Customize products</li>
                  <li>• Track deliveries</li>
                </ul>
              </div>

              {/* Shipping & Delivery */}
              <div
                className="bg-[#e8ecf0] rounded-2xl p-4"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <TruckIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Shipping & Delivery
                  </h3>
                </div>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Standard delivery times</li>
                  <li>• Address accuracy required</li>
                  <li>• Unsuccessful delivery policy</li>
                </ul>
              </div>

              {/* Payments & Returns */}
              <div
                className="bg-[#e8ecf0] rounded-2xl p-4"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CreditCardIcon className="w-5 h-5 text-purple-600" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Payments & Returns
                  </h3>
                </div>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Secure payment gateways</li>
                  <li>• Return window & process</li>
                  <li>• Refund timelines</li>
                </ul>
              </div>

              {/* Support */}
              <div
                className="bg-[#e8ecf0] rounded-2xl p-4"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <ChatBubbleLeftIcon className="w-5 h-5 text-orange-600" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Support
                  </h3>
                </div>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Email & chat support</li>
                  <li>• Response times</li>
                  <li>• Dispute resolution</li>
                </ul>
              </div>
            </div>

            {/* Right: detailed sections */}
            <div className="space-y-6 lg:col-span-2">
              {/* 1. Using JottoSop */}
              <section
                className="bg-[#e8ecf0] rounded-2xl p-5 md:p-6"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  1. Using JottoSop Services
                </h2>
                <p className="text-sm text-gray-700 mb-3">
                  You may browse JottoSop, create an account, customize
                  products, place orders, and track deliveries. By using our
                  services, you agree to:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-3">
                  <li>Provide accurate information during registration and checkout.</li>
                  <li>Keep your account credentials secure and notify us of unauthorized use.</li>
                  <li>Comply with applicable laws when using our site and services.</li>
                </ul>
                <p className="text-sm text-gray-700">
                  You must be 18+ or have parental consent to use JottoSop.
                </p>
              </section>

              {/* 2. Orders & Products */}
              <section
                className="bg-[#e8ecf0] rounded-2xl p-5 md:p-6"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  2. Orders, Products & Customization
                </h2>
                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">
                      Product Availability
                    </h4>
                    <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                      <li>Products shown are subject to availability.</li>
                      <li>Customizations are final once production begins.</li>
                      <li>Images are for reference; slight variations possible.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">
                      Order Process
                    </h4>
                    <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                      <li>Order confirmation sent via email/SMS.</li>
                      <li>Production time varies by customization complexity.</li>
                      <li>Track status in your account dashboard.</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                  <p className="text-xs text-yellow-900">
                    <strong>Note:</strong> Custom orders cannot be cancelled or
                    modified once production starts. Please review carefully.
                  </p>
                </div>
              </section>

              {/* 3. Shipping & Delivery */}
              <section
                className="bg-[#e8ecf0] rounded-2xl p-5 md:p-6"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  3. Shipping, Delivery & Risk
                </h2>
                <p className="text-sm text-gray-700 mb-3">
                  Delivery times are estimates based on production and transit.
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-3">
                  <li>Risk transfers to you upon delivery to your address.</li>
                  <li>You must provide accurate, accessible delivery details.</li>
                  <li>Unsuccessful deliveries may incur additional charges.</li>
                  <li>We are not liable for delays due to courier issues.</li>
                </ul>
                <p className="text-sm text-gray-700">
                  Track your order status and delivery attempts in your account.
                </p>
              </section>

              {/* 4. Payments & Pricing */}
              <section
                className="bg-[#e8ecf0] rounded-2xl p-5 md:p-6"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  4. Payments, Pricing & Taxes
                </h2>
                <p className="text-sm text-gray-700 mb-3">
                  All prices include applicable taxes unless stated otherwise.
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-3">
                  <li>Prices may change without notice (current price applies at checkout).</li>
                  <li>Payment processed via secure third-party gateways.</li>
                  <li>You are responsible for all charges incurred.</li>
                  <li>Currency displayed matches your selected region.</li>
                </ul>
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-sm">
                  <div className="flex items-start gap-2 mb-1">
                    <CreditCardIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="font-semibold text-green-900">Secure Payments</span>
                  </div>
                  <p className="text-xs text-green-900">
                    We use PCI-compliant gateways. JottoSop does not store full
                    card details.
                  </p>
                </div>
              </section>

              {/* 5. Returns & Refunds */}
              <section
                className="bg-[#e8ecf0] rounded-2xl p-5 md:p-6"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  5. Returns, Refunds & Warranties
                </h2>
                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">
                      Custom Orders
                    </h4>
                    <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                      <li>No returns on personalized products</li>
                      <li>Quality issues: contact within 48 hours</li>
                      <li>Replacements subject to inspection</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">
                      Refunds
                    </h4>
                    <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                      <li>Processed to original payment method</li>
                      <li>7-14 business days depending on gateway</li>
                      <li>Original shipping fees non-refundable</li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  Full policy available at <span className="text-blue-600 underline">Returns Portal</span>.
                </p>
              </section>

              {/* 6. Support & Disputes */}
              <section
                className="bg-[#e8ecf0] rounded-2xl p-5 md:p-6"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  6. Customer Support & Dispute Resolution
                </h2>
                <p className="text-sm text-gray-700 mb-3">
                  We’re committed to resolving issues quickly and fairly:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-3">
                  <li>Email support: conact@jottosop.com (24-hour response)</li>
                  <li>Live chat: Available 10AM-7PM IST</li>
                  <li>Order issues must be reported within 7 days of delivery</li>
                </ul>
                <p className="text-sm text-gray-700 mb-2">
                  For unresolved disputes, we encourage mediation before legal action.
                </p>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    Governing Law: Indian law applies. Courts in [City] have jurisdiction.
                  </p>
                </div>
              </section>

              {/* 7. Changes & Termination */}
              <section
                className="bg-[#e8ecf0] rounded-2xl p-5 md:p-6"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  7. Changes to Terms & Account Termination
                </h2>
                <p className="text-sm text-gray-700 mb-3">
                  We may update these Terms periodically. Significant changes will be notified.
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-3">
                  <li>You may close your account anytime through settings.</li>
                  <li>We reserve the right to suspend accounts for policy violations.</li>
                  <li>Terms effective immediately upon posting on jottoSop.in</li>
                </ul>
                <p className="text-xs text-gray-600">
                  Questions? Contact <span className="font-semibold text-blue-700">conact@jottosop.com</span>
                </p>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
