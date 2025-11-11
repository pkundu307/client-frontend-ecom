"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPinIcon,
  EnvelopeIcon,
  ShoppingBagIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  picture?: string;
  name: string;
  addresses: Address[];
  orders: Order[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 420, damping: 30, mass: 0.7 },
  },
};

const tap = { scale: 0.97 };

const ProfilePage = () => {
  // Mock data until connected to backend
  const [user] = useState<User>({
    id: "123",
    email: "jane.doe@example.com",
    picture: "/avatar.jpg",
    name: "Jane Doe",
    addresses: [
      {
        id: "a1",
        street: "221B Baker Street",
        city: "London",
        state: "London",
        postalCode: "NW1 6XE",
        country: "UK",
      },
      {
        id: "a2",
        street: "742 Evergreen Terrace",
        city: "Springfield",
        state: "IL",
        postalCode: "62704",
        country: "USA",
      },
    ],
    orders: [
      {
        id: "o1",
        totalAmount: 299.99,
        status: "delivered",
        paymentMethod: "Credit Card",
        createdAt: "2025-07-21",
      },
      {
        id: "o2",
        totalAmount: 149.99,
        status: "pending",
        paymentMethod: "PayPal",
        createdAt: "2025-08-01",
      },
    ],
  });

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="show"
          className="relative glass-strong rounded-2xl p-6 sm:p-8 border border-[rgba(255,255,255,0.12)] shadow-2xl overflow-hidden"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(120% 60% at 10% 0%, rgba(255,255,255,0.12), rgba(255,255,255,0.04) 40%, transparent 70%)",
            }}
          />
          <div className="relative flex flex-col sm:flex-row items-center gap-6">
            <Image
              src={user.picture || "/avatar.jpg"}
              alt={user.name}
              width={104}
              height={104}
              className="rounded-full border border-[rgba(255,255,255,0.18)] shadow-lg object-cover"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <div className="mt-1 flex items-center justify-center sm:justify-start gap-2 text-[rgba(232,238,248,0.8)]">
                <EnvelopeIcon className="w-5 h-5" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Addresses */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <MapPinIcon className="w-6 h-6 text-[var(--royal-gold)]" /> Saved Addresses
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <AnimatePresence initial={false}>
              {user.addresses.map((address) => (
                <motion.div
                  key={address.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, y: -8 }}
                  className="relative glass rounded-xl p-4 border border-[rgba(255,255,255,0.12)] shadow-lg overflow-hidden"
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-60"
                    style={{
                      background:
                        "radial-gradient(120% 70% at 0% 0%, rgba(255,255,255,0.08), rgba(255,255,255,0.03) 40%, transparent 70%)",
                    }}
                  />
                  <div className="relative">
                    <p className="font-medium">{address.street}</p>
                    <p className="text-sm text-[rgba(232,238,248,0.7)]">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-sm text-[rgba(232,238,248,0.7)]">{address.country}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Orders */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <ShoppingBagIcon className="w-6 h-6 text-[var(--royal-gold)]" /> Order History
          </h2>
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {user.orders.map((order) => (
                <motion.div
                  key={order.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, y: -8 }}
                  className="relative glass rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center border border-[rgba(255,255,255,0.12)] shadow-xl overflow-hidden"
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-60"
                    style={{
                      background:
                        "radial-gradient(140% 70% at 100% 0%, rgba(255,255,255,0.08), rgba(255,255,255,0.03) 40%, transparent 70%)",
                    }}
                  />
                  <div className="relative">
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-[rgba(232,238,248,0.75)] flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-[rgba(232,238,248,0.75)]">Payment: {order.paymentMethod}</p>
                  </div>
                  <div className="relative mt-3 sm:mt-0 text-right">
                    <p className="font-extrabold text-[var(--royal-gold)] tabular-nums">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                    <motion.span
                      whileTap={tap}
                      className={`inline-block mt-1 px-2 py-1 rounded text-sm border ${
                        order.status === "delivered"
                          ? "bg-green-500/20 text-green-200 border-green-400/30"
                          : "bg-yellow-500/20 text-yellow-200 border-yellow-400/30"
                      }`}
                    >
                      {order.status}
                    </motion.span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
