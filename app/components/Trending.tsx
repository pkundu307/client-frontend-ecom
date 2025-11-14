"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface Banner {
  id: number;
  title: string;
  discountText?: string;
  bannerImageUrl: string;
  brandLogoUrl?: string;
  targetUrl: string;
}

export default function MyntraCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners`);
        const data = await res.json();
        setBanners(data);
      } catch (err) {
        console.error("Failed to fetch banners:", err);
      }
    };
    fetchBanners();
  }, []);

  return (
    <div className="relative w-full bg-[#e8ecf0] pt-6 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div 
          className="rounded-3xl overflow-hidden"
          style={{
            boxShadow: '20px 20px 40px #c5cdd5, -20px -20px 40px #ffffff'
          }}
        >
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            effect="fade"
            autoplay={{ 
              delay: 4000,
              disableOnInteraction: false 
            }}
            pagination={{ 
              clickable: true,
              bulletActiveClass: "swiper-pagination-bullet-active",
              bulletClass: "swiper-pagination-bullet"
            }}
className="hero-carousel"
style={
  {
    ["--swiper-pagination-color"]: "#667eea",
    ["--swiper-pagination-bullet-inactive-color"]: "#999",
    ["--swiper-pagination-bullet-inactive-opacity"]: "0.5",
    ["--swiper-pagination-bullet-size"]: "10px",
    ["--swiper-pagination-bullet-horizontal-gap"]: "6px",
  } as React.CSSProperties
}
          >
            {banners.map((banner, index) => (
              <SwiperSlide key={banner.id}>
                <div
                  onClick={() => router.push(banner.targetUrl)}
                  className="relative cursor-pointer group"
                >
                  {/* Background Image - Reduced Height */}
                  <div className="relative h-[280px] sm:h-[350px] md:h-[420px] lg:h-[400px] overflow-hidden">
                    <Image
                      src={banner.bannerImageUrl}
                      alt={banner.title}
                      fill
                      priority={index === 0}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="max-w-2xl"
                      >
                        {/* Brand Logo */}
                        {banner.brandLogoUrl && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mb-4"
                          >
                            <div 
                              className="inline-block bg-white/95 backdrop-blur-xl p-2.5 md:p-3 rounded-2xl"
                              style={{
                                boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
                              }}
                            >
                              <Image
                                src={banner.brandLogoUrl}
                                alt="Brand Logo"
                                width={100}
                                height={50}
                                className="w-[70px] h-[35px] md:w-[100px] md:h-[50px] object-contain"
                              />
                            </div>
                          </motion.div>
                        )}

                        {/* Title */}
                        <motion.h1
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 leading-tight"
                        >
                          {banner.title}
                        </motion.h1>

                        {/* Discount Text */}
                        {banner.discountText && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="mb-4"
                          >
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1.5 rounded-full">
                              <Sparkles className="w-4 h-4 text-white" />
                              <span className="text-white font-bold text-base md:text-lg">
                                {banner.discountText}
                              </span>
                            </div>
                          </motion.div>
                        )}

                        {/* CTA Button */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          <motion.button
                            whileHover={{ scale: 1.05, x: 5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(banner.targetUrl);
                            }}
                            className="group/btn inline-flex items-center gap-2.5 bg-white text-gray-900 px-6 py-3 rounded-2xl font-bold text-base transition-all duration-300 hover:bg-gray-100"
                            style={{
                              boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                            }}
                          >
                            Explore Collection
                            <motion.div
                              animate={{ x: [0, 5, 0] }}
                              transition={{ 
                                duration: 1.5, 
                                repeat: Infinity,
                                ease: "easeInOut" 
                              }}
                            >
                              <ArrowRight className="w-5 h-5" />
                            </motion.div>
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Custom Swiper Pagination Styles */}
      <style jsx global>{`
        .hero-carousel .swiper-pagination {
          bottom: 20px !important;
        }
        .hero-carousel .swiper-pagination-bullet {
          transition: all 0.3s ease;
        }
        .hero-carousel .swiper-pagination-bullet-active {
          transform: scale(1.3);
        }
      `}</style>
    </div>
  );
}
