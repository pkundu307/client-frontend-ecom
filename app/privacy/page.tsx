"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
//   ArrowLeftIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  UserIcon,
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

const PrivacyPolicyPage: React.FC = () => {

  return (
    <div className="min-h-screen bg-[#e8ecf0] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Back + header */}
        <div className="flex items-center gap-3 mb-6">
          {/* <button
            onClick={() => navigate(-1)}
            className="rounded-full p-2 bg-[#e8ecf0] text-gray-700"
            style={{
              boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
            }}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button> */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-600">
              How JottoSop collects, uses, and protects your information.
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
                  Our commitment
                </p>
              </div>
              <p className="text-sm text-gray-700">
                At <span className="font-semibold">JottoSop</span>, your trust
                matters. This Privacy Policy explains, in clear language, how
                we handle your personal data when you browse, create an
                account, customize products, or place an order on our store.
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
                By using JottoSop, you agree to the practices described in this
                Privacy Policy.
              </p>
            </div>
          </div>

          {/* Main content split columns */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: overview cards */}
            <div className="space-y-6 lg:col-span-1">
              {/* What we collect */}
              <div
                className="bg-[#e8ecf0] rounded-2xl p-4"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <UserIcon className="w-5 h-5 text-blue-600" />
                  <h2 className="text-sm font-semibold text-gray-900">
                    What we collect
                  </h2>
                </div>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Contact details (name, email, phone).</li>
                  <li>• Delivery address and order details.</li>
                  <li>• Login, device and usage information.</li>
                  <li>• Payment-related information via secure gateways.</li>
                </ul>
              </div>

              {/* How we use it */}
              <div
                className="bg-[#e8ecf0] rounded-2xl p-4"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <GlobeAltIcon className="w-5 h-5 text-blue-600" />
                  <h2 className="text-sm font-semibold text-gray-900">
                    How we use it
                  </h2>
                </div>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• To process and deliver your orders.</li>
                  <li>• To support customization and special requests.</li>
                  <li>• To improve our site, UX and product offering.</li>
                  <li>• To send essential updates and service messages.</li>
                </ul>
              </div>

              {/* Contact & rights */}
              <div
                className="bg-[#e8ecf0] rounded-2xl p-4"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                  <h2 className="text-sm font-semibold text-gray-900">
                    Your privacy rights
                  </h2>
                </div>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Access, update, or delete your account data.</li>
                  <li>• Request a copy of your personal information.</li>
                  <li>• Opt out of non-essential marketing emails.</li>
                  <li>• Ask questions at: privacy@jottosop.com</li>
                </ul>
              </div>
            </div>

            {/* Right: detailed sections */}
            <div className="space-y-6 lg:col-span-2">
              {/* 1. Information we collect */}
              <section
                className="bg-[#e8ecf0] rounded-2xl p-5 md:p-6"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  1. Information We Collect
                </h2>
                <p className="text-sm text-gray-700 mb-2">
                  When you use JottoSop, we collect information needed to
                  provide a smooth, secure and personalized shopping
                  experience.
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>
                    <span className="font-semibold">Account & contact data</span>{" "}
                    – such as your name, email address, phone number, and
                    password when you register or check out as a customer.
                  </li>
                  <li>
                    <span className="font-semibold">Order & delivery data</span>{" "}
                    – including shipping address, billing address, order
                    history, customization notes, and uploaded design files.
                  </li>
                  <li>
                    <span className="font-semibold">Payment data</span> – payment
                    card and transaction details are processed via trusted
                    payment partners; JottoSop does not store your full card
                    number.
                  </li>
                  <li>
                    <span className="font-semibold">Usage & device data</span> –
                    IP address, browser type, device information, and
                    interaction data (for example, pages viewed or items added to
                    cart) collected via cookies and analytics tools.
                  </li>
                </ul>
              </section>

              {/* 2. How we use your information */}
              <section
                className="bg-[#e8ecf0] rounded-2xl p-5 md:p-6"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  2. How We Use Your Information
                </h2>
                <p className="text-sm text-gray-700 mb-2">
                  JottoSop uses your information only for clear, legitimate
                  purposes connected to your shopping experience.
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>
                    To create and manage your account, and keep your profile and
                    preferences up to date.
                  </li>
                  <li>
                    To process orders, manage payments, handle shipping,
                    customization, and customer support.
                  </li>
                  <li>
                    To personalize recommendations, recently viewed items, and
                    curated collections relevant to your interests.
                  </li>
                  <li>
                    To send transactional messages such as order confirmations,
                    shipping updates, and important changes to our services or
                    policies.
                  </li>
                  <li>
                    To maintain security, prevent fraud, and ensure our
                    platform remains safe for the entire JottoSop community.
                  </li>
                </ul>
              </section>

              {/* 3. Cookies & tracking */}
              <section
                className="bg-[#e8ecf0] rounded-2xl p-5 md:p-6"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  3. Cookies, Analytics & Similar Technologies
                </h2>
                <p className="text-sm text-gray-700 mb-2">
                  JottoSop uses cookies and similar technologies to keep your
                  session secure, remember your preferences, and understand how
                  our store is being used.
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>
                    <span className="font-semibold">Essential cookies</span>{" "}
                    keep features like the shopping cart, checkout, and login
                    working reliably.
                  </li>
                  <li>
                    <span className="font-semibold">Performance and analytics</span>{" "}
                    cookies help us understand which pages are popular so we can
                    improve navigation and content.
                  </li>
                  <li>
                    <span className="font-semibold">Preference cookies</span>{" "}
                    remember things like language, currency, or saved addresses
                    to make future visits faster.
                  </li>
                </ul>
                <p className="text-xs text-gray-600 mt-2">
                  You can control cookies through your browser settings. Some
                  features may not function properly if you disable certain
                  cookies.
                </p>
              </section>

              {/* 4. Sharing & security */}
              <section
                className="bg-[#e8ecf0] rounded-2xl p-5 md:p-6"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  4. How We Share & Protect Your Data
                </h2>
                <p className="text-sm text-gray-700 mb-2">
                  JottoSop does not sell your personal data. Information is
                  shared only with trusted service providers, and only when
                  necessary to run our ecommerce services.
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>
                    We may share limited data with payment processors, shipping
                    partners, analytics tools, and communication providers – all
                    under strict confidentiality obligations.
                  </li>
                  <li>
                    We apply reasonable technical and organizational measures
                    (such as encryption, access controls, and monitoring) to
                    protect your information from unauthorized access, loss, or
                    misuse.
                  </li>
                  <li>
                    Where required by law, we may disclose information to
                    regulators or authorities, but only to the extent strictly
                    necessary.
                  </li>
                </ul>
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-600">
                  <LockClosedIcon className="w-4 h-4 text-blue-600" />
                  <span>
                    Even with strong safeguards, no online service can guarantee
                    absolute security, but JottoSop continuously works to reduce
                    risk.
                  </span>
                </div>
              </section>

              {/* 5. Your choices & contact */}
              <section
                className="bg-[#e8ecf0] rounded-2xl p-5 md:p-6"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  5. Your Choices & How to Contact Us
                </h2>
                <p className="text-sm text-gray-700 mb-2">
                  You remain in control of your personal data and how it is used
                  on JottoSop.
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-2">
                  <li>
                    Update your profile, addresses, and saved details directly
                    in your account settings.
                  </li>
                  <li>
                    Unsubscribe from marketing emails using the link included in
                    those messages.
                  </li>
                  <li>
                    Request access, correction, or deletion of your data by
                    contacting our support team.
                  </li>
                </ul>
                <p className="text-sm text-gray-700 mb-1">
                  For any privacy question or request, you can email:
                </p>
                <p className="text-sm font-semibold text-blue-700">
                  privacy@jottosop.com
                </p>
                <p className="text-xs text-gray-500 mt-3">
                  We may update this Privacy Policy from time to time. When we
                  make changes, we will adjust the “Last updated” date at the
                  top of this page and, where appropriate, notify you via the
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

export default PrivacyPolicyPage;
