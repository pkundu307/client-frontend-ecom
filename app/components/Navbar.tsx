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
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [lastScrollY2, setLastScrollY2] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY2) {
        setIsScrollingUp(true);
      } else if (currentScrollY > lastScrollY2) {
        setIsScrollingUp(false);
      }
      setLastScrollY2(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY2]);

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
    const fetchProtectedData = async () => {
      try {
        const response = await fetch(`${baseUrl}/auth/protected`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const photoUrl = data.user?.picture;

        if (photoUrl) {
          localStorage.setItem("photo", photoUrl);
        }
      } catch (error) {
        console.error("Failed to fetch protected data:", error);
      }
    };

    fetchProtectedData();
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

  const tapBounce = { scale: 0.96 };
  const dropdownVariants = {
    hidden: { opacity: 0, y: -6, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 420, damping: 32, mass: 0.7 },
    },
    exit: { opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.18 } },
  };

  return (
    <>
      <GoogleOAuthProvider clientId="939883123761-up76q4mal36sd3quh558ssccr1cqc035.apps.googleusercontent.com">
        {/* NAVBAR - Neumorphic */}
        <nav 
          className="py-4 px-6 z-20 sticky top-0 bg-[#e8ecf0]"
          style={{
            boxShadow: '0 4px 12px rgba(197, 205, 213, 0.5), 0 -2px 8px rgba(255, 255, 255, 0.8)'
          }}
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-3">
              <div
                className="rounded-2xl p-1"
                style={{
                  boxShadow: '6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff'
                }}
              >
                <Image
                  src="/logo.png"
                  alt="Jotto Logo"
                  width={56}
                  height={56}
                  className="rounded-xl"
                />
              </div>
            </Link>

            {/* SEARCH (Desktop only) - Neumorphic */}
            {!isMobile && (
              <div className="flex-1 mx-6">
                <div className="relative w-full max-w-xl">
                  <input
                    type="text"
                    placeholder="Discover premium products..."
                    className={`w-full pl-6 pr-14 py-3 rounded-2xl bg-[#e8ecf0] transition-all duration-300 focus:outline-none text-gray-900 ${
                      isScrollingUp ? 'placeholder-yellow-600' : 'placeholder-gray-700'
                    }`}
                    style={{
                      boxShadow: 'inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff'
                    }}
                  />
                  <motion.button
                    whileTap={tapBounce}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-[#e8ecf0] flex items-center justify-center transition-all duration-200"
                    style={{
                      boxShadow: '4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff'
                    }}
                  >
                    <Search className="text-gray-700 w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            )}

            {/* CART + PROFILE - Neumorphic */}
            <div className="flex items-center space-x-4">
              {/* CART */}
              <Link href="/cart" aria-label="Cart">
                <motion.button
                  whileTap={tapBounce}
                  className="relative text-royal-gold p-3 rounded-xl bg-[#e8ecf0]"
                  style={{
                    boxShadow: '6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff'
                  }}
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 18 }}
                      className="absolute -top-2 -right-2 bg-royal-gold text-white text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{
                        boxShadow: '2px 2px 4px #c5cdd5'
                      }}
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
                  className="text-royal-gold p-3 rounded-xl bg-[#e8ecf0]"
                  style={{
                    boxShadow: '6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff'
                  }}
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
                      style={{
                        boxShadow: '12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff'
                      }}
                    >
                      {user.name ? (
                        <>
                          <div className="px-4 py-3 border-b border-gray-300/30 text-gray-900 font-semibold">
                            Welcome, {user.name}
                          </div>
                          <motion.a 
                            whileTap={tapBounce} 
                            href="/profile" 
                            className="block px-4 py-3 hover:bg-gray-300/20 text-gray-800 transition-colors"
                          >
                            Profile
                          </motion.a>
                          <motion.a 
                            whileTap={tapBounce} 
                            href="/orders" 
                            className="block px-4 py-3 hover:bg-gray-300/20 text-gray-800 transition-colors"
                          >
                            My Orders
                          </motion.a>
                          <motion.button
                            whileTap={tapBounce}
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-3 hover:bg-gray-300/20 text-gray-800 transition-colors"
                          >
                            Logout
                          </motion.button>
                        </>
                      ) : (
                        <motion.button
                          whileTap={tapBounce}
                          onClick={() => setIsModalOpen(true)}
                          className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-300/20 transition-colors"
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

        {/* AUTH MODAL - Neumorphic */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              key="auth-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-lg flex justify-center items-center z-[9999]"
            >
              <motion.div
                key="auth-card"
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.8 }}
                className="relative bg-[#e8ecf0] p-8 rounded-3xl w-96 max-w-[90vw]"
                style={{
                  boxShadow: '20px 20px 40px #c5cdd5, -20px -20px 40px #ffffff'
                }}
              >
                <motion.button
                  whileTap={tapBounce}
                  className="absolute -top-3 -right-3 text-gray-700 bg-[#e8ecf0] rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 font-bold text-xl"
                  style={{
                    boxShadow: '6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff'
                  }}
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close"
                >
                  ✖
                </motion.button>

                <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
                  {isSignUp ? "Join Jotto" : "Welcome Back"}
                </h2>

                {isSignUp && (
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full px-5 py-3 rounded-2xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600 transition-all duration-300 focus:outline-none"
                      style={{
                        boxShadow: 'inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff'
                      }}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                )}

                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-5 py-3 rounded-2xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600 transition-all duration-300 focus:outline-none"
                    style={{
                      boxShadow: 'inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff'
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-6">
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-5 py-3 rounded-2xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600 transition-all duration-300 focus:outline-none"
                    style={{
                      boxShadow: 'inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff'
                    }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <motion.button
                  whileTap={tapBounce}
                  className="w-full bg-[#e8ecf0] py-4 rounded-2xl font-bold text-lg mb-6 text-gray-900 transition-all duration-300"
                  style={{
                    boxShadow: '8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff'
                  }}
                  onClick={handleLoginSignup}
                >
                  {isSignUp ? "Create Account" : "Sign In"}
                </motion.button>

                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-400/30" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span 
                      className="px-4 py-1 rounded-full bg-[#e8ecf0] text-gray-700 font-semibold"
                      style={{
                        boxShadow: 'inset 2px 2px 4px #c5cdd5, inset -2px -2px 4px #ffffff'
                      }}
                    >
                      or
                    </span>
                  </div>
                </div>

                {/* GOOGLE LOGIN */}
                <div 
                  className="w-full rounded-2xl overflow-hidden"
                  style={{
                    boxShadow: '4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff'
                  }}
                >
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
                <p className="text-center text-sm mt-6 text-gray-700">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-royal-gold font-bold hover:text-gray-900 transition-colors duration-200 underline"
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

        {/* MOBILE SEARCH - Neumorphic */}
        {isMobile && showSearchBar && !pathname.includes("/search") && (
          <Link href="/search">
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="fixed bottom-4 left-4 right-4 bg-[#e8ecf0] py-3 px-3 z-[9999] rounded-full"
              style={{
                boxShadow: '8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff'
              }}
            >
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search premium 3D products..."
                  className="w-full pl-6 pr-14 py-3 rounded-full bg-[#e8ecf0] placeholder:text-gray-600 text-gray-900 focus:outline-none"
                  style={{
                    boxShadow: 'inset 3px 3px 6px #c5cdd5, inset -3px -3px 6px #ffffff'
                  }}
                  value={mobileSearchTerm}
                  onChange={(e) => setMobileSearchTerm(e.target.value)}
                  readOnly
                />
                <motion.button
                  whileTap={tapBounce}
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-[#e8ecf0] flex items-center justify-center transition-all duration-200"
                  style={{
                    boxShadow: '4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff'
                  }}
                >
                  <Search className="text-gray-700 w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </Link>
        )}
      </GoogleOAuthProvider>
    </>
  );
}
