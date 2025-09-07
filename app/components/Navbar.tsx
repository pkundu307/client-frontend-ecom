"use client";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useState, useEffect } from "react";
import { Search, ShoppingCart, User } from "lucide-react";
import { baseUrl } from "../utilities/baseUrl";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setUser, logoutUser } from "../store/userSlice";
import Link from "next/link";
import toast from 'react-hot-toast';

import { usePathname } from 'next/navigation';
import MegaMenu from './Categories';


export default function Navbar({ cartCount = 2 }: { cartCount?: number }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  console.log(user,',.,.,.');
  

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
        position: 'top-right',
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #d4af37',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fff',
        },
      });
      return;
    }

    const loadingToast = toast.loading('Signing you in...', {
      position: 'top-right',
      style: {
        background: '#1f2937',
        color: '#fff',
        border: '1px solid #d4af37',
      },
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

      toast.success(isSignUp ? "🎉 Account created successfully! Welcome to RoyalGreens!" : "✨ Welcome back! Login successful!", {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#065f46',
          color: '#fff',
          border: '1px solid #d4af37',
        },
        iconTheme: {
          primary: '#10b981',
          secondary: '#fff',
        },
        id: loadingToast,
      });
      
      setIsModalOpen(false);

      // Store JWT Token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ name: data.name, role: data.role }));

      // Dispatch user info to Redux
      dispatch(setUser({ name: data.name, role: data.role }));

      setName(""); 
      setEmail(""); 
      setPassword("");
    } catch (error: unknown) {
      console.error("Authentication Error:", error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during authentication';
      
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #ef4444',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fff',
        },
        id: loadingToast,
      });
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      console.error("No credentials received");
      toast.error("No credentials received from Google", {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #ef4444',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fff',
        },
      });
      return;
    }

    const loadingToast = toast.loading('Signing in with Google...', {
      position: 'top-right',
      style: {
        background: '#1f2937',
        color: '#fff',
        border: '1px solid #d4af37',
      },
    });

    try {
      const response = await fetch(`${baseUrl}/auth/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ googleToken: credentialResponse.credential }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Google login failed");

      toast.success("🎉 Google login successful! Welcome to RoyalGreens!", {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#065f46',
          color: '#fff',
          border: '1px solid #d4af37',
        },
        iconTheme: {
          primary: '#10b981',
          secondary: '#fff',
        },
        id: loadingToast,
      });
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ name: data.name, role: data.role }));

      dispatch(setUser({ name: data.name, role: data.role }));
      
      // Close the modal after successful Google login
      setIsModalOpen(false);
      
      // Reset form fields
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("Google login failed. Please try again.", {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #ef4444',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fff',
        },
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
      position: 'top-right',
      style: {
        background: '#065f46',
        color: '#fff',
        border: '1px solid #d4af37',
      },
      iconTheme: {
        primary: '#10b981',
        secondary: '#fff',
      },
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      fetch(`${baseUrl}/auth/protected`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowSearchBar(false);
      } else {
        setShowSearchBar(true);
      }
      setLastScrollY(window.scrollY);
    };

    if (isMobile) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile, lastScrollY]);

  return (
    <>
    <GoogleOAuthProvider clientId="939883123761-up76q4mal36sd3quh558ssccr1cqc035.apps.googleusercontent.com">
    <nav className="shadow-lg py-2 px-6 z-20 sticky top-0 backdrop-blur-sm bg-royal-green/95">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/">
          <div className="text-royal-gold text-2xl font-bold drop-shadow-sm">
            Royal<span className="text-white">Greens</span>
          </div>
          </Link>
          {!isMobile && (
            <div className="flex-1 mx-6">
              <div className="relative w-full max-w-xl">
                <input
                  type="text"
                  placeholder="Discover premium greens..."
                  className="w-full pl-6 pr-14 py-3 bg-white/15 backdrop-blur-sm border-2 border-royal-gold/30 rounded-2xl text-white placeholder:text-royal-gold/80 focus:outline-none focus:border-royal-gold/50 focus:bg-white/20 transition-all duration-300 shadow-inner"
                />
                <button className="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-10 w-10 bg-royal-gold hover:bg-royal-gold/90 rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg">
                  <Search className="text-royal-green w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          <div className="flex space-x-6">
            <Link href="/cart">
            <button className="relative text-royal-gold hover:text-white transition-colors duration-200">
              <ShoppingCart className="w-6 h-6 drop-shadow-sm" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-royal-gold text-royal-green text-xs px-2 py-0.5 rounded-full font-bold shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>
</Link>
            <div className="relative">
              <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="text-royal-gold hover:text-white transition-colors duration-200">
                <User className="w-6 h-6 drop-shadow-sm" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-royal-green/95 backdrop-blur-sm border border-royal-gold/50 rounded-lg shadow-xl z-50 overflow-hidden">
                  {user.name ? (
                    <>
                      <div className="px-4 py-2 text-white bg-white/10 border-b border-royal-gold/20">Welcome, {user.name}</div>
                      <a href="/profile" className="block px-4 py-2 text-white hover:bg-white/20 transition-colors duration-200">Profile</a>
                      <div onClick={handleLogout} className="block w-full text-left px-4 py-2 text-white hover:bg-white/20 transition-colors duration-200 cursor-pointer">Logout</div>
                    </>
                  ) : (
                    <button onClick={() => setIsModalOpen(true)} className="block w-full text-left px-4 py-2 text-white hover:bg-white/20 transition-colors duration-200">
                      Login
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {isModalOpen && (
  <div className="fixed inset-0 bg-royal-green/90 backdrop-blur-md flex justify-center items-center z-[9999]">
    <div className="bg-gradient-to-br from-royal-green/95 to-green-600/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-96 relative border-2 border-royal-gold/30 max-w-[90vw]">
      {/* Decorative overlay */}
      <div className="absolute inset-0 bg-white/5 rounded-2xl"></div>
      
      {/* Modal content */}
      <div className="relative z-10">
        <button
          className="absolute -top-2 -right-2 text-royal-gold hover:text-white transition-colors duration-200 bg-white/10 rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          ✖
        </button>
        
        <h2 className="text-2xl font-bold text-center mb-6 text-white drop-shadow-sm">
          {isSignUp ? "Join RoyalGreens" : "Welcome Back"}
        </h2>

        {/* Name field (only for Sign Up) */}
        {isSignUp && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-royal-gold/50 focus:outline-none focus:border-royal-gold/50 text-white bg-white/10 backdrop-blur-sm placeholder-white/80 transition-all duration-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-royal-gold/50 focus:outline-none focus:border-royal-gold/50 text-white bg-white/10 backdrop-blur-sm placeholder-white/80 transition-all duration-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-royal-gold/50 focus:outline-none focus:border-royal-gold/50 text-white bg-white/10 backdrop-blur-sm placeholder-white/80 transition-all duration-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="w-full bg-royal-gold text-royal-green py-3 rounded-lg hover:bg-royal-gold/90 hover:shadow-lg transition-all duration-300 font-bold text-lg mb-4"
          onClick={handleLoginSignup}
        >
          {isSignUp ? "Create Account" : "Sign In"}
        </button>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/30"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-royal-green text-white/80">or</span>
          </div>
        </div>

        <div className="w-full border border-white/30 rounded-lg hover:bg-white/10 transition-all duration-300 overflow-hidden">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => console.log("Google Login Failed")}
            theme="filled_blue"
            size="large"
            width="100%"
            text={isSignUp ? "signup_with" : "signin_with"}
          />
        </div>

        <p className="text-center text-sm mt-6 text-white/90">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-royal-gold font-semibold hover:text-white transition-colors duration-200 underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  </div>
)}
<MegaMenu/>

{/* Mobile Search Bar */}
{isMobile && showSearchBar && !pathname.includes('/search') && (
  <Link href={'/search'}>
    <div className="fixed bottom-0 left-0 right-0 w-full bg-royal-green/95 backdrop-blur-sm py-3 px-4 shadow-lg z-[9999] border-t border-royal-gold/20">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search premium greens..."
          className="w-full pl-6 pr-14 py-3 bg-white/15 backdrop-blur-sm border-2 border-royal-gold/30 rounded-2xl text-white placeholder:text-royal-gold/80 focus:outline-none focus:border-royal-gold/50 focus:bg-white/20 transition-all duration-300 shadow-inner"
          value={mobileSearchTerm}
          onChange={(e) => setMobileSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-10 w-10 bg-royal-gold hover:bg-royal-gold/90 rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg"
        >
          <Search className="text-royal-green w-5 h-5" />
        </button>
      </div>
    </div>
  </Link>
)}
</GoogleOAuthProvider>
    </>
  );
}