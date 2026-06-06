// components/home/MyntraCarousel.tsx

"use client";

import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-creative";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, Zap } from "lucide-react";

interface Banner {
  id: number;
  title: string;
  discountText?: string;
  bannerImageUrl: string;
  brandLogoUrl?: string;
  targetUrl: string;
}

const SLIDE_DURATION = 5000;

export default function MyntraCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
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

  // Progress bar animation synced to slide duration
  useEffect(() => {
    setProgress(0);
    if (progressRef.current) clearInterval(progressRef.current);
    const step = 100 / (SLIDE_DURATION / 50);
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressRef.current!);
          return 100;
        }
        return p + step;
      });
    }, 50);
    return () => clearInterval(progressRef.current!);
  }, [activeIndex]);

  return (
    <section className="relative w-full bg-[#0a0a0b] overflow-hidden">
      {/* Subtle grid texture overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative w-full max-w-[1920px] mx-auto">
        <Swiper
          modules={[Autoplay, Pagination, EffectCreative]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          effect="creative"
          allowTouchMove={true}
          touchRatio={1}
          threshold={10}
          creativeEffect={{
            prev: { shadow: true, translate: ["-100%", 0, -400] },
            next: { translate: ["100%", 0, 0] },
          }}
          autoplay={{
            delay: SLIDE_DURATION,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="hero-swiper"
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={banner.id}>
              <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[2.5/1] lg:aspect-[3/1] overflow-hidden group">
                {/* Background Image */}
                <Image
                  src={banner.bannerImageUrl}
                  alt={banner.title}
                  fill
                  priority={index === 0}
                  className="object-cover scale-[1.04] group-hover:scale-100 transition-transform duration-[8000ms] ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px"
                />

                {/* Multi-layer cinematic gradient */}
             <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
<div className="absolute inset-0"
  style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.25) 100%)" }}
/>

                {/* Content */}
                <div className="absolute inset-0 flex items-center pointer-events-none">
                  <div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24">
                    <motion.div
                      key={`content-${banner.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="max-w-lg lg:max-w-2xl xl:max-w-3xl"
                    >
                      {/* Eyebrow label */}
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-4 md:mb-5 flex items-center gap-3"
                      >
                        <div className="h-[1px] w-8 bg-white/40" />
                        <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-white/60 uppercase">
                          Featured Collection
                        </span>
                      </motion.div>

                      {/* Brand Logo */}
                      {banner.brandLogoUrl && (
                        <motion.div
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                          className="mb-4 md:mb-6"
                        >
                        <div className="inline-flex bg-white/15 backdrop-blur-md rounded-xl px-3 py-2">
  <Image
    src={banner.brandLogoUrl}
    alt="Brand Logo"
    width={90}
    height={40}
    className="w-[55px] h-[24px] sm:w-[72px] sm:h-[32px] md:w-[90px] md:h-[40px] object-contain"
  />
</div>
                        </motion.div>
                      )}

                      {/* Title — editorial scale */}
                      <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="font-black text-white leading-[1.05] tracking-tight mb-4 md:mb-5"
                        style={{
                          fontSize: "clamp(1.75rem, 5vw, 4.5rem)",
                          textShadow: "0 4px 32px rgba(0,0,0,0.5)",
                        }}
                      >
                        {banner.title}
                      </motion.h1>

                      {/* Discount badge */}
                      {banner.discountText && (
                        <motion.div
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                          className="mb-6 md:mb-8"
                        >
                          <span className="inline-flex items-center gap-2 bg-amber-400 text-amber-950 px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-bold text-xs md:text-sm tracking-wide">
                            <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />
                            {banner.discountText}
                          </span>
                        </motion.div>
                      )}

                      {/* CTA */}
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="pointer-events-auto flex items-center gap-4"
                      >
                        <button
                          onClick={() => router.push(banner.targetUrl)}
                          className="group/btn relative inline-flex items-center gap-2.5 bg-white text-gray-950 font-bold text-sm md:text-base rounded-xl overflow-hidden transition-all duration-300 hover:pr-8"
                          style={{
                            padding: "clamp(0.6rem, 1.5vw, 0.875rem) clamp(1.25rem, 2.5vw, 2rem)",
                          }}
                        >
                          <span className="relative z-10">Explore Collection</span>
                          <ArrowUpRight className="relative z-10 w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                          {/* Shimmer on hover */}
                          <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                        </button>

                        {/* Ghost secondary */}
                        <button
                          onClick={() => router.push(banner.targetUrl)}
                          className="hidden sm:inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium transition-colors duration-200 group/ghost"
                        >
                          <span className="border-b border-white/30 group-hover/ghost:border-white/70 transition-colors duration-200 pb-0.5">
                            View all
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover/ghost:opacity-100 transition-opacity" />
                        </button>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>

                {/* Slide index badge — top right */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 pointer-events-none">
                  {/* <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                    <span className="text-white font-bold text-xs tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-white/30 text-xs">/</span>
                    <span className="text-white/50 text-xs tabular-nums">
                      {String(banners.length).padStart(2, "0")}
                    </span>
                  </div> */}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Bottom HUD — progress dots + timer bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
          {/* Timer progress bar */}
          <div className="h-[2px] bg-white/10">
            <motion.div
              key={`progress-${activeIndex}`}
              className="h-full bg-white/70"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.05, ease: "linear" }}
            />
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2 py-4 md:py-5">
            {banners.map((_, i) => (
              <div
                key={i}
                className={`transition-all duration-500 rounded-full ${
                  i === activeIndex
                    ? "w-6 md:w-8 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .hero-swiper {
          width: 100%;
        }
        .hero-swiper .swiper-pagination {
          display: none;
        }
      `}</style>
    </section>
  );
}