"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  ShieldCheck, 
  Award, 
  Sparkles,
  TrendingUp,
  Heart,
  ArrowRight,
  Linkedin,
  Mail
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#e8ecf0]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Jottosop
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing e-commerce through 3D product customization and personalized shopping experiences
            </p>
          </motion.div>
        </div>
        
        {/* Decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#e8ecf0]" 
          style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)" }}
        />
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Founded with a vision to transform the online shopping experience, <span className="font-semibold text-red-600">Jottosop</span> brings 
                the power of 3D visualization and customization to your fingertips. We believe that every customer deserves 
                to see, customize, and personalize products before making a purchase decision.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                As a proud <span className="font-semibold text-green-600">Udyam Registered MSME</span>, we are committed to 
                delivering innovation, quality, and customer satisfaction. Our platform combines cutting-edge technology 
                with user-friendly design to create a seamless shopping experience that goes beyond traditional e-commerce.
              </p>
              <p className="text-gray-700 leading-relaxed">
                From custom t-shirts to personalized gifts, we empower businesses and customers to create products that 
                truly reflect their unique style and preferences. Join us on this journey to redefine online shopping.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center"
          >
            Our Core Values
          </motion.h2>
          
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: Sparkles,
                title: "Innovation",
                description: "Pushing boundaries with 3D technology and creative solutions",
                color: "bg-blue-600"
              },
              {
                icon: Heart,
                title: "Customer First",
                description: "Your satisfaction and experience drive everything we do",
                color: "bg-red-600"
              },
              {
                icon: Award,
                title: "Quality",
                description: "Delivering excellence in products and service every time",
                color: "bg-purple-600"
              },
              {
                icon: TrendingUp,
                title: "Growth",
                description: "Empowering businesses and customers to achieve more",
                color: "bg-green-600"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl p-6 shadow-xl"
              >
                <div className={`${value.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The visionaries behind Jottosop, dedicated to transforming your shopping experience
            </p>
          </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
  {/* Founder */}
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    whileHover={{ y: -8 }}
    className="bg-white rounded-3xl overflow-hidden shadow-2xl"
  >
    <div className="relative h-80 bg-gradient-to-br from-gray-200 to-gray-300">
      <Image
        src="https://pub-5b521def0bfc46dd9037956c478b8c67.r2.dev/team/WhatsApp_Image_2026-02-19_at_9.35.31_PM-removebg-preview.png"
        alt="Soumya Sadhukhan"
        fill
        className="object-contain grayscale hover:grayscale-0 transition-all duration-500 p-4"
        unoptimized
      />
    </div>
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-1">Soumya Sadhukhan</h3>
      <p className="text-red-600 font-semibold mb-3">Founder & CEO</p>
      <p className="text-gray-600 mb-4">
        Visionary entrepreneur driving innovation in e-commerce with a passion for 
        creating personalized shopping experiences through technology.
      </p>
      <div className="flex gap-3">
        <a 
          href="https://www.linkedin.com/in/soumya-sadhukhan" 
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Linkedin className="w-5 h-5" />
        </a>
        <a 
          href="mailto:soumya@jottosop.in"
          className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
        >
          <Mail className="w-5 h-5" />
        </a>
      </div>
    </div>
  </motion.div>

  {/* Technical Advisor */}
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: 0.2 }}
    whileHover={{ y: -8 }}
    className="bg-white rounded-3xl overflow-hidden shadow-2xl"
  >
    <div className="relative h-80 bg-gradient-to-br from-gray-200 to-gray-300">
      <Image
        src="https://pub-5b521def0bfc46dd9037956c478b8c67.r2.dev/team/image-removebg-preview%20(1).png"
        alt="Prasanna Kundu"
        fill
        className="object-contain grayscale hover:grayscale-0 transition-all duration-500 p-4"
        unoptimized
      />
    </div>
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-1">Prasanna Kundu</h3>
      <p className="text-purple-600 font-semibold mb-3">Technical Advisor</p>
      <p className="text-gray-600 mb-4">
        Technology expert steering the technical architecture and innovation strategy, 
        ensuring scalable and cutting-edge solutions.
      </p>
      <div className="flex gap-3">
        <a 
          href="https://www.linkedin.com/in/prasanna-kundu" 
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Linkedin className="w-5 h-5" />
        </a>
        <a 
          href="mailto:prasanna@jottosop.in"
          className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
        >
          <Mail className="w-5 h-5" />
        </a>
      </div>
    </div>
  </motion.div>
</div>

        </div>
      </section>

      {/* Udyam Certification Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="bg-green-100 p-8 rounded-2xl">
                  <ShieldCheck className="w-20 h-20 text-green-600" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Udyam Registered Enterprise
                </h2>
                <p className="text-gray-600 mb-4 text-lg">
                  Certified by Ministry of Micro, Small & Medium Enterprises, Government of India
                </p>
                <div className="bg-green-50 p-4 rounded-xl inline-block">
                  <p className="text-green-800 font-semibold">
                    UDYAM Registration Number: <span className="font-mono">UDYAM-KA-XX-XXXXXXX</span>
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    Category: Micro/Small Enterprise
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[{ number: "1000+", label: "Happy Customers — We’re Working Towards It" },
              { number: "50+", label: "Products" },
              { number: "24/7", label: "Support" },
              { number: "100%", label: "Secure" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center shadow-xl"
              >
                <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-red-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-red-100 mb-8">
              Join thousands of satisfied customers and experience personalized shopping
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2 shadow-xl"
              >
                Start Shopping
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
              >
                Contact Us
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
