// components/Navbar.tsx
"use client";

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, ShoppingCart, User, Loader2, X, Bell } from "lucide-react";
import { baseUrl } from "../utilities/baseUrl";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { setUser, logoutUser } from "../store/userSlice";
import Link from "next/link";
import toast from "react-hot-toast";
import { selectUniqueItemCount } from "../store/cartSlice";
import { usePathname, useRouter } from "next/navigation";
import MegaMenu from "./Categories";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import axios, { AxiosError } from "axios";

// ─── Toast Styles ────────────────────────────────────────────────────────────
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

// ─── Interfaces ───────────────────────────────────────────────────────────────
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

interface Notification {
  id: string;
  isRead: boolean;
}

// ─── Debounce Hook ────────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// ─── Skeleton Navbar (shown during SSR / before mount) ───────────────────────
function NavbarSkeleton() {
  return (
    <nav className="py-3 px-6 bg-[#e8ecf0] border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="w-36 h-10 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="w-64 h-10 bg-gray-200 rounded-2xl hidden lg:block animate-pulse" />
        <div className="flex gap-4">
          <div className="w-11 h-11 bg-gray-200 rounded-xl animate-pulse" />
          <div className="w-11 h-11 bg-gray-200 rounded-xl animate-pulse" />
          <div className="w-11 h-11 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    </nav>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const cartCount    = useSelector(selectUniqueItemCount);
  const pathname     = usePathname();
  const router       = useRouter();
  const dispatch     = useDispatch<AppDispatch>();
  const user         = useSelector((state: RootState) => state.user);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  // ── Mount guard (fixes Cloudflare SSR crash) ─────────────────────────────
  const [mounted, setMounted] = useState(false);

  // ── UI State ──────────────────────────────────────────────────────────────
  const [isModalOpen,         setIsModalOpen]         = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile,            setIsMobile]            = useState(false);
  const [googleBtnWidth,      setGoogleBtnWidth]      = useState(360);

  // ── Scroll State ──────────────────────────────────────────────────────────
  const [showMobileSearch, setShowMobileSearch] = useState(true);
  const [isScrollingUp,    setIsScrollingUp]    = useState(false);

  // ── Search State ──────────────────────────────────────────────────────────
  const [searchQuery,    setSearchQuery]    = useState("");
  const [searchResults,  setSearchResults]  = useState<DisplayResult[]>([]);
  const [searchLoading,  setSearchLoading]  = useState(false);
  const [searchFocused,  setSearchFocused]  = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 300);

  // ── Notification State ────────────────────────────────────────────────────
  const [notificationCount, setNotificationCount] = useState(0);
