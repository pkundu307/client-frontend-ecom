"use client";

import React from "react";
// import { useNavigate } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import {
  ArrowLeftIcon,
  ShieldCheckIcon,
  CakeIcon,
  LockClosedIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  Cog6ToothIcon,
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

const CookiePolicyPage: React.FC = () => {
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
              Cookie Policy
            </h1>
            <p className="text-sm text-gray-600">
              How JottoSop uses cookies and similar technologies.
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
                  Your control, our transparency
                </p>
              </div>
              <p className="text-sm text-gray-700">
                JottoSop uses cookies and similar technologies to make your
                shopping experience fast, secure, and personalized. This Cookie
                Policy explains what cookies we use, why we use them, and how
                you can manage your preferences.
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
                Cookies help us remember you and improve your experience.
              </p>
            </div>
          </div>

          {/* Main content split columns */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Cookie overview cards */}
            <div className="space-y-6 lg:col-span-1">
              {/* Essential cookies */}
              <div
                className="bg-[#e8ecf0] rounded-2xl p-4"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CakeIcon className="w-5 h-5 text-green-600" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Essential
                  </h3>
                  <span className="ml-auto px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                    Always Active
                  </span>
                </div>
                <p className="text-xs text-gray-700">
                  Shopping cart, login, security
                </p>
              </div>

              {/* Performance cookies */}
              <div
                className="bg-[#e8ecf0] rounded-2xl p-4"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <DevicePhoneMobileIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Performance
                  </h3>
                  <span className="ml-auto px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                    Optional
                  </span>
                </div>
                <p className="text-xs text-gray-700">
                  Analytics & site performance
                </p>
              </div>

              {/* Preference cookies */}
              <div
                className="bg-[#e8ecf0] rounded-2xl p-4"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Cog6ToothIcon className="w-5 h-5 text-purple-600" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Preferences
                  </h3>
                  <span className="ml-auto px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                    Optional
                  </span>
                </div>
                <p className="text-xs text-gray-700">
                  Language, currency, addresses
                </p>
              </div>

              {/* Targeting cookies */}
              <div
                className="bg-[#e8ecf0] rounded-2xl p-4"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <LockClosedIcon className="w-5 h-5 text-orange-600" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Advertising
                  </h3>
                  <span className="ml-auto px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                    Optional
                  </span>
                </div>
                <p className="text-xs text-gray-700">
                  Personalized recommendations
                </p>
              </div>
            </div>

            {/* Right: detailed sections */}
            <div className="space-y-6 lg:col-span-2">
              {/* 1. What are cookies? */}
              <section
                className="bg-[#e8ecf0] rounded-2xl p-5 md:p-6"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  1. What Are Cookies?
                </h2>
                <p className="text-sm text-gray-700 mb-3">
                  Cookies are small text files stored on your device (computer,
                  phone, or tablet) when you visit JottoSop. They help us:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-2">
                  <li>Remember your shopping cart and login status.</li>
                  <li>Save your preferences like language or currency.</li>
                  <li>Understand how you use our site to make it better.</li>
                  <li>Show relevant product recommendations.</li>
                </ul>
                <p className="text-sm text-gray-700">
                  We also use similar technologies like local storage and
                  session storage for the same purposes.
                </p>
              </section>

              {/* 2. Types of cookies we use */}
              <section
                className="bg-[#e8ecf0] rounded-2xl p-5 md:p-6"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  2. Types of Cookies We Use
                </h2>
                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-sm text-gray-900">
                      <CakeIcon className="w-5 h-5 text-green-600" />
                      <span>Essential Cookies</span>
                    </div>
                    <p className="text-xs text-gray-700 pl-7">
                      Required for basic site functionality. Without these,
                     {` you can't add items to cart or check out.`}
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1 pl-7">
                      <li>Cart contents</li>
                      <li>Authentication</li>
                      <li>Security</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-sm text-gray-900">
                      <ComputerDesktopIcon className="w-5 h-5 text-blue-600" />
                      <span>Performance Cookies</span>
                    </div>
                    <p className="text-xs text-gray-700 pl-7">
                      Help us understand how visitors use the site.
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1 pl-7">
                      <li>Page views</li>
                      <li>Session duration</li>
                      <li>Popular products</li>
                    </ul>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-sm text-gray-900">
                      <Cog6ToothIcon className="w-5 h-5 text-purple-600" />
                      <span>Preference Cookies</span>
                    </div>
                    <p className="text-xs text-gray-700 pl-7">
                      Remember your choices across visits.
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1 pl-7">
                      <li>Saved addresses</li>
                      <li>Language preference</li>
                      <li>Currency selection</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-sm text-gray-900">
                      <LockClosedIcon className="w-5 h-5 text-orange-600" />
                      <span>Targeting Cookies</span>
                    </div>
                    <p className="text-xs text-gray-700 pl-7">
                      Personalize your shopping experience.
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1 pl-7">
                      <li>Product recommendations</li>
                      <li>Recent searches</li>
                      <li>Marketing preferences</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 3. Third-party cookies */}
              <section
                className="bg-[#e8ecf0] rounded-2xl p-5 md:p-6"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  3. Third-Party Cookies & Services
                </h2>
                <p className="text-sm text-gray-700 mb-3">
                  Some cookies come from trusted partners who help us serve you
                  better:
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
                      <span className="font-semibold">Payment Gateways</span>
                    </div>
                    <p className="text-xs text-gray-700 ml-7">
                      Secure checkout (Razorpay, Stripe, PayPal)
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1 flex-shrink-0" />
                      <span className="font-semibold">Shipping Partners</span>
                    </div>
                    <p className="text-xs text-gray-700 ml-7">
                      Delivery tracking (Delhivery, BlueDart)
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-1 flex-shrink-0" />
                      <span className="font-semibold">Analytics</span>
                    </div>
                    <p className="text-xs text-gray-700 ml-7">
                      Google Analytics, Hotjar (aggregated data)
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-1 flex-shrink-0" />
                      <span className="font-semibold">Marketing</span>
                    </div>
                    <p className="text-xs text-gray-700 ml-7">
                      Facebook Pixel, Google Ads (opt-in only)
                    </p>
                  </div>
                </div>
              </section>

              {/* 4. Cookie management */}
              <section
                className="bg-[#e8ecf0] rounded-2xl p-5 md:p-6"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  4. Managing Your Cookie Preferences
                </h2>
                <p className="text-sm text-gray-700 mb-3">
                  You have full control over your cookies:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-4">
                  <li>
                    <strong>Cookie Banner:</strong> Accept or customize when you
                    first visit JottoSop.
                  </li>
                  <li>
                    <strong>Browser Settings:</strong> Block or delete cookies
                    through your browser (Chrome, Safari, Firefox, etc.).
                  </li>
                  <li>
                    <strong>Account Settings:</strong> Manage marketing
                    preferences in your profile.
                  </li>
                  <li>
                    <strong>Do Not Track:</strong> We respect browser DNT
                    signals where available.
                  </li>
                </ul>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                  <p className="text-sm text-blue-900 mb-1">
                    <strong>Note:</strong> Disabling essential cookies may
                    prevent cart, checkout, or login from working properly.
                  </p>
                </div>
              </section>

              {/* 5. Contact & updates */}
              <section
                className="bg-[#e8ecf0] rounded-2xl p-5 md:p-6"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  5. Contact Us & Updates
                </h2>
                <p className="text-sm text-gray-700 mb-3">
                  Questions about cookies? We’re here to help:
                </p>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl mb-3">
                  <p className="font-semibold text-gray-900 mb-1">
                    Email: support@jottosop.in
                  </p>
                  <p className="text-sm text-gray-700">
                    {`We'll respond within 48 hours.`}
                  </p>
                </div>
                <p className="text-sm text-gray-700">
                  This Cookie Policy was last updated on 25 December 2025. We
                  may update it periodically to reflect new features or legal
                  requirements. Significant changes will be notified via the
                  website or email.
                </p>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
