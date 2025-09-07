"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
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
    <div className="min-h-screen bg-gradient-to-br from-[#1a3b3a] via-[#0f2b2a] to-[#0a1f1e] text-[var(--royal-gold)] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center gap-6 bg-white/5 rounded-2xl p-6 shadow-lg border border-[var(--royal-gold)]/20"
        >
          <Image
            src={user.picture || "/avatar.jpg"}
            alt={user.name}
            width={100}
            height={100}
            className="rounded-full border-2 border-[var(--royal-gold)] object-cover"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-[var(--royal-gold)]/80">
              <EnvelopeIcon className="w-5 h-5" />
              <span>{user.email}</span>
            </div>
          </div>
        </motion.div>

        {/* Addresses */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <MapPinIcon className="w-6 h-6" /> Saved Addresses
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {user.addresses.map((address) => (
              <div
                key={address.id}
                className="bg-white/5 rounded-xl p-4 border border-[var(--royal-gold)]/20 shadow-md"
              >
                <p className="font-medium">{address.street}</p>
                <p className="text-sm text-[var(--royal-gold)]/70">
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p className="text-sm text-[var(--royal-gold)]/70">
                  {address.country}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Orders */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <ShoppingBagIcon className="w-6 h-6" /> Order History
          </h2>
          <div className="space-y-4">
            {user.orders.map((order) => (
              <div
                key={order.id}
                className="bg-white/5 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border border-[var(--royal-gold)]/20 shadow-md"
              >
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-[var(--royal-gold)]/70 flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-[var(--royal-gold)]/70">
                    Payment: {order.paymentMethod}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 text-right">
                  <p className="font-bold">${order.totalAmount.toFixed(2)}</p>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      order.status === "delivered"
                        ? "bg-green-600/30 text-green-300"
                        : "bg-yellow-600/30 text-yellow-300"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
