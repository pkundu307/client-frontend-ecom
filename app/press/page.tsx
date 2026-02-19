"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Newspaper,
  Download,
  Mail,
  Calendar,
  FileText,
  Award,
  TrendingUp,
  Users,
  Briefcase,
  ExternalLink,
  Image as ImageIcon,
  Video,
  File
} from "lucide-react";

interface PressRelease {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  image?: string;
}

interface MediaCoverage {
  id: string;
  outlet: string;
  title: string;
  date: string;
  url: string;
  logo?: string;
}

const pressReleases: PressRelease[] = [
  {
    id: "pr-1",
    title: "Jottosop Launches Revolutionary 3D Product Customization Platform",
    date: "February 15, 2026",
    category: "Product Launch",
    excerpt: "Bengaluru-based startup Jottosop introduces cutting-edge 3D visualization technology to transform online shopping experience.",
    content: "Jottosop, a Udyam registered e-commerce platform, today announced the launch of its revolutionary 3D product customization technology. The platform enables customers to visualize, customize, and personalize products in real-time before purchase. With WebGL-based rendering and advanced color management, Jottosop is setting new standards in the e-commerce industry. The platform has already onboarded 50+ sellers and served 1000+ customers within its first six months of operation. Founder Soumya Sadhukhan stated, 'We're not just selling products; we're selling confidence. Our 3D preview technology reduces returns by 40% and increases customer satisfaction by 60%.'",
    image: "/press/launch.jpg"
  },
  {
    id: "pr-2",
    title: "Jottosop Achieves 50x Growth in Six Months, Empowers 50+ Local Sellers",
    date: "January 20, 2026",
    category: "Business Milestone",
    excerpt: "Platform reports exponential growth while supporting local businesses and independent artists across India.",
    content: "Jottosop announced today that it has achieved 50x growth in order volume within six months of launch. The platform now supports over 50 sellers, including independent artists, small businesses, and custom product manufacturers. Technical Advisor Prasanna Kundu highlighted the platform's commitment to sustainability, stating, 'We've eliminated single-use plastics completely and introduced 100% biodegradable packaging. Our print-on-demand model minimizes waste while our 3D technology reduces returns.' The company also reported that sellers on the platform have seen average revenue increases of 3-5x compared to traditional sales channels.",
    image: "/press/growth.jpg"
  },
  {
    id: "pr-3",
    title: "Jottosop Secures Udyam Registration, Commits to Supporting MSME Ecosystem",
    date: "December 10, 2025",
    category: "Company News",
    excerpt: "Official recognition from Government of India's Ministry of MSME reinforces Jottosop's commitment to quality and compliance.",
    content: "Jottosop has been officially registered under the Udyam Registration system by the Ministry of Micro, Small & Medium Enterprises, Government of India. This certification validates the company's commitment to quality, transparency, and regulatory compliance. The platform is now leveraging this recognition to build trust with both buyers and sellers. Founder Soumya Sadhukhan commented, 'This registration is not just a certificate; it's a promise to our customers and partners that we operate with the highest standards of business ethics and quality.'",
    image: "/press/udyam.jpg"
  },
  {
    id: "pr-4",
    title: "Jottosop Partners with Local Artists to Democratize Design Commerce",
    date: "November 25, 2025",
    category: "Partnership",
    excerpt: "New 'Artist Empowerment Program' provides platform for independent designers to reach nationwide audiences.",
    content: "Jottosop announced the launch of its 'Artist Empowerment Program' aimed at supporting independent artists and designers across India. The initiative provides artists with tools to showcase their work on customizable products, handle payments securely, and reach customers nationwide. Artists participating in the program have reported income increases of 3-5x compared to traditional exhibition-based sales. The program includes an 'Artist of the Month' feature that spotlights talented creators. One participating artist from Jaipur has already opened a studio and hired two assistants with earnings from the platform.",
    image: "/press/artists.jpg"
  }
];

const mediaCoverage: MediaCoverage[] = [
  {
    id: "mc-1",
    outlet: "TechCrunch India",
    title: "Jottosop's 3D E-commerce Platform Disrupts Traditional Online Shopping",
    date: "February 12, 2026",
    url: "#",
    logo: "/media/techcrunch.png"
  },
  {
    id: "mc-2",
    outlet: "YourStory",
    title: "How This Bengaluru Startup is Empowering 50+ Artists Through E-commerce",
    date: "January 18, 2026",
    url: "#",
    logo: "/media/yourstory.png"
  },
  {
    id: "mc-3",
    outlet: "Economic Times",
    title: "Udyam-Registered Jottosop Reports 50x Growth in Six Months",
    date: "January 22, 2026",
    url: "#",
    logo: "/media/et.png"
  },
  {
    id: "mc-4",
    outlet: "Inc42",
    title: "3D Customization: The Future of E-commerce Shopping Experience",
    date: "December 15, 2025",
    url: "#",
    logo: "/media/inc42.png"
  }
];

