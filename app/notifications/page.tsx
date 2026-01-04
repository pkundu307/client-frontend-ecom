"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  BellIcon,
//   CheckIcon,
//   TrashIcon,
} from "@heroicons/react/24/outline";
import {
  PackageIcon,
  CogIcon,
  TagIcon,
  AlertTriangleIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import axios, { AxiosError } from "axios";

// Animation variants
const cardVariants: Variants = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
    },
  },
};

// Types
type NotificationType = "ORDER" | "SYSTEM" | "PROMOTION" | "ALERT";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: NotificationType;
  metadata: Record<string, unknown> | null;
  customerUserId: string;
  createdAt: string;
  updatedAt: string;
}

interface NotificationResponse {
  notifications: Notification[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Icon mapping
const iconMap: Record<NotificationType, { icon: React.ReactNode; bgColor: string; textColor: string }> = {
  ORDER: {
    icon: <PackageIcon className="w-5 h-5" />,
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
  },
  SYSTEM: {
    icon: <CogIcon className="w-5 h-5" />,
    bgColor: "bg-gray-100",
    textColor: "text-gray-600",
  },
  PROMOTION: {
    icon: <TagIcon className="w-5 h-5" />,
    bgColor: "bg-green-100",
    textColor: "text-green-600",
  },
  ALERT: {
    icon: <AlertTriangleIcon className="w-5 h-5" />,
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-600",
  },
};

const NotificationsPage = () => {
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
//   const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
//   const [markingReadIds, setMarkingReadIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "unread">("all");

  // Memoize filtered notifications
  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications;
  }, [notifications, filter]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to view notifications");
        router.push("/");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get<NotificationResponse>(`${API_URL}/notifications/customer`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);

        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            toast.error("Session expired. Please login again");
            localStorage.removeItem("token");
            router.push("/");
          } else {
            toast.error("Failed to load notifications");
          }
        } else {
          toast.error("Failed to load notifications");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [router]);

  // Mark as read
//   const handleMarkAsRead = async (notificationId: string) => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Please login");
//       return;
//     }

//     setMarkingReadIds((prev) => new Set(prev).add(notificationId));

//     try {
//       await axios.patch(
//         `${API_URL}/notifications/${notificationId}/read`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setNotifications((prev) =>
//         prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
//       );
//       toast.success("Marked as read");
//     } catch (error) {
//       console.error("Failed to mark as read:", error);
//       toast.error("Failed to mark as read");
//     } finally {
//       setMarkingReadIds((prev) => {
//         const newSet = new Set(prev);
//         newSet.delete(notificationId);
//         return newSet;
//       });
//     }
//   };

//   // Mark all as read
//   const handleMarkAllAsRead = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Please login");
//       return;
//     }

//     const unreadNotifications = notifications.filter((n) => !n.isRead);
//     if (unreadNotifications.length === 0) {
//       toast.error("No unread notifications");
//       return;
//     }

//     try {
//       await Promise.all(
//         unreadNotifications.map((n) =>
//           axios.patch(
//             `${API_URL}/notifications/${n.id}/read`,
//             {},
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           )
//         )
//       );

//       setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
//       toast.success("All notifications marked as read");
//     } catch (error) {
//       console.error("Failed to mark all as read:", error);
//       toast.error("Failed to mark all as read");
//     }
//   };

//   // Delete notification
//   const handleDelete = async (notificationId: string) => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Please login");
//       return;
//     }

//     setDeletingIds((prev) => new Set(prev).add(notificationId));

//     try {
//       await axios.delete(`${API_URL}/notifications/${notificationId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
//       toast.success("Notification deleted");
//     } catch (error) {
//       console.error("Failed to delete notification:", error);
//       toast.error("Failed to delete notification");
//     } finally {
//       setDeletingIds((prev) => {
//         const newSet = new Set(prev);
//         newSet.delete(notificationId);
//         return newSet;
//       });
//     }
//   };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e8ecf0] py-8 px-4">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <BellIcon className="w-10 h-10 text-blue-600" />
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600 mt-1">{unreadCount} unread</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Filter and Actions */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#e8ecf0] rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4"
          style={{
            boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff",
          }}
        >
          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                filter === "all"
                  ? "bg-gray-900 text-white shadow-[6px_6px_12px_#c5cdd5,-6px_-6px_12px_#ffffff]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                filter === "unread"
                  ? "bg-gray-900 text-white shadow-[6px_6px_12px_#c5cdd5,-6px_-6px_12px_#ffffff]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Mark All as Read Button */}
          {unreadCount > 0 && (
            // <motion.button
            //   whileTap={{ scale: 0.95 }}
            //   onClick={handleMarkAllAsRead}
            //   className="px-4 py-2 rounded-xl bg-[#e8ecf0] text-gray-900 font-semibold flex items-center gap-2 shadow-[6px_6px_12px_#c5cdd5,-6px_-6px_12px_#ffffff] hover:shadow-[inset_4px_4px_8px_#c5cdd5,inset_-4px_-4px_8px_#ffffff] transition-all"
            // >
            //   <CheckIcon className="w-5 h-5" />
            //   Mark all as read
            // </motion.button>
            <></>
          )}
        </motion.div>

        {/* Notifications List */}
        <AnimatePresence initial={false} mode="popLayout">
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#e8ecf0] rounded-3xl p-16 text-center shadow-[12px_12px_24px_#c5cdd5,-12px_-12px_24px_#ffffff]"
            >
              <BellIcon className="w-24 h-24 text-gray-400 mx-auto mb-6" />
              <p className="text-2xl text-gray-900 font-semibold mb-2">
                {filter === "unread" ? "No unread notifications" : "No notifications yet"}
              </p>
              <p className="text-gray-600">
                {filter === "unread"
                  ? "You're all caught up!"
                  : "We'll notify you when something new arrives"}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => {
                const iconConfig = iconMap[notification.type] || iconMap.SYSTEM;
                // const isDeleting = deletingIds.has(notification.id);
                // const isMarkingRead = markingReadIds.has(notification.id);

                return (
                  <motion.div
                    key={notification.id}
                    layout
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={`bg-[#e8ecf0] relative rounded-2xl p-5 shadow-[12px_12px_24px_#c5cdd5,-12px_-12px_24px_#ffffff] ${
                      !notification.isRead ? "ring-2 ring-blue-200" : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${iconConfig.bgColor} ${iconConfig.textColor}`}
                      >
                        {iconConfig.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 text-lg">
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="px-2 py-1 rounded-md bg-white/40 font-medium">
                            {notification.type}
                          </span>
                          <span>•</span>
                          <span>{formatDate(notification.createdAt)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      {/* <div className="flex gap-2">
                        {!notification.isRead && (
                          <motion.button
                            whileTap={{ scale: 0.92 }}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleMarkAsRead(notification.id)}
                            disabled={isMarkingRead}
                            className="p-2 rounded-xl bg-white shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                            title="Mark as read"
                          >
                            {isMarkingRead ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                            ) : (
                              <CheckIcon className="w-5 h-5 text-green-600" />
                            )}
                          </motion.button>
                        )}

                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => handleDelete(notification.id)}
                          disabled={isDeleting}
                          className="p-2 rounded-xl bg-white shadow-sm hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Delete notification"
                        >
                          {isDeleting ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                          ) : (
                            <TrashIcon className="w-5 h-5 text-red-500" />
                          )}
                        </motion.button>
                      </div> */}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationsPage;
