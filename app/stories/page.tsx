"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Heart,
  Users,
  TrendingUp,
  Sparkles,
  Package,
  Clock,
  ArrowRight,
  Quote,
  Star,
  ShoppingBag,
 
} from "lucide-react";

interface Story {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  fullStory: string;
  author: string;
  date: string;
  image: string;
  stats?: {
    orders?: string;
    satisfaction?: string;
    growth?: string;
  };
  tags: string[];
  color: string;
}

const stories: Story[] = [
  {
    id: "customer-success-1",
    category: "Customer Success",
    title: "How 3D Customization Made My Gift Perfect",
    excerpt: "Priya from Mumbai shares how Jottosop's 3D preview helped her create the perfect personalized gift for her sister's birthday.",
    fullStory: "I was looking for a unique birthday gift for my sister, and stumbled upon Jottosop. The 3D customization feature was a game-changer! I could see exactly how the t-shirt would look with her name and favorite design before ordering. The ability to rotate and preview from all angles gave me confidence that it would be perfect. When it arrived, my sister was absolutely thrilled! The quality exceeded my expectations, and she loved how personal it was. Now I use Jottosop for all my gift needs. The customer service was also fantastic - they responded to my queries within hours. This is the future of online shopping!",
    author: "Priya Sharma",
    date: "February 10, 2026",
    image: "/stories/customer-gift.jpg",
    stats: {
      satisfaction: "100%",
      orders: "5+"
    },
    tags: ["Personalization", "Gifts", "3D Preview", "Customer Love"],
    color: "from-pink-600 to-rose-600"
  },
  {
    id: "business-growth-1",
    category: "Business Growth",
    title: "From 10 to 500+ Orders: A Seller's Journey",
    excerpt: "Rajesh's clothing brand scaled 50x in 6 months after partnering with Jottosop's platform.",
    fullStory: "When I started my custom t-shirt business, I was struggling to reach customers beyond my local area. Finding Jottosop was a turning point. Their platform made it incredibly easy to list my products with 3D customization options. What used to take me hours - sending mockups back and forth with customers - now happens instantly with their 3D preview tool. My first month, I got 10 orders. Six months later, I'm processing 500+ orders monthly! The Udyam registered platform gave my business credibility, and their payment gateway made transactions seamless. The seller dashboard is intuitive, and their support team helped me optimize my listings. My revenue has grown 50x, and I've been able to hire 3 employees. Jottosop didn't just give me a platform - they gave me a business model that scales.",
    author: "Rajesh Kumar",
    date: "January 28, 2026",
    image: "/stories/business-growth.jpg",
    stats: {
      orders: "500+/month",
      growth: "50x",
      satisfaction: "98%"
    },
    tags: ["Seller Success", "Business Growth", "Revenue", "Scaling"],
    color: "from-blue-600 to-indigo-600"
  },
  {
    id: "innovation-story-1",
    category: "Innovation",
    title: "The Technology Behind Your Perfect Product",
    excerpt: "Discover how Jottosop's 3D visualization technology is revolutionizing e-commerce experiences.",
    fullStory: "At Jottosop, we believe shopping should be an experience, not a gamble. That's why we invested heavily in cutting-edge 3D visualization technology. Our platform uses WebGL-based rendering to create photorealistic previews of products with your customizations in real-time. Unlike traditional e-commerce where you see static images, our 3D viewer lets you rotate, zoom, and inspect products from every angle. We've integrated advanced color management systems to ensure what you see on screen matches what arrives at your doorstep. Our rendering engine processes millions of polygons per second to maintain smooth, lag-free interaction even on mobile devices. The backend infrastructure scales automatically to handle traffic spikes, ensuring fast load times during peak hours. We're not just selling products - we're selling confidence. Our data shows that customers who use our 3D preview feature have 60% higher satisfaction rates and 40% fewer returns. This is e-commerce evolved.",
    author: "Jottosop Tech Team",
    date: "February 5, 2026",
    image: "/stories/innovation-tech.jpg",
    stats: {
      satisfaction: "60% Higher",
      orders: "1000+"
    },
    tags: ["Technology", "3D Visualization", "Innovation", "E-commerce"],
    color: "from-purple-600 to-violet-600"
  },
  {
    id: "community-impact-1",
    category: "Community Impact",
    title: "Supporting Local Artists Through E-commerce",
    excerpt: "How Jottosop is empowering independent artists to reach nationwide audiences.",
    fullStory: "We launched Jottosop with a mission beyond profits - to empower creative talent across India. Our platform has become home to over 50 independent artists and designers who were previously limited to local exhibitions. Artists like Meera from Jaipur, who creates traditional Rajasthani art, can now sell her designs on custom products to customers in Bengaluru, Delhi, and beyond. We provide them with tools to showcase their work in 3D, handle payments securely, and manage orders seamlessly. The impact has been transformative. Artists report earning 3-5x more than they did through traditional channels. We've also introduced an 'Artist of the Month' program that spotlights talented creators and boosts their visibility. Our revenue-sharing model ensures artists get fair compensation for their creativity. One artist used her earnings to open a small studio and hire two assistants. These stories fuel our passion. We're not just an e-commerce platform - we're a launchpad for dreams.",
    author: "Soumya Sadhukhan",
    date: "January 15, 2026",
    image: "/stories/community-artists.jpg",
    stats: {
      orders: "50+ Artists",
      growth: "3-5x Income"
    },
    tags: ["Community", "Artists", "Empowerment", "Social Impact"],
    color: "from-green-600 to-emerald-600"
  },
  {
    id: "customer-success-2",
    category: "Customer Success",
    title: "Corporate Gifting Made Easy",
    excerpt: "TechCorp Delhi ordered 200 customized products for their annual event through Jottosop.",
    fullStory: "As the HR head at TechCorp, I was tasked with sourcing corporate gifts for our 200 employees for our annual day celebration. Traditional vendors were giving me static mockups and asking for 50% advance without any guarantee of quality. Then I found Jottosop. Their 3D preview feature was perfect for our needs - I could customize t-shirts with our company logo, see exactly how they'd look, and get approval from leadership instantly by sharing the preview link. The bulk order process was smooth, and they assigned us a dedicated account manager. What impressed me most was the quality consistency - all 200 items looked exactly like the 3D preview. Delivery was on time, and the packaging was premium. Our employees loved the gifts! We've since ordered customized mugs and notebooks for client gifting. Jottosop has become our go-to partner for all corporate merchandise. Highly recommended for businesses!",
    author: "Anjali Mehta",
    date: "December 20, 2025",
    image: "/stories/corporate-gifting.jpg",
    stats: {
      orders: "200 Units",
      satisfaction: "100%"
    },
    tags: ["Corporate", "Bulk Orders", "B2B", "Client Success"],
    color: "from-orange-600 to-amber-600"
  },
  {
    id: "sustainability-story-1",
    category: "Sustainability",
    title: "Eco-Friendly Packaging & Responsible Business",
    excerpt: "Our commitment to sustainability: biodegradable packaging and carbon-neutral delivery options.",
    fullStory: "At Jottosop, innovation extends beyond technology to environmental responsibility. We've partnered with eco-friendly suppliers to ensure all our packaging is 100% biodegradable. Our product packaging uses recycled cardboard, and we've eliminated single-use plastics completely. We work with certified manufacturers who follow ethical labor practices and minimize waste in production. Our 3D preview technology itself contributes to sustainability by reducing returns - fewer returns mean less transportation emissions and waste. We've introduced carbon-neutral delivery options for conscious consumers, partnering with logistics providers who offset their carbon footprint. Our print-on-demand model means we only produce what's ordered, eliminating excess inventory and waste. We're also exploring partnerships with fabric recycling programs. As a Udyam registered MSME, we're committed to responsible growth. Our goal is to prove that profitability and sustainability can coexist. Every order you place with Jottosop is a vote for a greener future.",
    author: "Prasanna Kundu",
    date: "January 22, 2026",
    image: "/stories/sustainability.jpg",
    stats: {
      orders: "100% Biodegradable"
    },
    tags: ["Sustainability", "Environment", "Green Business", "Eco-Friendly"],
    color: "from-teal-600 to-cyan-600"
  }
];

