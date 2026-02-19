"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ArrowLeftIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  XMarkIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { baseUrl } from "@/app/utilities/baseUrl";

type MessageSender = "CUSTOMER" | "SELLER" | "Jottosop";

type TicketMessage = {
  id: string;
  message: string;
  senderType: MessageSender;
  createdAt: string;
  attachmentUrls?: string[];
  user?: {
    name: string;
    role: string;
  };
  customerUser?: {
    name: string;
  };
};

type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

type TicketDetail = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: string;
  createdAt: string;
  lastMessageAt: string;
  business: {
    name: string;
    logoUrl?: string;
  };
  order?: {
    orderNumber: string;
    totalAmount: string;
    status: string;
  };
  messages: TicketMessage[];
};

export default function TicketDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const ticketId = params.id;

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reply state
  const [replyMessage, setReplyMessage] = useState("");
  const [replyImage, setReplyImage] = useState<File | null>(null);
  const [replyImagePreview, setReplyImagePreview] = useState<string | null>(null);
  const [sendingReply, setSendingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  // Resolve/Close state
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch ticket details
  useEffect(() => {
    const fetchTicket = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view this ticket.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<TicketDetail>(
          `${baseUrl}/customer/tickets/${ticketId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTicket(response.data);
      } catch (err) {
        console.error("Failed to fetch ticket:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : (err as { response?: { data?: { message?: string } } })?.response?.data
                ?.message || "Failed to load ticket.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) fetchTicket();
  }, [ticketId]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setReplyError("Image size must be less than 5MB");
        return;
      }
      setReplyImage(file);
      setReplyImagePreview(URL.createObjectURL(file));
      setReplyError(null);
    }
  };

  // Send reply
  const handleSendReply = async () => {
    if (!replyMessage.trim() && !replyImage) {
      setReplyError("Please enter a message or attach an image");
      return;
    }

    if (!ticket) return;

    setSendingReply(true);
    setReplyError(null);

    try {
      const token = localStorage.getItem("token");

      // For now, send without image upload (you can add image upload to S3 here)
      const payload = {
        message: replyMessage.trim(),
        attachmentUrls: [], // Add S3 URLs here after upload
      };

      await axios.post(
        `${baseUrl}/customer/tickets/${ticketId}/reply`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh ticket to get new message
      const response = await axios.get<TicketDetail>(
        `${baseUrl}/customer/tickets/${ticketId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTicket(response.data);

      // Clear form
      setReplyMessage("");
      setReplyImage(null);
      setReplyImagePreview(null);
    } catch (err) {
      console.error("Failed to send reply:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response?.data
              ?.message || "Failed to send message. Please try again.";
      setReplyError(errorMessage);
    } finally {
      setSendingReply(false);
    }
  };

  // Update ticket status
  const handleUpdateStatus = async (newStatus: TicketStatus) => {
    if (!ticket) return;

    setUpdatingStatus(true);

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${baseUrl}/customer/tickets/${ticketId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTicket({ ...ticket, status: newStatus });
      setShowStatusModal(false);

      alert(`Ticket marked as ${newStatus.toLowerCase()}`);
    } catch (err) {
      console.error("Failed to update status:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response?.data
              ?.message || "Failed to update status";
      alert(errorMessage);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center px-4">
        <div
          className="bg-[#e8ecf0] rounded-3xl px-8 py-6 text-center max-w-md w-full"
          style={{
            boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff",
          }}
        >
          <p className="text-red-600 font-semibold mb-4 text-lg">
            {error || "Ticket not found"}
          </p>
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

  // ✅ No chat allowed if ticket is RESOLVED or CLOSED
  const canReply = ticket.status !== "CLOSED" && ticket.status !== "RESOLVED";

  return (
    <div className="min-h-screen bg-[#e8ecf0] flex flex-col">
      {/* Header */}
      <div
        className="bg-[#e8ecf0] border-b border-gray-300 px-4 py-4 sticky top-0 z-10"
        style={{
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => router.back()}
              className="rounded-full p-2 bg-[#e8ecf0] text-gray-700 hover:text-gray-900 transition-colors flex-shrink-0"
              style={{
                boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
              }}
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                {ticket.title}
              </h1>
              <p className="text-xs text-gray-600 truncate">
                {ticket.business.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                ticket.status === "OPEN"
                  ? "bg-yellow-100 text-yellow-700"
                  : ticket.status === "IN_PROGRESS"
                  ? "bg-blue-100 text-blue-700"
                  : ticket.status === "RESOLVED"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {ticket.status}
            </span>
            {ticket.status !== "CLOSED" && ticket.status !== "RESOLVED" && (
              <button
                onClick={() => setShowStatusModal(true)}
                className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-semibold hover:bg-green-700 transition-colors"
              >
                Resolve
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-32">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Order Info Card */}
          {ticket.order && (
            <div
              className="bg-[#e8ecf0] rounded-2xl p-4 mb-6"
              style={{
                boxShadow:
                  "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
              }}
            >
              <p className="text-xs text-gray-600 mb-1">Related Order</p>
              <p className="font-semibold text-gray-900">
                #{ticket.order.orderNumber}
              </p>
              <p className="text-sm text-gray-600">
                ₹{Number(ticket.order.totalAmount).toFixed(2)} •{" "}
                {ticket.order.status}
              </p>
            </div>
          )}

          {/* Messages */}
          {ticket.messages.map((msg, index) => {
            const isCustomer = msg.senderType === "CUSTOMER";
            const senderName = isCustomer
              ? msg.customerUser?.name || "You"
              : msg.user?.name || ticket.business.name;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[70%] ${
                    isCustomer ? "order-2" : "order-1"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {!isCustomer && (
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-xs font-semibold text-red-700">
                        {senderName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <p className="text-xs text-gray-600 font-medium">
                      {senderName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      isCustomer
                        ? "bg-red-600 text-white"
                        : "bg-[#e8ecf0] text-gray-900"
                    }`}
                    style={{
                      boxShadow: isCustomer
                        ? "6px 6px 12px #c5cdd5"
                        : "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                    }}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {msg.message}
                    </p>
                    {msg.attachmentUrls && msg.attachmentUrls.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {msg.attachmentUrls.map((url, i) => (
                          <Image
                            key={i}
                            src={url}
                            alt="Attachment"
                            width={400}
                            height={300}
                            className="rounded-lg max-w-full h-auto"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Reply Input (Fixed at bottom) */}
      {canReply && (
        <div
          className="fixed bottom-0 left-0 right-0 bg-[#e8ecf0] border-t border-gray-300 px-4 py-4"
          style={{
            boxShadow: "0 -4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <div className="max-w-4xl mx-auto">
            {replyImagePreview && (
              <div className="mb-3 relative inline-block">
                <Image
                  src={replyImagePreview}
                  alt="Preview"
                  width={80}
                  height={80}
                  className="object-cover rounded-lg"
                />
                <button
                  onClick={() => {
                    setReplyImage(null);
                    setReplyImagePreview(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            )}

            {replyError && (
              <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-600">{replyError}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={sendingReply}
                className="p-3 bg-[#e8ecf0] rounded-xl text-gray-700 hover:text-red-600 transition-colors disabled:opacity-50"
                style={{
                  boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
                }}
              >
                <PhotoIcon className="w-6 h-6" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <input
                type="text"
                placeholder="Type your message..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendReply();
                  }
                }}
                disabled={sendingReply}
                className="flex-1 px-4 py-3 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50"
                style={{
                  boxShadow:
                    "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              />
              <button
                onClick={handleSendReply}
                disabled={sendingReply || (!replyMessage.trim() && !replyImage)}
                className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  boxShadow: "6px 6px 12px #c5cdd5",
                }}
              >
                {sendingReply ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <PaperAirplaneIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Show message when ticket is resolved or closed */}
      {!canReply && (
        <div
          className="fixed bottom-0 left-0 right-0 bg-gray-100 px-4 py-4 text-center"
          style={{
            boxShadow: "0 -4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <p className="text-sm text-gray-600 font-medium">
            {ticket.status === "RESOLVED"
              ? "This ticket has been marked as resolved. No further replies allowed."
              : "This ticket is closed. No further replies allowed."}
          </p>
        </div>
      )}

      {/* Status Update Modal */}
      <AnimatePresence>
        {showStatusModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50 p-4"
            onClick={() => !updatingStatus && setShowStatusModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#e8ecf0] rounded-3xl p-6 w-full max-w-sm"
              style={{
                boxShadow: "20px 20px 40px #c5cdd5, -20px -20px 40px #ffffff",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 rounded-full p-3">
                  <CheckCircleIcon className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Mark as Resolved?
                  </h3>
                  <p className="text-sm text-gray-600">Close this ticket</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-6">
                Are you sure this issue has been resolved? You can still view the
                conversation history but won&apos;t be able to send more messages.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  disabled={updatingStatus}
                  className="flex-1 bg-[#e8ecf0] text-gray-900 py-3 rounded-xl font-semibold hover:text-red-600 transition-colors"
                  style={{
                    boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateStatus("RESOLVED")}
                  disabled={updatingStatus}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {updatingStatus ? "Updating..." : "Mark Resolved"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
