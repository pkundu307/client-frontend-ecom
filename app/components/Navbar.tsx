"use client";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useState, useEffect, useRef } from "react";
import { Search, ShoppingCart, User, Loader2, X, Bell } from "lucide-react";
import { baseUrl } from "../utilities/baseUrl";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setUser, logoutUser } from "../store/userSlice";
import Link from "next/link";
import toast from "react-hot-toast";
import { selectUniqueItemCount } from "../store/cartSlice";
import { usePathname, useRouter } from "next/navigation";
import MegaMenu from "./Categories";
import { AppDispatch } from "../store/store";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import axios, { AxiosError } from "axios";

// --- Toast Styles ---
const neuToast = {
  success: {
    style: {
      background: "#e8ecf0",
      color: "#1f2937",
      border: "none",
      boxShadow: "8px 8px 16px #a8d5b5, -8px -8px 16px #ffffff",
      borderRadius: "16px",
      fontWeight: "600",
    },
    iconTheme: { primary: "#10b981", secondary: "#e8ecf0" },
  },
  error: {
    style: {
      background: "#e8ecf0",
      color: "#ef4444",
      border: "none",
      boxShadow: "8px 8px 16px #f5c0c0, -8px -8px 16px #ffffff",
      borderRadius: "16px",
      fontWeight: "600",
    },
    iconTheme: { primary: "#ef4444", secondary: "#e8ecf0" },
  },
  loading: {
    style: {
      background: "#e8ecf0",
      color: "#1f2937",
      border: "none",
      boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff",
      borderRadius: "16px",
      fontWeight: "600",
    },
  },
};

// --- Search Interfaces ---
interface ProductSearchResult {
  id: string;
  title: string;
  slug: string;
  images: string[];
  category: { name: string };
  variants: { id: string; price: string; images: string[] }[];
}
interface DisplayResult {
  id: string;
  slug: string;
  text: string;
  subtext?: string;
  image?: string;
}

// --- Notification Interface ---
interface Notification {
  id: string;
  isRead: boolean;
}
interface NotificationResponse {
  notifications: Notification[];
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Navbar() {
  const cartCount = useSelector(selectUniqueItemCount);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSearchTerm, setMobileSearchTerm] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [lastScrollY2, setLastScrollY2] = useState(0);

  // --- Notification Count State ---
  const [notificationCount, setNotificationCount] = useState<number>(0);

  // --- Live Search State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DisplayResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 300);

  // --- Google Button Width Ref ---
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const [googleBtnWidth, setGoogleBtnWidth] = useState(360);

  useEffect(() => {
    if (isModalOpen && googleBtnRef.current) {
      setGoogleBtnWidth(googleBtnRef.current.offsetWidth);
    }
  }, [isModalOpen]);