const GOOGLE_CLIENT_ID = 
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 
  "939883123761-up76q4mal36sd3quh558ssccr1cqc035.apps.googleusercontent.com";

  // ─── Effect 1: Mount + Screen Size + Auth Restore ────────────────────────
  // Must be first effect — sets mounted=true so SSR skeleton is replaced safely
  useEffect(() => {
    setMounted(true);

    const checkScreen = () => setIsMobile(window.innerWidth < 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);

    // Restore auth state from localStorage after mount (safe — no SSR access)
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        dispatch(setUser(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    return () => window.removeEventListener("resize", checkScreen);
  }, [dispatch]);

  // ─── Effect 2: Scroll listener (single, unified) ─────────────────────────
  // Handles both mobile search-bar hide AND scroll-up placeholder color
  useEffect(() => {
    if (!mounted) return;
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const goingUp  = currentY < lastY;
      setIsScrollingUp(goingUp);
      if (isMobile) setShowMobileSearch(goingUp || currentY < 10);
      lastY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted, isMobile]);

  // ─── Effect 3: Notification Polling (only when logged in) ────────────────
  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) { setNotificationCount(0); return; }
    try {
      const res = await axios.get<{ notifications: Notification[] }>(
        `${process.env.NEXT_PUBLIC_API_URL || baseUrl}/notifications/customer`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const unread = res.data.notifications.filter((n) => !n.isRead).length;
      setNotificationCount(unread);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error("Notification fetch failed:", err.message);
      }
      setNotificationCount(0);
    }
  }, []);

  useEffect(() => {
    if (!mounted || !user.name) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // 60s — not 30s
    return () => clearInterval(interval);
  }, [mounted, user.name, fetchNotifications]);

  // ─── Effect 4: Google Button Width for Login Modal ────────────────────────
  useEffect(() => {
    if (isModalOpen && googleBtnRef.current) {
      setGoogleBtnWidth(googleBtnRef.current.offsetWidth);
    }
  }, [isModalOpen]);

  // ─── Effect 5: Live Search ────────────────────────────────────────────────
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || baseUrl}/products/search?query=${encodeURIComponent(debouncedQuery)}`
        );
        if (!res.ok) throw new Error("Search failed");
        const data: ProductSearchResult[] = await res.json();
        setSearchResults(
          data.map((p) => ({
            id:      p.id,
            slug:    p.slug,
            text:    p.title,
            subtext: `in ${p.category.name}`,
            image:   p.images[0] || p.variants[0]?.images[0],
          }))
        );
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    })();
  }, [debouncedQuery]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleGoogleLoginSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse?.credential) {
      toast.error("No credentials received from Google", { duration: 3000, position: "top-right", ...neuToast.error });
      return;
    }

    const loadingToast = toast.loading("Signing in with Google...", { position: "top-right", ...neuToast.loading });

    try {
      const response = await fetch(`${baseUrl}/auth/google-login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ googleToken: credentialResponse.credential }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Google login failed");

      localStorage.setItem("token",          data.accessToken);
      localStorage.setItem("refreshToken",   data.refreshToken);
      localStorage.setItem("user",           JSON.stringify({ name: data.user.name, role: data.user.role }));
      localStorage.setItem("tokenTimestamp", Date.now().toString());
      localStorage.setItem("profilePhoto",   data.user.picture || "");

      dispatch(setUser({ name: data.user.name, role: data.user.role }));
      setIsModalOpen(false);

      toast.success(`🎉 Welcome, ${data.user.name}!`, {
        id: loadingToast, duration: 3000, position: "top-right", ...neuToast.success,
      });
    } catch (error) {
      console.error(error);
      toast.error("Google login failed. Please try again.", {
        id: loadingToast, duration: 4000, position: "top-right", ...neuToast.error,
      });
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.clear();
    setProfileDropdownOpen(false);
    setNotificationCount(0);
    toast.success("👋 Logged out. See you soon!", { duration: 3000, position: "top-right", ...neuToast.success });
    window.location.href = "/";
  };

  // ─── Animation Variants ───────────────────────────────────────────────────
  const tapBounce = { scale: 0.95 };

  const dropdownVariants: Variants = {
    hidden: { opacity: 0, y: -6, scale: 0.97 },
    show: {
      opacity: 1, y: 0, scale: 1,
      transition: { type: "spring", stiffness: 420, damping: 30, mass: 0.7 },
    },
    exit: { opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.15 } },
  };

  // ─── SSR Guard: show skeleton until client is mounted ─────────────────────
  if (!mounted) return <NavbarSkeleton />;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>

      {/* ── Top Navbar ── */}
      <nav
        className="py-3 px-6 sticky top-0 z-50 bg-[#e8ecf0]"
        style={{ boxShadow: "0 4px 12px rgba(197,205,213,0.5), 0 -2px 8px rgba(255,255,255,0.8)" }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 rounded-2xl px-3 py-1.5"
              style={{ boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff" }}
            >
              <Image src="/logo.webp" alt="Jottosop Icon" width={36} height={40} className="object-contain" priority />
              TEST
              <Image
                src="/Name.webp"
                alt="Jottosop"
                width={120}
                height={32}
                className="object-contain hidden sm:block"
                priority
              />
            </div>
          </Link>

          {/* Desktop Search */}
          {!isMobile && (
            <div className="flex-1 mx-6 relative max-w-xl">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                  placeholder="Search for products, brands..."
                  className={`w-full pl-6 pr-14 py-3 rounded-2xl bg-[#e8ecf0] transition-all duration-300 focus:outline-none text-gray-900 font-medium ${
                    isScrollingUp ? "placeholder-yellow-500" : "placeholder-gray-500"
                  }`}
                  style={{ boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff" }}
                />

                {/* Clear Button */}
                {!searchLoading && searchQuery && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-900 rounded-full bg-[#e8ecf0]"
                  >
                    <X size={17} />
                  </motion.button>
                )}

                {/* Loading Spinner */}
                {searchLoading && (
                  <Loader2
                    className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-gray-400"
                    size={18}
                  />
                )}

                {/* Search Dropdown */}
                <AnimatePresence>
                  {searchFocused && searchQuery.length > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 right-0 mt-2 bg-[#e8ecf0] rounded-2xl z-50 overflow-hidden"
                      style={{ boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff" }}
                    >
                      {searchResults.length ? (
                        searchResults.map((item) => (
                          <Link
                            key={item.id}
                            href={`/product/${item.slug}`}
                            onClick={() => { setSearchFocused(false); setSearchQuery(""); }}
                          >
                            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-200/40 transition rounded-2xl">
                              {item.image && (
                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shrink-0 border border-gray-100">
                                  <Image
                                    src={item.image}
                                    alt={item.text}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <p className="text-gray-900 font-semibold text-sm">{item.text}</p>
                                <p className="text-gray-500 text-xs">{item.subtext}</p>
                              </div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        !searchLoading && (
                          <div className="py-6 text-center text-gray-500 font-medium text-sm">
                            No results found for &quot;{searchQuery}&quot;
                          </div>
                        )
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* Cart */}
            <Link href="/cart" aria-label="Cart">
              <motion.button
                whileTap={tapBounce}
                className="relative p-3 rounded-xl bg-[#e8ecf0] text-gray-700"
                style={{ boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff" }}
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full"
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
              className="relative p-3 rounded-xl bg-[#e8ecf0] text-gray-700"
              style={{ boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff" }}
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6" />
              {notificationCount > 0 && (
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full"
                >
                  {notificationCount > 9 ? "9+" : notificationCount}
                </motion.span>
              )}
            </motion.button>

            {/* Profile */}
            <div className="relative">
              <motion.button
                whileTap={tapBounce}
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="p-3 rounded-xl bg-[#e8ecf0] text-gray-700"
                style={{ boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff" }}
                aria-haspopup="menu"
                aria-expanded={profileDropdownOpen}
                aria-label="Profile menu"
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
                        <div className="px-4 py-3 border-b border-gray-200/50 text-gray-900 font-semibold text-sm">
                          👋 {user.name}
                        </div>
                        <motion.a
                          whileTap={tapBounce}
                          href="/profile"
                          className="block px-4 py-3 hover:bg-gray-200/40 text-gray-700 font-medium text-sm transition-colors"
                        >
                          Profile
                        </motion.a>
                        <motion.a
                          whileTap={tapBounce}
                          href="/orders"
                          className="block px-4 py-3 hover:bg-gray-200/40 text-gray-700 font-medium text-sm transition-colors"
                        >
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
                        className="block w-full text-left px-4 py-3 text-gray-800 font-medium hover:bg-gray-200/40 transition-colors text-sm"
                      >
                        Login / Register
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </nav>

      {/* ── Categories MegaMenu ── */}
      <MegaMenu />

      {/* ── Auth Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="auth-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-lg flex justify-center items-center z-[9999]"
            onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
          >
            <motion.div
              key="auth-card"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{ opacity: 0,    y: 20, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.8 }}
              className="relative bg-[#e8ecf0] p-10 rounded-3xl w-full max-w-sm mx-4 flex flex-col items-center"
              style={{ boxShadow: "24px 24px 48px #c5cdd5, -24px -24px 48px #ffffff" }}
            >
              {/* Close */}
              <motion.button
                whileTap={tapBounce}
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 bg-[#e8ecf0] rounded-full w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-all"
                style={{ boxShadow: "4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff" }}
                aria-label="Close"
              >
                <X size={18} />
              </motion.button>

              {/* Logo */}
              <div
                className="rounded-2xl p-3 mb-6"
                style={{ boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff" }}
              >
                <Image
                  src="/logo1.png"
                  alt="Jottosop Logo"
                  width={180}
                  height={72}
                  className="rounded-xl object-contain"
                  priority
                />
              </div>

              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
                Welcome to Jottosop
              </h2>
              <p className="text-sm text-gray-500 font-medium text-center mb-8">
                Sign in with Google to continue shopping
              </p>

              {/* Google Login */}
              <div
                ref={googleBtnRef}
                className="w-full rounded-2xl overflow-hidden"
                style={{ boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff" }}
              >
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={() =>
                    toast.error("Google Login Failed", { duration: 3000, position: "top-right", ...neuToast.error })
                  }
                  theme="filled_blue"
                  size="large"
                  width={googleBtnWidth}
                  text="signin_with"
                />
              </div>

              <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="underline hover:text-gray-600 transition-colors">Terms</Link>
                {" "}and{" "}
                <Link href="/privacy" className="underline hover:text-gray-600 transition-colors">Privacy Policy</Link>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Floating Search Bar ── */}
      <AnimatePresence>
        {isMobile && showMobileSearch && !pathname.includes("/search") && (
          <motion.div
            key="mobile-search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="fixed bottom-4 left-4 right-4 z-[9999]"
          >
            <Link href="/search">
              <div
                className="bg-[#e8ecf0] py-2 px-3 rounded-full"
                style={{ boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff" }}
              >
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search products..."
                    readOnly
                    className="w-full pl-6 pr-14 py-3 rounded-full bg-[#e8ecf0] placeholder:text-gray-500 placeholder:font-medium text-gray-900 focus:outline-none cursor-pointer"
                    style={{ boxShadow: "inset 3px 3px 6px #c5cdd5, inset -3px -3px 6px #ffffff" }}
                  />
                  <div
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-[#e8ecf0] flex items-center justify-center"
                    style={{ boxShadow: "4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff" }}
                  >
                    <Search className="text-gray-600 w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

    </GoogleOAuthProvider>
  );
}
