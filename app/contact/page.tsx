"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "motion/react";
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  UserIcon,
  GlobeAltIcon
} from "@heroicons/react/24/outline";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
    },
  },
};

const ContactUsPage: React.FC = () => {
  const router = useRouter();

  const contactOptions = [
    {
      title: "Founder Support",
      detail: "prasanna@jottosop.in",
      icon: <UserIcon className="w-5 h-5 text-blue-600" />,
      link: "mailto:prasanna@jottosop.in"
    },
    {
      title: "General Help",
      detail: "support@jottosop.in",
      icon: <EnvelopeIcon className="w-5 h-5 text-emerald-600" />,
      link: "mailto:support@jottosop.in"
    },
    {
      title: "Phone",
      detail: "+91 79802 14799",
      icon: <PhoneIcon className="w-5 h-5 text-purple-600" />,
      link: "tel:7980214799"
    }
  ];

  return (
    <div className="min-h-screen bg-[#e8ecf0] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Back + header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="rounded-full p-2 bg-[#e8ecf0] text-gray-700"
            style={{
              boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
            }}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Contact Us
            </h1>
            <p className="text-sm text-gray-600">
              We’re here to help you grow your business.
            </p>
          </div>
        </div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="show"
          className="bg-[#e8ecf0] rounded-3xl p-6 md:p-8"
          style={{
            boxShadow: "16px 16px 32px #c5cdd5, -16px -16px 32px #ffffff",
          }}
        >
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left: Contact Methods */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 px-2">Get in Touch</h2>
              {contactOptions.map((option, idx) => (
                <a
                  key={idx}
                  href={option.link}
                  className="block bg-[#e8ecf0] rounded-2xl p-5 transition-all hover:scale-[1.02]"
                  style={{
                    boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#e8ecf0] rounded-xl shadow-[inset_2px_2px_5px_#c5cdd5,inset_-2px_-2px_5px_#ffffff]">
                      {option.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        {option.title}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {option.detail}
                      </p>
                    </div>
                  </div>
                </a>
              ))}

              {/* Socials */}
              <div className="pt-4 px-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Follow Us</p>
                <div className="flex gap-4">
                  <a 
                    href="https://www.facebook.com/profile.php?id=61587495520706" 
                    target="_blank"
                    className="p-3 rounded-xl bg-[#e8ecf0] shadow-[6px_6px_12px_#c5cdd5,-6px_-6px_12px_#ffffff] hover:shadow-[inset_2px_2px_5px_#c5cdd5,inset_-2px_-2px_5px_#ffffff] transition-all"
                  >
                    <span className="text-blue-600 font-bold">FB</span>
                  </a>
                  <a 
                    href="https://www.instagram.com/jottosop" 
                    target="_blank"
                    className="p-3 rounded-xl bg-[#e8ecf0] shadow-[6px_6px_12px_#c5cdd5,-6px_-6px_12px_#ffffff] hover:shadow-[inset_2px_2px_5px_#c5cdd5,inset_-2px_-2px_5px_#ffffff] transition-all"
                  >
                    <span className="text-pink-600 font-bold">IG</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Middle & Right: Address & Map */}
            <div className="lg:col-span-2 space-y-6">
              <section
                className="bg-[#e8ecf0] rounded-2xl p-6 md:p-8 h-full"
                style={{
                  boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <MapPinIcon className="w-6 h-6 text-red-500" />
                  <h2 className="text-xl font-bold text-gray-900">Registered Office</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="bg-white/40 p-4 rounded-xl border border-white/60">
                      <p className="text-sm leading-relaxed text-gray-800">
                        <span className="block font-bold text-gray-900 mb-1">JottoSop Diary</span>
                        Building No. 275, Floor 0,<br />
                        Netaji Subhas Road,<br />
                        Howrah, West Bengal - 711101<br />
                        India
                      </p>
                    </div>

                    <div className="flex items-start gap-3 p-4">
                      <ClockIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">Business Hours</p>
                        <p className="text-xs text-gray-600">Mon - Sat: 10:00 AM - 07:00 PM</p>
                        <p className="text-xs text-gray-600">Sunday: Closed</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#e8ecf0] rounded-2xl p-2 h-48 md:h-full min-h-[200px] flex items-center justify-center border border-white/50 shadow-[6px_6px_12px_#c5cdd5,-6px_-6px_12px_#ffffff]">
                    <div className="text-center space-y-2">
                       <GlobeAltIcon className="w-10 h-10 text-blue-200 mx-auto" />
                       <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">Location Map Integration<br/>Coming Soon</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 p-6 bg-blue-600 rounded-2xl shadow-lg">
                   <div className="flex items-center gap-4 text-white">
                      <ChatBubbleLeftRightIcon className="w-8 h-8 opacity-80" />
                      <div>
                        <p className="font-bold">Need a faster response?</p>
                        <p className="text-sm opacity-90">Log in to your dashboard to use our real-time 24/7 ticket support system.</p>
                      </div>
                   </div>
                </div>
              </section>
            </div>
          </div>
        </motion.div>

        {/* Footer info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
            JottoSop — Digitalizing Small Businesses with ❤️ in Bengal
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;