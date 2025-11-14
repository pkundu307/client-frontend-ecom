"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Sparkles,
  Package,
  Truck,
  Shield,
//   CreditCard
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      {/* Trust Badges Section */}
      <div className="border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div 
              whileHover={{ y: -4 }}
              className="flex flex-col items-center text-center p-4 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(255,255,255,0.05)'
              }}
            >
              <div className="bg-blue-600 p-3 rounded-full mb-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-white text-sm mb-1">3D Customization</h4>
              <p className="text-gray-400 text-xs">Personalize before you buy</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="flex flex-col items-center text-center p-4 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(255,255,255,0.05)'
              }}
            >
              <div className="bg-green-600 p-3 rounded-full mb-3">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-white text-sm mb-1">Free Shipping</h4>
              <p className="text-gray-400 text-xs">On orders above ₹500</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="flex flex-col items-center text-center p-4 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(255,255,255,0.05)'
              }}
            >
              <div className="bg-purple-600 p-3 rounded-full mb-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-white text-sm mb-1">Secure Payment</h4>
              <p className="text-gray-400 text-xs">100% secure transactions</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="flex flex-col items-center text-center p-4 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(255,255,255,0.05)'
              }}
            >
              <div className="bg-orange-600 p-3 rounded-full mb-3">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-white text-sm mb-1">Easy Returns</h4>
              <p className="text-gray-400 text-xs">7-day return policy</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div 
                className="rounded-2xl p-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  boxShadow: '4px 4px 8px rgba(0,0,0,0.4), -2px -2px 6px rgba(255,255,255,0.1)'
                }}
              >
                <Image
                  src="/logo.png"
                  alt="Jotto Logo"
                  width={40}
                  height={40}
                  className="rounded-xl"
                />
              </div>
              <span className="text-2xl font-bold text-white">Jotto</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Experience the future of online shopping with 3D product customization. Design your perfect product before you buy.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "#", color: "hover:bg-blue-600" },
                { icon: Instagram, href: "#", color: "hover:bg-pink-600" },
                { icon: Twitter, href: "#", color: "hover:bg-blue-400" },
                { icon: Linkedin, href: "#", color: "hover:bg-blue-700" }
              ].map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2.5 rounded-xl bg-gray-800/50 ${social.color} transition-colors`}
                  style={{
                    boxShadow: '3px 3px 6px rgba(0,0,0,0.4), -2px -2px 4px rgba(255,255,255,0.05)'
                  }}
                >
                  <social.icon className="w-5 h-5 text-gray-300" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Shop</h3>
            <ul className="space-y-3">
              {["All Products", "New Arrivals", "Best Sellers", "Custom Products", "Sale", "Categories"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors hover:pl-2 inline-block duration-300">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-3">
              {[
                "Track Order",
                "Returns & Exchanges",
                "Shipping Info",
                "Size Guide",
                "3D Customization Help",
                "FAQs"
              ].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors hover:pl-2 inline-block duration-300">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <a href="mailto:support@jotto.com" className="text-white hover:text-blue-400 transition-colors">
                    support@jotto.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <a href="tel:+911234567890" className="text-white hover:text-green-400 transition-colors">
                    +91 123 456 7890
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">Address</p>
                  <p className="text-white">
                    Veiloor, Kerala<br />
                    India
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 Jotto. All rights reserved. | Customize. Visualize. Purchase.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
