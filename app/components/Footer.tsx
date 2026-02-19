"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  Facebook, 
  Linkedin, 
  Mail, 
  Phone, 
  Instagram,
  Award,
} from "lucide-react";

const Footer = () => {
  const paymentMethods = [
    { 
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Visa_acceptance_logo_%282015_onwards%29.svg/330px-Visa_acceptance_logo_%282015_onwards%29.svg.png?20150130134237", 
      alt: "Visa",
      width: 50,
      height: 20
    },
    { 
      src: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg", 
      alt: "Mastercard",
      width: 50,
      height: 30
    },
    { 
      src: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg", 
      alt: "UPI",
      width: 50,
      height: 30
    },
    { 
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/RuPay_logo.svg/500px-RuPay_logo.svg.png?20211223155558", 
      alt: "RuPay",
      width: 50,
      height: 20
    },
    { 
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/American_Express_logo.svg/500px-American_Express_logo.svg.png?20110516174150", 
      alt: "American Express",
      width: 50,
      height: 20
    },
    { 
      src: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg", 
      alt: "PayPal",
      width: 50,
      height: 20
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About Column */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase mb-4 tracking-wide">About</h3>
            <ul className="space-y-3">
              {[
                { name: "Contact Us", href: "/contact" },
                { name: "About Us", href: "/about" },
                { name: "Careers", href: "/careers" },
                { name: "Jotto Stories", href: "/stories" },
                { name: "Press", href: "/press" },
                { name: "Corporate Information", href: "/corporate" }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors text-sm hover:pl-1 inline-block duration-300">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase mb-4 tracking-wide">Help</h3>
            <ul className="space-y-3">
              {[
                { name: "Payments", href: "/faq#payment" },
                { name: "Shipping", href: "/faq#shipping" },
                { name: "Cancellation & Returns", href: "/faq#returns" },
                { name: "FAQ", href: "/faq" },
                // { name: "Report Infringement", href: "/report" }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors text-sm hover:pl-1 inline-block duration-300">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Consumer Policy Column */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase mb-4 tracking-wide">Consumer Policy</h3>
            <ul className="space-y-3">
              {[
                { name: "Cancellation & Returns", href: "/faq#returns" },
                { name: "Terms Of Use", href: "/terms" },
                { name: "Security", href: "/security" },
                { name: "Privacy", href: "/privacy" },
                { name: "Sitemap", href: "https://jottosop.in/sitemap.xml" },
                // { name: "Grievance Redressal", href: "/grievance" },
                // { name: "EPR Compliance", href: "/epr" }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors text-sm hover:pl-1 inline-block duration-300">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mail Us Column */}
          <div>
            <div className="text-gray-400 text-sm leading-relaxed">
              <p className="font-semibold text-white mb-2">Jottosop Internet Private Limited,</p>
              <p>Floor No.: 0</p>
              <p>Building No./Flat No.: 275</p>
              <p>Road/Street: Netaji Subhas Road</p>
              <p>City/Town/Village: Howrah</p>
              <p>District: Howrah</p>
              <p>State: West Bengal</p>
              <p>PIN Code: 711101</p>
              <p>Country: India</p>
            </div>
            
            <div className="mt-6">
              <h4 className="text-white font-semibold text-sm mb-3">Social:</h4>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, href: "https://www.facebook.com/people/Jottosop/61587495520706", label: "Facebook" },
                  { icon: Instagram, href: "https://www.instagram.com/jottosop", label: "Instagram" },
                  { icon: Linkedin, href: "https://www.linkedin.com/company/112094205/", label: "LinkedIn" },
                  { icon: Mail, href: "mailto:contact@jotto.in", label: "Email" }
                ].map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-gray-300" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

      
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Left Section - Links */}
            <div className="flex flex-wrap gap-6 text-sm justify-center lg:justify-start">
              <a 
                href="https://diary.jottosop.in" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                Become a Seller
              </a>
              <Link href="/faq" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Help Center
              </Link>
              <Link href="/profile/tickets" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Support Tickets
              </Link>
            </div>

            {/* Right Section - Payment Methods */}
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm mr-2">We Accept:</span>
              <div className="flex gap-3 flex-wrap justify-center items-center">
                {paymentMethods.map((method, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-2 rounded-lg flex items-center justify-center"
                    style={{ minWidth: '60px', height: '40px' }}
                  >
                    <Image 
                      src={method.src} 
                      alt={method.alt} 
                      width={method.width}
                      height={method.height}
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-6 pt-6 border-t border-gray-700/50">
            <p className="text-gray-400 text-sm">
              © 2026-2027 Jottosop.in | Udyam Registered MSME
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