const mediaAssets = [
  {
    type: "Logo Package",
    description: "High-resolution logos in PNG, SVG, and AI formats",
    icon: ImageIcon,
    color: "bg-blue-600"
  },
  {
    type: "Brand Guidelines",
    description: "Complete brand identity and usage guidelines",
    icon: FileText,
    color: "bg-purple-600"
  },
  {
    type: "Product Screenshots",
    description: "High-quality screenshots of platform features",
    icon: ImageIcon,
    color: "bg-green-600"
  },
  {
    type: "Founder Photos",
    description: "Professional headshots and team photos",
    icon: Users,
    color: "bg-red-600"
  },
  {
    type: "Company Fact Sheet",
    description: "Key statistics, milestones, and information",
    icon: File,
    color: "bg-orange-600"
  },
  {
    type: "Demo Videos",
    description: "Product demonstration and feature videos",
    icon: Video,
    color: "bg-pink-600"
  }
];

export default function PressPage() {
  const [expandedRelease, setExpandedRelease] = useState<string | null>(null);

  const toggleRelease = (id: string) => {
    setExpandedRelease(expandedRelease === id ? null : id);
  };

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
            <div className="inline-flex items-center gap-2 bg-blue-600/20 px-4 py-2 rounded-full mb-6 border border-blue-600/30">
              <Newspaper className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-semibold">Media Center</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Press & Media
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Latest news, press releases, and media resources about Jottosop
            </p>
          </motion.div>
        </div>
        
        {/* Decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#e8ecf0]" 
          style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)" }}
        />
      </section>

      {/* Quick Stats */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, number: "1000+", label: "Customers", color: "text-blue-600" },
              { icon: Briefcase, number: "50+", label: "Sellers", color: "text-purple-600" },
              { icon: TrendingUp, number: "50x", label: "Growth", color: "text-green-600" },
              { icon: Award, number: "Udyam", label: "Registered", color: "text-red-600" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center shadow-xl"
              >
                <stat.icon className={`w-10 h-10 ${stat.color} mx-auto mb-3`} />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-gray-600 text-sm font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Press Releases
            </h2>
            <p className="text-gray-600 text-lg">
              Official announcements and company news
            </p>
          </motion.div>

          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                        {release.category}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {release.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                        <Calendar className="w-4 h-4" />
                        {release.date}
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {release.excerpt}
                      </p>
                    </div>
                  </div>

                  {expandedRelease === release.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-gray-200"
                    >
                      <p className="text-gray-700 leading-relaxed text-lg mb-6">
                        {release.content}
                      </p>
                    </motion.div>
                  )}

                  <div className="flex flex-wrap gap-3 mt-6">
                    <button
                      onClick={() => toggleRelease(release.id)}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                      {expandedRelease === release.id ? "Show Less" : "Read Full Release"}
                    </button>
                    <button className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              In the News
            </h2>
            <p className="text-gray-600 text-lg">
              Recent media coverage and mentions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mediaCoverage.map((coverage, index) => (
              <motion.a
                key={coverage.id}
                href={coverage.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {coverage.title}
                    </h3>
                    <p className="text-blue-600 font-semibold text-sm mb-1">
                      {coverage.outlet}
                    </p>
                    <p className="text-gray-600 text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {coverage.date}
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Media Assets */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Media Assets
            </h2>
            <p className="text-gray-600 text-lg">
              Download logos, photos, and brand materials
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaAssets.map((asset, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-6 shadow-xl cursor-pointer"
              >
                <div className={`${asset.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                  <asset.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{asset.type}</h3>
                <p className="text-gray-600 mb-4">{asset.description}</p>
                <button className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Mail className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Media Inquiries
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              For press inquiries, interview requests, or media partnerships
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6">
              <p className="text-lg mb-2">
                <strong>Email:</strong>{" "}
                <a href="mailto:operation@jottosop.in" className="underline hover:text-blue-200">
                  operation@jottosop.in
                </a>
              </p>
              <p className="text-lg">
                <strong>Subject Line:</strong> Media Inquiry - [Your Publication Name]
              </p>
            </div>
            <p className="text-blue-100 text-sm">
              We typically respond to media inquiries within 24-48 hours
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
