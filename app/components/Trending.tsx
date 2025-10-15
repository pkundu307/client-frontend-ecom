"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
        const res = await fetch("http://localhost:3001/banners");
        const data = await res.json();
        setBanners(data);
      } catch (err) {
        console.error("Failed to fetch banners:", err);
      }
    };
    fetchBanners();
  }, []);

  return (
    <div className="relative max-w-7xl mx-auto py-3 md:py-6 px-2 md:px-4 z-10">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={10}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 2500 }}
        pagination={{ clickable: true }}
        className="rounded-lg"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id} className="relative">
            <div
              onClick={() => router.push(banner.targetUrl)}
              className="cursor-pointer"
            >
              {/* Background Image */}
              <Image
                src={banner.bannerImageUrl}
                alt={banner.title}
                width={1200}
                height={500}
                className="w-full h-[200px] sm:h-[280px] md:h-[350px] lg:h-[400px] object-cover rounded-lg sepia-0 hover:sepia transition-all duration-500"
              />

              {/* Left Side Dark Gradient Overlay */}
              <div className="absolute left-0 top-0 h-full w-full sm:w-4/6 md:w-3/6 bg-gradient-to-r from-black/90 via-black/60 sm:via-black/40 to-transparent pointer-events-none z-10 rounded-l-lg"></div>

              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col sm:flex-row justify-start sm:justify-between items-start sm:items-center p-4 sm:px-8 md:px-12 z-20">
                <div className="flex flex-col justify-center space-y-2 sm:space-y-4 w-full sm:w-auto">
                  {/* Brand Logo on top of title */}
                  {banner.brandLogoUrl && (
                    <div className="bg-white p-2 sm:p-3 rounded-md shadow-lg w-fit mb-2">
                      <Image
                        src={banner.brandLogoUrl}
                        alt="Brand Logo"
                        width={60}
                        height={30}
                        className="sm:w-[80px] sm:h-[40px] md:w-[100px] md:h-[50px] object-contain"
                      />
                    </div>
                  )}

                  <div className="text-white">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
                      {banner.title}
                    </h2>
                    {banner.discountText && (
                      <p className="text-sm sm:text-lg md:text-xl font-semibold text-yellow-300 mb-2 sm:mb-0">
                        {banner.discountText}
                      </p>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent double navigation
                        router.push(banner.targetUrl);
                      }}
                      className="mt-2 sm:mt-4 px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-white text-gray-900 font-semibold rounded-md hover:bg-gray-100 transition-colors duration-300 text-sm sm:text-base"
                    >
                      + Explore
                    </button>
                  </div>
                </div>
                <div className="hidden sm:block flex-1"></div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