  // --- Scroll: scrolling up detection ---
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrollingUp(currentScrollY < lastScrollY2);
      setLastScrollY2(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY2]);

  // --- Responsive ---
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 1024);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // --- Mobile search bar hide on scroll down ---
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) setShowSearchBar(false);
      else setShowSearchBar(true);
      setLastScrollY(window.scrollY);
    };
    if (isMobile) window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, lastScrollY]);

  // --- Fetch Notification Count ---
  useEffect(() => {
    const fetchNotificationCount = async (): Promise<void> => {
      const token = localStorage.getItem("token");
      if (!token) { setNotificationCount(0); return; }
      try {
        const response = await axios.get<NotificationResponse>(
          `${process.env.NEXT_PUBLIC_API_URL || baseUrl}/notifications/customer`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const unreadCount = response.data.notifications.filter((n) => !n.isRead).length;
        setNotificationCount(unreadCount);
      } catch (error) {
        if (error instanceof AxiosError) console.error("Failed to fetch notification count:", error.message);
        else console.error("Failed to fetch notification count:", error);
        setNotificationCount(0);
      }
    };

    fetchNotificationCount();
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, [user.name]);

  // --- Restore user from localStorage ---
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      dispatch(setUser(storedUser));
    }
  }, [dispatch]);

  // --- Google Login ---
  const handleGoogleLoginSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse?.credential) {
      toast.error("No credentials received from Google", {
        duration: 3000,
        position: "top-right",
        ...neuToast.error,
      });
      return;
    }

    const loadingToast = toast.loading("Signing in with Google...", {
      position: "top-right",
      ...neuToast.loading,
    });

    try {
      const response = await fetch(`${baseUrl}/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ googleToken: credentialResponse.credential }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Google login failed");

      toast.success(`🎉 Welcome, ${data.user.name}!`, {
        id: loadingToast,
        duration: 4000,
        position: "top-right",
        ...neuToast.success,
      });

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify({ name: data.user.name, role: data.user.role }));
      dispatch(setUser({ name: data.user.name, role: data.user.role }));
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Google login failed. Please try again.", {
        id: loadingToast,
        duration: 4000,
        position: "top-right",
        ...neuToast.error,
      });
    }
  };

  // --- Logout ---
  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setProfileDropdownOpen(false);
    setNotificationCount(0);
    toast.success("👋 You have been logged out. See you soon!", {
      duration: 3000,
      position: "top-right",
      ...neuToast.success,
    });
    window.location.href = "/";
  };

  // --- Live Search ---
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    (async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || baseUrl}/products/search?query=${encodeURIComponent(debouncedQuery)}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Search failed");
        const data: ProductSearchResult[] = await response.json();
        setSearchResults(
          data.map((product) => ({
            id: product.id,
            slug: product.slug,
            text: product.title,
            subtext: `in ${product.category.name}`,
            image: product.images[0] || product.variants[0]?.images[0],
          }))
        );
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    })();
  }, [debouncedQuery]);

  const tapBounce = { scale: 0.96 };
  const dropdownVariants: Variants = {
    hidden: { opacity: 0, y: -6, scale: 0.98 },
    show: {
      opacity: 1, y: 0, scale: 1,
      transition: { type: "spring", stiffness: 420, damping: 32, mass: 0.7 },
    },
    exit: { opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.18 } },
  };

  return (
    <>
      <GoogleOAuthProvider clientId="939883123761-up76q4mal36sd3quh558ssccr1cqc035.apps.googleusercontent.com">
        <nav
          className="py-3 px-6 z-23 sticky top-0 bg-[#e8ecf0]"
          style={{ boxShadow: "0 4px 12px rgba(197, 205, 213, 0.5), 0 -2px 8px rgba(255, 255, 255, 0.8)" }}
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">

            {/* LOGO — increased size */}
            <Link href="/" className="flex items-center gap-3">
              <div
                className="rounded-2xl p-1.5"
                style={{ boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff" }}
              >
                <Image
                  src="/logo.png"
                  alt="Jottosop Logo"
                  width={120}
                  height={48}
                  className="rounded-xl object-contain"
                  priority
                />
              </div>
            </Link>

            {/* SEARCH FIELD */}
            {!isMobile && (
              <div className="flex-1 mx-6 relative">
                <div className="relative w-full max-w-xl">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 120)}
                    placeholder="Search for products, brands..."
                    className={`w-full pl-6 pr-14 py-3 rounded-2xl bg-[#e8ecf0] transition-all duration-300 focus:outline-none text-gray-900 font-medium ${
                      isScrollingUp ? "placeholder-yellow-600" : "placeholder-gray-500"
                    }`}
                    style={{ boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff" }}
                  />
                  {!searchLoading && searchQuery && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-900 rounded-full bg-[#e8ecf0]"
                    >
                      <X size={18} />
                    </motion.button>
                  )}
                  {searchLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400" size={18} />
                  )}
                  <AnimatePresence>
                    {searchFocused && searchQuery.length > 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute left-0 right-0 mt-2 bg-[#e8ecf0] rounded-2xl z-20"
                        style={{ boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff" }}
                      >
                        {searchResults.length ? (
                          searchResults.map((item) => (
                            <Link href={`/product/${item.slug}`} key={item.id} onClick={() => setSearchFocused(false)}>
                              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-200/40 transition rounded-2xl">
                                {item.image && (
                                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shrink-0 border border-gray-100">
                                    <Image width={40} height={40} src={item.image} alt={item.text} className="w-full h-full object-cover" />
                                  </div>
                                )}
                                <div>
                                  <span className="text-gray-900 font-semibold text-sm">{item.text}</span>
                                  <div className="text-gray-500 text-xs">{item.subtext}</div>
                                </div>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="py-6 text-center text-gray-500 font-medium">No results found.</div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* CART + NOTIFICATIONS + PROFILE */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link href="/cart" aria-label="Cart">
                <motion.button
                  whileTap={tapBounce}
                  className="relative text-royal-gold p-3 rounded-xl bg-[#e8ecf0]"
                  style={{ boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff" }}
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 18 }}
                      className="absolute -top-2 -right-2 bg-royal-gold text-white text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ boxShadow: "2px 2px 4px #c5cdd5" }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </motion.button>
              </Link>

              {/* Notifications */}
              <motion.button
                whileTap={tapBounce}
                onClick={() => router.push("/notifications")}
                className="relative text-royal-gold p-3 rounded-xl bg-[#e8ecf0]"
                style={{ boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff" }}
                aria-label="Notifications"
              >
                <Bell className="w-6 h-6" />
                {notificationCount > 0 && (
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ boxShadow: "2px 2px 4px #c5cdd5" }}
                  >
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Profile Dropdown */}
              <div className="relative">
                <motion.button
                  whileTap={tapBounce}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="text-royal-gold p-3 rounded-xl bg-[#e8ecf0]"
                  style={{ boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff" }}
                  aria-haspopup="menu"
                  aria-expanded={profileDropdownOpen}
                >
                  <User className="w-6 h-6" />
                </motion.button>
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      key="profile-dd"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="absolute right-0 mt-3 w-56 bg-[#e8ecf0] rounded-2xl z-50 overflow-hidden"
                      style={{ boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff" }}
                    >
                      {user.name ? (
                        <>
                          <div className="px-4 py-3 border-b border-gray-300/30 text-gray-900 font-semibold text-sm">
                            👋 {user.name}
                          </div>
                          <motion.a whileTap={tapBounce} href="/profile" className="block px-4 py-3 hover:bg-gray-300/20 text-gray-700 font-medium text-sm transition-colors">
                            Profile
                          </motion.a>
                          <motion.a whileTap={tapBounce} href="/orders" className="block px-4 py-3 hover:bg-gray-300/20 text-gray-700 font-medium text-sm transition-colors">
                            My Orders
                          </motion.a>
                          <motion.button
                            whileTap={tapBounce}
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-3 hover:bg-red-50 text-red-500 font-medium text-sm transition-colors"
                          >
                            Logout
                          </motion.button>
                        </>
                      ) : (
                        <motion.button
                          whileTap={tapBounce}
                          onClick={() => { setIsModalOpen(true); setProfileDropdownOpen(false); }}
                          className="block w-full text-left px-4 py-3 text-gray-800 font-medium hover:bg-gray-300/20 transition-colors"
                        >
                          Login
                        </motion.button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </nav>

        {/* AUTH MODAL */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              key="auth-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-lg flex justify-center items-center z-9999"
              onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
            >
              <motion.div
                key="auth-card"
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.8 }}
                className="relative bg-[#e8ecf0] p-10 rounded-3xl w-105 max-w-[92vw] flex flex-col items-center"
                style={{ boxShadow: "24px 24px 48px #c5cdd5, -24px -24px 48px #ffffff" }}
              >
                {/* Close Button */}
                <motion.button
                  whileTap={tapBounce}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 bg-[#e8ecf0] rounded-full w-9 h-9 flex items-center justify-center transition-all"
                  style={{ boxShadow: "4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff" }}
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close"
                >
                  <X size={18} />
                </motion.button>

                {/* Logo — larger in modal */}
                <div
                  className="rounded-2xl p-2 mb-6"
                  style={{ boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff" }}
                >
                  <Image
                    src="/logo.png"
                    alt="Jottosop Logo"
                    width={200}
                    height={80}
                    className="rounded-xl object-contain"
                    priority
                  />
                </div>

                {/* Heading */}
                <h2 className="text-2xl font-extrabold text-center text-gray-900 tracking-tight mb-1">
                  Welcome to Jottosop
                </h2>
                <p className="text-sm font-medium text-gray-500 text-center mb-8">
                  Sign in with Google to continue shopping
                </p>

                {/* Google Login Button */}
                <div
                  ref={googleBtnRef}
                  className="w-full rounded-2xl overflow-hidden"
                  style={{ boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff" }}
                >
                  <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={() =>
                      toast.error("Google Login Failed", {
                        duration: 3000,
                        position: "top-right",
                        ...neuToast.error,
                      })
                    }
                    theme="filled_blue"
                    size="large"
                    width={googleBtnWidth}
                    text="signin_with"
                  />
                </div>

                <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed">
                  By signing in, you agree to our{" "}
                  <Link href="/terms" className="underline hover:text-gray-600 transition-colors">Terms</Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline hover:text-gray-600 transition-colors">Privacy Policy</Link>
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <MegaMenu />

        {/* Mobile Search Bar */}
        {isMobile && showSearchBar && !pathname.includes("/search") && (
          <Link href="/search">
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="fixed bottom-4 left-4 right-4 bg-[#e8ecf0] py-3 px-3 z-9999 rounded-full"
              style={{ boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff" }}
            >
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-6 pr-14 py-3 rounded-full bg-[#e8ecf0] placeholder:text-gray-500 placeholder:font-medium text-gray-900 focus:outline-none"
                  style={{ boxShadow: "inset 3px 3px 6px #c5cdd5, inset -3px -3px 6px #ffffff" }}
                  value={mobileSearchTerm}
                  onChange={(e) => setMobileSearchTerm(e.target.value)}
                  readOnly
                />
                <motion.button
                  whileTap={tapBounce}
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-[#e8ecf0] flex items-center justify-center"
                  style={{ boxShadow: "4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff" }}
                >
                  <Search className="text-gray-600 w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </Link>
        )}
      </GoogleOAuthProvider>
    </>
  );
}
