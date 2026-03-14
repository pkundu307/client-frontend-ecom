// src/app/security/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  EyeSlashIcon,
  CreditCardIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  ChevronDownIcon,
  KeyIcon,
  ServerStackIcon,
  BellAlertIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { ShieldCheckIcon as ShieldSolid } from "@heroicons/react/24/solid";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

const neuShadow  = "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff";
const neuInset   = "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff";
const tap        = { scale: 0.97 };

// ── FAQ accordion item ─────────────────────────────────────
const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="bg-[#e8ecf0] rounded-2xl overflow-hidden"
      style={{ boxShadow: open ? neuInset : neuShadow }}
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-semibold text-gray-900 text-sm sm:text-base pr-4">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <p className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Security feature card ──────────────────────────────────
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: string;
  badgeColor?: string;
}
const FeatureCard: React.FC<FeatureCardProps> = ({
  icon, title, desc, badge, badgeColor = "bg-green-100 text-green-700",
}) => (
  <motion.div
    variants={cardVariants}
    className="bg-[#e8ecf0] rounded-2xl p-5"
    style={{ boxShadow: neuShadow }}
  >
    <div className="flex items-start gap-4">
      <div
        className="p-3 bg-[#e8ecf0] rounded-xl flex-shrink-0"
        style={{ boxShadow: neuInset }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <p className="font-bold text-gray-900 text-sm sm:text-base">{title}</p>
          {badge && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
const SecurityPage: React.FC = () => {
  const router = useRouter();

  const customerFeatures: FeatureCardProps[] = [
    {
      icon: <CreditCardIcon className="w-5 h-5 text-blue-600" />,
      title: "Secure Payments via Razorpay",
      desc: "All payments are processed by Razorpay — a PCI DSS Level 1 certified gateway. We never store your card details on our servers.",
      badge: "PCI DSS",
      badgeColor: "bg-blue-100 text-blue-700",
    },
    {
      icon: <LockClosedIcon className="w-5 h-5 text-emerald-600" />,
      title: "End-to-End HTTPS Encryption",
      desc: "Every request between your browser and our servers is encrypted using TLS 1.2+. Your personal and payment data is always in transit securely.",
      badge: "TLS 1.2+",
      badgeColor: "bg-emerald-100 text-emerald-700",
    },
    {
      icon: <EyeSlashIcon className="w-5 h-5 text-purple-600" />,
      title: "We Never Sell Your Data",
      desc: "Your name, address, phone number, and order history are used solely to process your orders. We do not sell or share your data with third-party advertisers.",
    },
    {
      icon: <KeyIcon className="w-5 h-5 text-amber-600" />,
      title: "Password Protection",
      desc: "Passwords are hashed using bcrypt with salt rounds before storage. Even our team cannot see your password in plain text.",
      badge: "bcrypt",
      badgeColor: "bg-amber-100 text-amber-700",
    },
    {
      icon: <BellAlertIcon className="w-5 h-5 text-red-500" />,
      title: "Order & Account Alerts",
      desc: "You receive real-time notifications for every order placed, shipped, or cancelled. If you notice unexpected activity, contact us immediately.",
    },
    {
      icon: <DocumentCheckIcon className="w-5 h-5 text-teal-600" />,
      title: "COD & Refund Protection",
      desc: "Cash-on-Delivery orders are protected with order verification. Refund requests are reviewed within 48 hours and processed within 5–7 business days.",
    },
  ];

  const sellerFeatures: FeatureCardProps[] = [
    {
      icon: <DocumentCheckIcon className="w-5 h-5 text-blue-600" />,
      title: "KYC Verification",
      desc: "Every seller undergoes a mandatory KYC process before listing products. We verify PAN, GST, and business address to ensure platform authenticity.",
      badge: "Mandatory",
      badgeColor: "bg-blue-100 text-blue-700",
    },
    {
      icon: <BuildingStorefrontIcon className="w-5 h-5 text-emerald-600" />,
      title: "GST-Compliant Invoicing",
      desc: "All transactions generate GST-compliant invoices automatically. Sellers' financial data is isolated per business account and never shared across sellers.",
    },
    {
      icon: <ServerStackIcon className="w-5 h-5 text-purple-600" />,
      title: "Role-Based Access Control",
      desc: "Seller dashboards support staff accounts with granular permissions. You control who on your team can view orders, manage inventory, or access financials.",
      badge: "RBAC",
      badgeColor: "bg-purple-100 text-purple-700",
    },
    {
      icon: <LockClosedIcon className="w-5 h-5 text-amber-600" />,
      title: "Secure Payouts",
      desc: "Seller settlements are processed only to verified bank accounts linked during KYC. Payout requests require authentication before processing.",
    },
    {
      icon: <ShieldCheckIcon className="w-5 h-5 text-red-500" />,
      title: "Fraud Detection",
      desc: "Suspicious order patterns, unusually high COD rates, and fake review activity are flagged automatically and reviewed by our trust & safety team.",
    },
    {
      icon: <KeyIcon className="w-5 h-5 text-teal-600" />,
      title: "API Key Isolation",
      desc: "Each seller's data is scoped strictly to their business ID. Cross-seller data access is blocked at the API level — not just the UI level.",
      badge: "API-level",
      badgeColor: "bg-teal-100 text-teal-700",
    },
  ];

  const faqs = [
    {
      q: "Is my card information stored on JottoSop?",
      a: "No. We never store card numbers, CVVs, or banking credentials. All payment data is handled directly by Razorpay, which is PCI DSS Level 1 certified — the highest level of payment security certification.",
    },
    {
      q: "What happens if my account is compromised?",
      a: "Contact us immediately at support@jottosop.in or call +91 79802 14799. We will temporarily lock your account, review recent activity, and help you regain access safely.",
    },
    {
      q: "How does JottoSop protect my delivery address?",
      a: "Your address is stored encrypted and is only shared with the verified seller fulfilling your order — never with third parties. Sellers only see the minimum required details to dispatch.",
    },
    {
      q: "Can a seller see my payment details?",
      a: "No. Sellers only see the order details (items, quantity, delivery address). Payment information is visible only to JottoSop's payment processor (Razorpay) and is never exposed to sellers.",
    },
    {
      q: "How are seller payouts secured?",
      a: "Payouts are processed only to the bank account verified during KYC. Any change to banking details triggers a re-verification process and is subject to a 72-hour hold as a fraud prevention measure.",
    },
    {
      q: "Does JottoSop support two-factor authentication?",
      a: "OTP-based authentication is available during login and for sensitive actions such as address changes and payout requests. We are actively working on full 2FA support.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#e8ecf0] px-4 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Back + Header */}
        <div className="flex items-center gap-3 mb-6">
          <motion.button
            whileTap={tap}
            onClick={() => router.back()}
            className="rounded-full p-2 bg-[#e8ecf0] text-gray-700"
            style={{ boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff" }}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Security
            </h1>
            <p className="text-sm text-gray-600">
              How JottoSop protects your data and transactions.
            </p>
          </div>
        </div>

        {/* Trust banner */}
        <motion.div
          variants={cardVariants} initial="hidden" animate="show"
          className="bg-blue-600 rounded-3xl p-6 mb-8 flex items-center gap-5"
          style={{ boxShadow: "12px 12px 28px #b5bdc5, -4px -4px 12px #ffffff" }}
        >
          <ShieldSolid className="w-12 h-12 text-white opacity-90 flex-shrink-0" />
          <div className="text-white">
            <p className="text-lg sm:text-xl font-bold leading-tight">
              Your trust is our foundation.
            </p>
            <p className="text-sm opacity-85 mt-1 leading-relaxed">
              JottoSop is built with security-first architecture. Every layer —
              from login to payout — is designed to protect both customers and sellers.
            </p>
          </div>
        </motion.div>

        {/* Customer Security */}
        <motion.section
          variants={cardVariants} initial="hidden" animate="show"
          className="bg-[#e8ecf0] rounded-3xl p-6 md:p-8 mb-8"
          style={{ boxShadow: neuShadow }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-[#e8ecf0] rounded-xl" style={{ boxShadow: neuInset }}>
              <UserGroupIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Customer Security</h2>
              <p className="text-xs text-gray-500">How we protect every shopper on JottoSop</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {customerFeatures.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </motion.section>

        {/* Seller Security */}
        <motion.section
          variants={cardVariants} initial="hidden" animate="show"
          className="bg-[#e8ecf0] rounded-3xl p-6 md:p-8 mb-8"
          style={{ boxShadow: neuShadow }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-[#e8ecf0] rounded-xl" style={{ boxShadow: neuInset }}>
              <BuildingStorefrontIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Seller Security</h2>
              <p className="text-xs text-gray-500">How we keep your business and earnings safe</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {sellerFeatures.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </motion.section>

        {/* Infrastructure note */}
        <motion.section
          variants={cardVariants} initial="hidden" animate="show"
          className="bg-[#e8ecf0] rounded-3xl p-6 md:p-8 mb-8"
          style={{ boxShadow: neuShadow }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 bg-[#e8ecf0] rounded-xl" style={{ boxShadow: neuInset }}>
              <ServerStackIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Platform Infrastructure</h2>
              <p className="text-xs text-gray-500">What runs under the hood</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Hosting",     value: "Cloud-hosted with 99.9% uptime SLA",      color: "text-blue-600" },
              { label: "Database",    value: "Encrypted PostgreSQL with daily backups",  color: "text-emerald-600" },
              { label: "File Storage","value": "S3-compatible object storage with signed URLs", color: "text-amber-600" },
              { label: "API Security","value": "JWT auth + rate limiting on all endpoints", color: "text-purple-600" },
              { label: "Images",      value: "User uploads scanned before storage",      color: "text-red-500" },
              { label: "Monitoring",  value: "24/7 error tracking and alerting",         color: "text-teal-600" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#e8ecf0] rounded-2xl p-4"
                style={{ boxShadow: neuInset }}
              >
                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${item.color}`}>
                  {item.label}
                </p>
                <p className="text-sm text-gray-700 font-medium leading-snug">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* FAQ */}
        <motion.section
          variants={cardVariants} initial="hidden" animate="show"
          className="bg-[#e8ecf0] rounded-3xl p-6 md:p-8 mb-8"
          style={{ boxShadow: neuShadow }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-[#e8ecf0] rounded-xl" style={{ boxShadow: neuInset }}>
              <ShieldCheckIcon className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Security FAQs</h2>
              <p className="text-xs text-gray-500">Common questions about your safety</p>
            </div>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </motion.section>

        {/* Report concern CTA */}
        <motion.div
          variants={cardVariants} initial="hidden" animate="show"
          className="bg-[#e8ecf0] rounded-3xl p-6 md:p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-5"
          style={{ boxShadow: neuShadow }}
        >
          <div className="p-3 bg-[#e8ecf0] rounded-2xl flex-shrink-0" style={{ boxShadow: neuInset }}>
            <BellAlertIcon className="w-7 h-7 text-red-500" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-base sm:text-lg">
              Found a security issue?
            </p>
            <p className="text-sm text-gray-600 mt-1">
              We take vulnerability reports seriously. If you discover a security
              concern, please report it directly to{" "}
              <a
                href="mailto:prasanna@jottosop.in"
                className="text-blue-600 font-semibold underline"
              >
                prasanna@jottosop.in
              </a>{" "}
              and we will investigate within 24 hours.
            </p>
          </div>
          <motion.a
            whileTap={tap}
            href="mailto:prasanna@jottosop.in"
            className="flex-shrink-0 bg-gray-900 text-white px-5 py-3 rounded-xl font-semibold text-sm whitespace-nowrap"
            style={{ boxShadow: "6px 6px 12px #c5cdd5, -4px -4px 8px #ffffff" }}
          >
            Report Issue
          </motion.a>
        </motion.div>

        {/* Footer note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
            JottoSop — Digitalizing Small Businesses with ❤️ in Bengal
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Last updated: March 2026 · For privacy concerns see our{" "}
            <a href="/privacy" className="underline hover:text-gray-600">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
