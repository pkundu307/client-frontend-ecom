"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  TruckIcon,
  CreditCardIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

type FAQCategory = "orders" | "shipping" | "payment" | "returns" | "account" | "support" | "all";

const FAQ_DATA: FAQItem[] = [
  // Orders
  {
    id: "order-1",
    question: "How do I place an order?",
    answer: "Browse our products, add items to your cart, and proceed to checkout. You'll need to provide a delivery address and choose a payment method (COD or Online Payment). Review your order and confirm to place it.",
    category: "orders",
  },
  {
    id: "order-2",
    question: "Can I modify or cancel my order after placing it?",
    answer: "Yes, you can cancel orders that are in 'Pending' or 'Processing' status. Go to your Orders page, select the order, and click 'Cancel Order'. Once an order is shipped, it cannot be cancelled, but you can return it after delivery.",
    category: "orders",
  },
  {
    id: "order-3",
    question: "How do I track my order?",
    answer: "Go to your Profile > Orders section. Click on any order to view detailed tracking information, including current status, estimated delivery date, and delivery address.",
    category: "orders",
  },
  {
    id: "order-4",
    question: "What order statuses are there?",
    answer: "Order statuses include: Pending (payment being processed), Processing (order being prepared), Shipped (on the way), Delivered (successfully delivered), and Cancelled (order cancelled).",
    category: "orders",
  },

  // Shipping & Delivery
  {
    id: "shipping-1",
    question: "What are the delivery charges?",
    answer: "Orders above ₹500 get FREE shipping. For orders below ₹500, a flat shipping fee of ₹40 applies. This may vary based on location and product.",
    category: "shipping",
  },
  {
    id: "shipping-2",
    question: "How long does delivery take?",
    answer: "Standard delivery typically takes 3-7 business days depending on your location. You'll see an estimated delivery date when placing your order. Metro cities usually receive orders faster.",
    category: "shipping",
  },
  {
    id: "shipping-3",
    question: "Do you deliver to my area?",
    answer: "We deliver to most areas across India. Enter your pincode at checkout to check delivery availability. If we don't deliver to your area, we'll notify you before payment.",
    category: "shipping",
  },
  {
    id: "shipping-4",
    question: "Can I change my delivery address after placing an order?",
    answer: "You cannot change the delivery address after order confirmation. Please ensure your address is correct before placing an order. For urgent changes, contact our support team immediately.",
    category: "shipping",
  },

  // Payment
  {
    id: "payment-1",
    question: "What payment methods do you accept?",
    answer: "We accept Cash on Delivery (COD) and Online Payments via Cashfree (UPI, Cards, Net Banking, Wallets). COD has a ₹30 fee for orders below ₹600.",
    category: "payment",
  },
  {
    id: "payment-2",
    question: "Is online payment safe?",
    answer: "Yes! We use Cashfree payment gateway with bank-level encryption. Your card details are never stored on our servers. All transactions are 100% secure and PCI-DSS compliant.",
    category: "payment",
  },
  {
    id: "payment-3",
    question: "What is the COD fee?",
    answer: "Cash on Delivery orders below ₹600 incur a ₹30 handling fee. Orders above ₹600 have no COD fee. This helps cover the cost of cash handling and delivery.",
    category: "payment",
  },
  {
    id: "payment-4",
    question: "Can I get a refund if I cancel my order?",
    answer: "Yes, if you paid online and cancel before shipping, you'll receive a full refund within 5-7 business days. COD orders have no refund as payment is collected on delivery.",
    category: "payment",
  },
  {
    id: "payment-5",
    question: "Do you offer EMI options?",
    answer: "Currently, we don't offer direct EMI options. However, you can use your credit card's EMI facility if your bank provides it. Check with your bank for card-based EMI.",
    category: "payment",
  },

  // Returns & Refunds
  {
    id: "return-1",
    question: "What is your return policy?",
    answer: "We accept returns within 7 days of delivery for defective or incorrect items. Products must be unused, in original packaging with tags intact. Custom/personalized items cannot be returned.",
    category: "returns",
  },
  {
    id: "return-2",
    question: "How do I return a product?",
    answer: "Go to your Orders, select the order, and raise a complaint ticket. Our team will review and provide return instructions. Once approved, you can ship the item back or schedule a pickup.",
    category: "returns",
  },
  {
    id: "return-3",
    question: "When will I get my refund?",
    answer: "Refunds are processed within 5-7 business days after we receive and inspect the returned item. The amount will be credited to your original payment method.",
    category: "returns",
  },
  {
    id: "return-4",
    question: "Can I exchange a product?",
    answer: "Direct exchanges are not available. Please return the item for a refund and place a new order for the desired product. This ensures faster processing.",
    category: "returns",
  },

  // Account
  {
    id: "account-1",
    question: "How do I create an account?",
    answer: "Click 'Sign Up' on the homepage. Provide your name, email, phone number, and create a password. You'll receive a verification email/SMS to activate your account.",
    category: "account",
  },
  {
    id: "account-2",
    question: "I forgot my password. How do I reset it?",
    answer: "Click 'Forgot Password' on the login page. Enter your registered email, and we'll send you a password reset link. Follow the link to create a new password.",
    category: "account",
  },
  {
    id: "account-3",
    question: "How do I update my profile information?",
    answer: "Go to Profile > Edit Profile. You can update your name, email, phone number, and profile picture. Save changes to update your information.",
    category: "account",
  },
  {
    id: "account-4",
    question: "Can I have multiple delivery addresses?",
    answer: "Yes! Go to Profile > Addresses to add multiple delivery addresses. You can set one as default and choose different addresses during checkout.",
    category: "account",
  },
  {
    id: "account-5",
    question: "How do I delete my account?",
    answer: "Currently, account deletion must be requested through our support team. Contact us via the support tickets section, and we'll process your request within 48 hours.",
    category: "account",
  },

  // Support
  {
    id: "support-1",
    question: "How do I contact customer support?",
    answer: "Go to Profile > Support Tickets to raise a complaint or query. You can also email us directly. Our team responds within 24 hours on business days.",
    category: "support",
  },
  {
    id: "support-2",
    question: "Can I raise a complaint about my order?",
    answer: "Yes! Go to your Orders, select the order, and click 'Raise Complaint'. Provide details about the issue, and our support team will assist you. You can track the ticket status in the Support Tickets section.",
    category: "support",
  },
  {
    id: "support-3",
    question: "What is the support response time?",
    answer: "We aim to respond to all queries within 24 hours on business days (Monday-Saturday). High-priority issues are addressed faster. You'll receive updates via email and in-app notifications.",
    category: "support",
  },
  {
    id: "support-4",
    question: "Can I chat with support in real-time?",
    answer: "Support tickets allow back-and-forth messaging with our team. While not live chat, we respond quickly during business hours. For urgent issues, mark your ticket as 'High Priority'.",
    category: "support",
  },

  // Product & Reviews
  {
    id: "product-1",
    question: "How do I write a review?",
    answer: "After receiving your order, go to Orders > Select Order > Click 'Write Review'. Rate the product (1-5 stars), add a title and comment, and optionally upload a photo. Reviews help other customers!",
    category: "orders",
  },
  {
    id: "product-2",
    question: "Can I edit or delete my review?",
    answer: "Currently, reviews cannot be edited or deleted once submitted. Please ensure your review is accurate before submitting. Contact support if you need to remove a review.",
    category: "orders",
  },

  // Discounts & Coupons
  {
    id: "discount-1",
    question: "How do I use a coupon code?",
    answer: "At checkout, you'll see a 'Coupon Code' field. Enter your code (e.g., JOTTO50) and click 'Apply'. The discount will be reflected in your order total. Coupons have minimum order requirements and expiry dates.",
    category: "payment",
  },
  {
    id: "discount-2",
    question: "Why isn't my coupon code working?",
    answer: "Check if: 1) The coupon is still valid, 2) Your order meets the minimum amount, 3) The code is spelled correctly, 4) The coupon applies to items in your cart. Some products may be excluded from promotions.",
    category: "payment",
  },
];

