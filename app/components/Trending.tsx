// components/home/MyntraCarousel.tsx

"use client";

import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Banner {
  id: number;
  bannerImageUrl: string;
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

  // Progress bar synced to slide duration
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

  if (banners.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        slidesPerView={1}
        loop={true}
        allowTouchMove={true}
        touchRatio={1}
        threshold={5}
        autoplay={{
          delay: SLIDE_DURATION,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={banner.id}>
            <div
className="relative w-full aspect-[3/2] sm:aspect-[16/9] md:aspect-[2.5/1] lg:aspect-[3/1] overflow-hidden cursor-pointer"
              onClick={() => router.push(banner.targetUrl)}
            >
      <Image
  src={banner.bannerImageUrl}
  alt={`Promotional banner ${index + 1}`}
  fill
  priority={index === 0}
  className="object-cover object-left md:object-center"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px"
  draggable={false}
/>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Progress bar + dots — only shown when more than 1 banner */}
      {banners.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          {/* Thin progress bar */}
          <div className="h-[2px] w-full bg-white/15">
            <div
              className="h-full bg-white/60 transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2 py-3 md:py-4">
            {banners.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-500 ease-out ${
                  i === activeIndex
                    ? "w-5 md:w-7 h-1 bg-white"
                    : "w-1 h-1 bg-white/35"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}