const categories = ["All", "Customer Success", "Business Growth", "Innovation", "Community Impact", "Sustainability"];

export default function StoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedStory, setExpandedStory] = useState<string | null>(null);

  const filteredStories = stories.filter(
    story => selectedCategory === "All" || story.category === selectedCategory
  );

  const toggleStory = (storyId: string) => {
    setExpandedStory(expandedStory === storyId ? null : storyId);
  };

  return (
    <div className="min-h-screen bg-[#e8ecf0]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-pink-600 to-purple-600 text-white py-20 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6 border border-white/30 backdrop-blur-sm">
              <Heart className="w-5 h-5" />
              <span className="font-semibold">Stories That Inspire</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Jotto Stories
            </h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto leading-relaxed">
              Real experiences from customers, sellers, and partners who are shaping the future of e-commerce with us
            </p>
          </motion.div>
        </div>
        
        {/* Decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#e8ecf0]" 
          style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)" }}
        />
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, number: "1000+", label: "Happy Customers", color: "text-blue-600" },
              { icon: Package, number: "50+", label: "Active Sellers", color: "text-purple-600" },
              { icon: TrendingUp, number: "50x", label: "Average Growth", color: "text-green-600" },
              { icon: Star, number: "4.8/5", label: "Customer Rating", color: "text-yellow-600" }
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

      {/* Category Filter */}
      <section className="py-8 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl whitespace-nowrap font-semibold transition-all flex-shrink-0 ${
                  selectedCategory === category
                    ? "bg-red-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-8">
            {filteredStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-2xl"
              >
                {/* Story Header */}
                <div className={`bg-gradient-to-r ${story.color} p-6 md:p-8 text-white`}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                        {story.category}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-bold mb-2">{story.title}</h2>
                      <p className="text-white/90 text-sm md:text-base">{story.excerpt}</p>
                    </div>
                    <Quote className="w-12 h-12 opacity-30 flex-shrink-0" />
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {story.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {story.author}
                    </div>
                  </div>

                  {/* Stats */}
                  {story.stats && (
                    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/20">
                      {story.stats.orders && (
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-5 h-5" />
                          <span className="font-semibold">{story.stats.orders} Orders</span>
                        </div>
                      )}
                      {story.stats.satisfaction && (
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5" />
                          <span className="font-semibold">{story.stats.satisfaction} Satisfaction</span>
                        </div>
                      )}
                      {story.stats.growth && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          <span className="font-semibold">{story.stats.growth} Growth</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Story Content Preview */}
                <div className="p-6 md:p-8">
                  <AnimatePresence>
                    {expandedStory === story.id ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        <p className="text-gray-700 leading-relaxed text-lg">
                          {story.fullStory}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 pt-4">
                          {story.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <button
                    onClick={() => toggleStory(story.id)}
                    className="mt-6 inline-flex items-center gap-2 text-red-600 font-bold hover:gap-3 transition-all"
                  >
                    {expandedStory === story.id ? "Show Less" : "Read Full Story"}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Share Your Story CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Got a Story to Share?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              We&apos;d love to hear about your experience with Jottosop. Your story could inspire thousands!
            </p>
            <Link
              href="mailto:operation@jottosop.in?subject=My Jottosop Story"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
            >
              Share Your Story
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
