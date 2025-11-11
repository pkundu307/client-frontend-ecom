"use client";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useState, useEffect } from "react";
import { Search, ShoppingCart, User } from "lucide-react";
import { baseUrl } from "../utilities/baseUrl";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setUser, logoutUser } from "../store/userSlice";
import Link from "next/link";
import toast from "react-hot-toast";
import { selectUniqueItemCount } from "../store/cartSlice";
import { usePathname } from "next/navigation";
import MegaMenu from "./Categories";
import { AppDispatch } from "../store/store";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const cartCount = useSelector(selectUniqueItemCount);
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSearchTerm, setMobileSearchTerm] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      dispatch(setUser(storedUser));
    }
  }, [dispatch]);

  const handleLoginSignup = async () => {
    if (!email || !password || (isSignUp && !name)) {
      toast.error("Please fill in all fields.", {
        duration: 3000,
        position: "top-right",
        style: { background: "#1f2937", color: "#fff", border: "1px solid #d4af37" },
        iconTheme: { primary: "#ef4444", secondary: "#fff" },
      });
      return;
    }

    const loadingToast = toast.loading("Signing you in...", {
      position: "top-right",
      style: { background: "#1f2937", color: "#fff", border: "1px solid #d4af37" },
    });

    try {
      const endpoint = isSignUp ? `${baseUrl}/auth/register` : `${baseUrl}/auth/login`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isSignUp ? { name, email, password } : { email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Authentication failed");

      toast.success(
        isSignUp ? "🎉 Account created successfully! Welcome to RoyalGreens!" : "✨ Welcome back! Login successful!",
        {
          duration: 4000,
          position: "top-right",
          style: { background: "#065f46", color: "#fff", border: "1px solid #d4af37" },
          iconTheme: { primary: "#10b981", secondary: "#fff" },
          id: loadingToast,
        }
      );

      setIsModalOpen(false);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ name: data.name, role: data.role }));
      dispatch(setUser({ name: data.name, role: data.role }));

      setName("");
      setEmail("");
      setPassword("");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred during authentication";
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-right",
        style: { background: "#1f2937", color: "#fff", border: "1px solid #ef4444" },
        iconTheme: { primary: "#ef4444", secondary: "#fff" },
        id: loadingToast,
      });
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse?.credential) {
      toast.error("No credentials received from Google", {
        duration: 3000,
        position: "top-right",
        style: { background: "#1f2937", color: "#fff", border: "1px solid #ef4444" },
        iconTheme: { primary: "#ef4444", secondary: "#fff" },
      });
      return;
    }

    const loadingToast = toast.loading("Signing in with Google...", {
      position: "top-right",
      style: { background: "#1f2937", color: "#fff", border: "1px solid #d4af37" },
    });

    try {
      const response = await fetch(`${baseUrl}/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ googleToken: credentialResponse.credential }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Google login failed");

      toast.success("🎉 Google login successful! Welcome to RoyalGreens!", {
        duration: 4000,
        position: "top-right",
        style: { background: "#065f46", color: "#fff", border: "1px solid #d4af37" },
        iconTheme: { primary: "#10b981", secondary: "#fff" },
        id: loadingToast,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ name: data.name, role: data.role }));
      dispatch(setUser({ name: data.name, role: data.role }));

      setIsModalOpen(false);
      setName("");
      setEmail("");
      setPassword("");

      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      if (guestCart.length > 0) {
        // Reserved for future sync (kept intact).
        // Clear local cart after syncing if needed.
      }
    } catch (error) {
      toast.error(`${error}Google login failed. Please try again.`, {
        duration: 4000,
        position: "top-right",
        style: { background: "#1f2937", color: "#fff", border: "1px solid #ef4444" },
        iconTheme: { primary: "#ef4444", secondary: "#fff" },
        id: loadingToast,
      });
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setProfileDropdownOpen(false);

    toast.success("👋 Logged out successfully! See you soon!", {
      duration: 3000,
      position: "top-right",
      style: { background: "#065f46", color: "#fff", border: "1px solid #d4af37" },
      iconTheme: { primary: "#10b981", secondary: "#fff" },
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${baseUrl}/auth/protected`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
        })
        .then(() => {})
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) setShowSearchBar(false);
      else setShowSearchBar(true);
      setLastScrollY(window.scrollY);
    };
    if (isMobile) window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, lastScrollY]);

  // Motion variants and helpers (UI only)
  const tapBounce = { scale: 0.96 };
  const hoverLift = {
    y: -1.5,
    boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
    transition: { type: "spring", stiffness: 400, damping: 28, mass: 0.6 },
  };
  const dropdownVariants = {
    hidden: { opacity: 0, y: -6, scale: 0.98, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 420, damping: 32, mass: 0.7 },
    },
    exit: { opacity: 0, y: -6, scale: 0.98, filter: "blur(6px)", transition: { duration: 0.18, ease: "easeOut" } },
  };

  return (
    <>
      <GoogleOAuthProvider clientId="939883123761-up76q4mal36sd3quh558ssccr1cqc035.apps.googleusercontent.com">
        {/* NAVBAR */}
        <nav className="py-2 px-6 z-20 sticky top-0 glass backdrop-blur-md supports-[backdrop-filter]:bg-transparent bg-[rgba(10,15,25,0.65)]">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* LOGO */}
            <motion.div whileHover={hoverLift}>
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Jotto Logo"
                  width={64}
                  height={64}
                  className="rounded-xl border border-[rgba(255,255,255,0.18)] shadow-lg"
                />
                <span className="text-royal-gold text-2xl font-bold drop-shadow-sm"></span>
              </Link>
            </motion.div>

            {/* SEARCH (Desktop only) */}
            {!isMobile && (
              <div className="flex-1 mx-6">
                <div className="relative w-full max-w-xl">
                  <input
                    type="text"
                    placeholder="Discover premium 3D products..."
                    className="input-glass w-full pl-6 pr-14 py-3 rounded-2xl transition-all duration-300 shadow-inner focus:ring-0 placeholder:text-[rgba(255,255,255,0.6)]"
                  />
                  <motion.button
                    whileTap={tapBounce}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl btn-accent flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-105"
                  >
                    <Search className="text-black w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            )}

            {/* CART + PROFILE */}
            <div className="flex items-center space-x-5">
              {/* CART */}
              <Link href="/cart" aria-label="Cart">
                <motion.button
                  whileTap={tapBounce}
                  className="relative text-royal-gold hover:text-white transition-colors duration-200 rounded-lg px-1 py-1"
                >
                  <motion.span whileHover={{ rotate: -6 }} transition={{ type: "spring", stiffness: 500, damping: 20 }}>
                    <ShoppingCart className="w-6 h-6 drop-shadow-sm" />
                  </motion.span>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 18 }}
                      className="absolute -top-2 -right-2 bg-royal-gold text-royal-green text-xs px-2 py-0.5 rounded-full font-bold shadow-lg"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </motion.button>
              </Link>

              {/* PROFILE DROPDOWN */}
              <div className="relative">
                <motion.button
                  whileTap={tapBounce}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="text-royal-gold hover:text-white transition-colors duration-200 focus:outline-none rounded-lg p-1"
                  aria-haspopup="menu"
                  aria-expanded={profileDropdownOpen}
                >
                  <motion.span whileHover={{ rotate: 6 }} transition={{ type: "spring", stiffness: 500, damping: 20 }}>
                    <User className="w-6 h-6 drop-shadow-sm" />
                  </motion.span>
                </motion.button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      key="profile-dd"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="absolute right-0 mt-3 w-56 glass-strong rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-2xl backdrop-saturate-200 bg-[rgba(12,18,32,0.55)] border border-[rgba(255,255,255,0.08)]"
                    >
                      <div
                        className="pointer-events-none absolute inset-0 opacity-70"
                        style={{
                          background:
                            "radial-gradient(120% 60% at 10% 20%, rgba(255,255,255,0.14), rgba(255,255,255,0.04) 35%, transparent 70%)",
                        }}
                      />
                      {user.name ? (
                        <>
                          <div className="px-4 py-2 bg-[rgba(255,255,255,0.86)] border-b border-[rgba(92,178,224,0.12)] text-[rgba(8,15,26,0.95)] font-medium">
                            Welcome, {user.name}
                          </div>
                          <motion.a whileTap={tapBounce} href="/profile" className="block px-4 bg-[rgba(255,255,255,0.86)] py-2 hover:bg-[rgba(255,255,255,0.08)] text-[rgba(8,15,26,0.95)]">
                            Profile
                          </motion.a>
                          <motion.a whileTap={tapBounce} href="/orders" className="block px-4 bg-[rgba(255,255,255,0.86)] py-2 hover:bg-[rgba(255,255,255,0.08)] text-[rgba(8,15,26,0.95)]">
                            My Orders
                          </motion.a>
                          <motion.button
                            whileTap={tapBounce}
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 bg-[rgba(255,255,255,0.86)] hover:bg-[rgba(255,255,255,0.08)] text-[rgba(8,15,26,0.95)]"
                          >
                            Logout
                          </motion.button>
                        </>
                      ) : (
                        <motion.button
                          whileTap={tapBounce}
                          onClick={() => setIsModalOpen(true)}
                          className="block w-full text-left px-4 py-2 text-[rgba(8,15,26,0.95)] bg-[rgba(255,255,255,0.86)] hover:bg-[rgba(255,255,255,0.08)]"
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
              className="fixed inset-0 bg-[rgba(7,10,16,0.7)] backdrop-blur-xl flex justify-center items-center z-[9999]"
            >
              <motion.div
                key="auth-card"
                initial={{ opacity: 0, y: 18, scale: 0.98, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 18, scale: 0.98, filter: "blur(6px)" }}
                transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.8 }}
                className="relative glass-strong p-8 rounded-2xl w-96 max-w-[90vw] border border-[rgba(255,255,255,0.08)] shadow-2xl"
              >
                <motion.button
                  whileTap={tapBounce}
                  className="absolute -top-3 -right-3 text-royal-gold hover:text-white bg-[rgba(255,255,255,0.1)] rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close"
                >
                  ✖
                </motion.button>

                <h2 className="text-2xl font-bold text-center mb-6 text-[rgba(232,238,248,0.98)] drop-shadow-sm">
                  {isSignUp ? "Join Jotto" : "Welcome Back"}
                </h2>

                {isSignUp && (
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="input-glass w-full px-4 py-3 rounded-lg transition-all duration-300"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                )}

                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="input-glass w-full px-4 py-3 rounded-lg transition-all duration-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-6">
                  <input
                    type="password"
                    placeholder="Password"
                    className="input-glass w-full px-4 py-3 rounded-lg transition-all duration-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <motion.button
                  whileTap={tapBounce}
                  className="w-full btn-accent py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-bold text-lg mb-4"
                  onClick={handleLoginSignup}
                >
                  {isSignUp ? "Create Account" : "Sign In"}
                </motion.button>

                {/* Divider */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[rgba(255,255,255,0.18)]" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 chip-contrast rounded-full bg-[rgba(255,255,255,0.08)]">or</span>
                  </div>
                </div>

                {/* GOOGLE LOGIN */}
                <div className="w-full input-glass rounded-lg hover:bg-[rgba(255,255,255,0.12)] transition-all duration-300 overflow-hidden">
                  <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={() => console.log("Google Login Failed")}
                    theme="filled_blue"
                    size="large"
                    width="100%"
                    text={isSignUp ? "signup_with" : "signin_with"}
                  />
                </div>

                {/* TOGGLE SIGNIN/SIGNUP */}
                <p className="text-center text-sm mt-6 text-[rgba(232,238,248,0.9)]">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-royal-gold font-semibold hover:text-white transition-colors duration-200 underline"
                  >
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MEGA MENU */}
        <MegaMenu />

        {/* MOBILE SEARCH */}
{isMobile && showSearchBar && !pathname.includes("/search") && (
  <Link href="/search">
    <motion.div
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="fixed bottom-4 left-4 right-4 w-auto backdrop-blur-xl py-3 px-3 shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-[9999] rounded-full"
      style={{
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0.85)) rounded-lg'
      }}
    >
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search premium 3D products..."
          className="w-full pl-6 pr-14 py-3 rounded-full transition-all duration-300 bg-white/60 backdrop-blur-sm border border-gray-200/60 shadow-sm placeholder:text-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300/50"
          value={mobileSearchTerm}
          onChange={(e) => setMobileSearchTerm(e.target.value)}
          readOnly
        />
        <motion.button
          whileTap={tapBounce}
          type="button"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-gray-900 hover:bg-gray-800 flex items-center justify-center transition-all duration-200 shadow-md"
        >
          <Search className="text-white w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  </Link>
)}


      </GoogleOAuthProvider>
    </>
  );
}
