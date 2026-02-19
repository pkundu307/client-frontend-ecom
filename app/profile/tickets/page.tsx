"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { baseUrl } from "@/app/utilities/baseUrl";

type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
type TicketPriority = "LOW" | "MEDIUM" | "HIGH";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  lastMessageAt: string;
  business: {
    name: string;
    logoUrl?: string;
  };
  order?: {
    orderNumber: string;
  };
  _count: {
    messages: number;
  };
}

const STATUS_FILTERS: { value: TicketStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

const PRIORITY_COLORS = {
  LOW: "bg-green-100 text-green-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-red-100 text-red-700",
};

const STATUS_COLORS = {
  OPEN: "bg-yellow-100 text-yellow-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  RESOLVED: "bg-green-100 text-green-700",
  CLOSED: "bg-gray-100 text-gray-700",
};

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // ✅ Fixed: Wrap filterTickets with useCallback to fix the dependency warning
  const filterTickets = useCallback(() => {
    let filtered = [...tickets];

    // Status filter
    if (selectedStatus !== "ALL") {
      filtered = filtered.filter((ticket) => ticket.status === selectedStatus);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(query) ||
          ticket.description.toLowerCase().includes(query) ||
          ticket.business.name.toLowerCase().includes(query) ||
          ticket.order?.orderNumber.toLowerCase().includes(query)
      );
    }

    setFilteredTickets(filtered);
  }, [tickets, selectedStatus, searchQuery]);

  useEffect(() => {
    fetchTickets();
  }, []);

  // ✅ Fixed: Now filterTickets is in the dependency array
  useEffect(() => {
    filterTickets();
  }, [filterTickets]);

  // ✅ Fixed line 97: Remove any type
  const fetchTickets = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to view your tickets.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get<Ticket[]>(
        `${baseUrl}/customer/tickets`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTickets(response.data);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Failed to load tickets.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center px-4">
        <div
          className="bg-[#e8ecf0] rounded-3xl px-8 py-6 text-center max-w-md w-full"
          style={{
            boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
          }}
        >
          <ExclamationTriangleIcon className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 font-semibold mb-4 text-lg">{error}</p>
          <button
            onClick={() => router.push("/profile")}
            className="bg-red-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-700 transition-colors"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e8ecf0] px-4 py-6 pb-20">
      <div className="max-w-4xl mx-auto">
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
              Support Tickets
            </h1>
            <p className="text-sm text-gray-600">
              {filteredTickets.length} ticket{filteredTickets.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#e8ecf0] rounded-2xl p-4 mb-6"
          style={{
            boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
          }}
        >
          {/* Search Input */}
          <div className="flex gap-2 mb-4">
            <div
              className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#e8ecf0]"
              style={{
                boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
              }}
            >
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-xl transition-colors ${
                showFilters ? "bg-red-600 text-white" : "bg-[#e8ecf0] text-gray-700"
              }`}
              style={{
                boxShadow: showFilters
                  ? "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff"
                  : "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
              }}
            >
              <FunnelIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Status Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-2 flex-wrap"
            >
              {STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedStatus(filter.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedStatus === filter.value
                      ? "bg-red-600 text-white"
                      : "bg-[#e8ecf0] text-gray-700 hover:text-red-600"
                  }`}
                  style={{
                    boxShadow:
                      selectedStatus === filter.value
                        ? "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff"
                        : "4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff",
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#e8ecf0] rounded-3xl p-12 text-center"
            style={{
              boxShadow: "inset 8px 8px 16px #c5cdd5, inset -8px -8px 16px #ffffff",
            }}
          >
            <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-semibold text-lg mb-2">
              No tickets found
            </p>
            <p className="text-gray-500 text-sm">
              {searchQuery || selectedStatus !== "ALL"
                ? "Try adjusting your filters"
                : "You haven't created any support tickets yet"}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => router.push(`/profile/tickets/${ticket.id}`)}
                className="bg-[#e8ecf0] rounded-2xl p-4 sm:p-6 cursor-pointer hover:shadow-2xl transition-all"
                style={{
                  boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff",
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                      {ticket.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {ticket.description}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-end flex-shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        STATUS_COLORS[ticket.status]
                      }`}
                    >
                      {ticket.status.replace("_", " ")}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        PRIORITY_COLORS[ticket.priority]
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-xs font-semibold text-red-700">
                      {ticket.business.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{ticket.business.name}</span>
                  </div>
                  {ticket.order && (
                    <span className="font-medium">
                      Order #{ticket.order.orderNumber}
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    <span>{ticket._count.messages} messages</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    <span>{getRelativeTime(ticket.lastMessageAt)}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-gray-300 text-xs text-gray-500">
                  Created {new Date(ticket.createdAt).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Back to Profile Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => router.push("/profile")}
          className="w-full mt-8 bg-[#e8ecf0] text-gray-900 py-4 rounded-2xl font-semibold hover:text-red-600 transition-colors"
          style={{
            boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff",
          }}
        >
          Back to Profile
        </motion.button>
      </div>
    </div>
  );
}