const CATEGORIES = [
  { id: "all", name: "All Questions", icon: QuestionMarkCircleIcon },
  { id: "orders", name: "Orders", icon: ShoppingBagIcon },
  { id: "shipping", name: "Shipping & Delivery", icon: TruckIcon },
  { id: "payment", name: "Payment", icon: CreditCardIcon },
  { id: "returns", name: "Returns & Refunds", icon: ArrowPathIcon },
  { id: "account", name: "Account", icon: ShieldCheckIcon },
  { id: "support", name: "Support", icon: ChatBubbleLeftRightIcon },
];

export default function FAQPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFAQs = FAQ_DATA.filter((faq) => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#e8ecf0] px-4 py-6 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h1>
            <p className="text-sm text-gray-600">
              Find answers to common questions
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#e8ecf0] rounded-2xl p-4 mb-6"
          style={{
            boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
          }}
        >
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#e8ecf0]"
            style={{
              boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
            }}
          >
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-sm"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as FAQCategory)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all flex-shrink-0 ${
                    selectedCategory === category.id
                      ? "bg-red-600 text-white"
                      : "bg-[#e8ecf0] text-gray-700 hover:text-red-600"
                  }`}
                  style={{
                    boxShadow:
                      selectedCategory === category.id
                        ? "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff"
                        : "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold text-sm">{category.name}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ List */}
        {filteredFAQs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#e8ecf0] rounded-3xl p-12 text-center"
            style={{
              boxShadow: "inset 8px 8px 16px #c5cdd5, inset -8px -8px 16px #ffffff",
            }}
          >
            <QuestionMarkCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-semibold text-lg mb-2">
              No results found
            </p>
            <p className="text-gray-500 text-sm">
              Try different keywords or browse categories above
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-[#e8ecf0] rounded-2xl overflow-hidden"
                style={{
                  boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff",
                }}
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full px-6 py-4 flex items-start justify-between gap-4 text-left hover:bg-gray-100/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                      {faq.question}
                    </h3>
                    <p className="text-xs text-gray-500 capitalize">
                      {faq.category.replace("-", " ")}
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedId === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDownIcon className="w-6 h-6 text-gray-600" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-6 pb-4 text-sm text-gray-700 leading-relaxed"
                        style={{
                          borderTop: "1px solid #c5cdd5",
                          paddingTop: "1rem",
                          marginTop: "0.5rem",
                        }}
                      >
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        {/* Still Need Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-[#e8ecf0] rounded-3xl p-8 text-center"
          style={{
            boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
          }}
        >
          <ChatBubbleLeftRightIcon className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Still need help?
          </h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push("/profile/tickets")}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
              style={{
                boxShadow: "8px 8px 16px #c5cdd5",
              }}
            >
              Contact Support
            </button>
            <button
              onClick={() => router.push("/")}
              className="bg-[#e8ecf0] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:text-red-600 transition-colors"
              style={{
                boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
              }}
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
