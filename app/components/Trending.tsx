"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    id: 1,
    image: "https://www.shutterstock.com/image-vector/modern-colored-sneaker-3d-realistic-260nw-2388803243.jpg",
    brandLogo: "/logos/haute-sauce.png",
    title: "HANDBAGS",
    discount: "50-70% Off",
  },
  {
    id: 2,
    image:
      "https://i.ytimg.com/vi/-bX6syli2Sc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAQoZ7poxHqbTa7Ii7a-6frhatBNQ",
    brandLogo:
      "https://thumbs.dreamstime.com/b/nike-inc-american-multinational-corporation-engaged-design-development-manufacturing-worldwide-marketing-139136474.jpg",
    title: "SNEAKERS",
    discount: "Up to 50% Off",
  },
  {
    id: 3,
    image: "https://antoniobadillo.wordpress.com/wp-content/uploads/2012/04/nike-poster.jpg",
    brandLogo: "/logos/fossil.png",
    title: "WATCHES",
    discount: "Flat 30% Off",
  },
];

export default function MyntraCarousel() {
  return (
    <div className="relative max-w-7xl mx-auto py-3 md:py-6 px-2 md:px-4 z-10">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={10}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 2500 }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        className="rounded-lg"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id} className="relative">
            {/* Background Image - Responsive height */}
            <Image
              src={banner.image}
              alt={banner.title}
              width={1200}
              height={500}
              className="w-full h-[200px] sm:h-[280px] md:h-[350px] lg:h-[400px] object-cover rounded-lg sepia-0 hover:sepia transition-all duration-500"
            />
            
            {/* Left Side Dark Gradient Overlay - Responsive width */}
            <div className="absolute left-0 top-0 h-full w-full sm:w-4/6 md:w-3/6 bg-gradient-to-r from-black/90 via-black/60 sm:via-black/40 to-transparent pointer-events-none z-10 rounded-l-lg"></div>

            {/* Overlay Content - Responsive layout */}
            <div className="absolute inset-0 flex flex-col sm:flex-row justify-start sm:justify-between items-start sm:items-center p-4 sm:px-8 md:px-12 z-20">
              {/* Left Side Content - Brand Info */}
              <div className="flex flex-col justify-center space-y-2 sm:space-y-4 w-full sm:w-auto">
                {/* Brand Logo - Responsive positioning and size */}
                <div className="bg-white p-2 sm:p-3 rounded-md shadow-lg w-fit">
                  <Image
                    src={banner.brandLogo}
                    alt="Brand Logo"
                    width={60}
                    height={30}
                    className="sm:w-[80px] sm:h-[40px] md:w-[100px] md:h-[50px] object-contain"
                  />
                </div>

                {/* Title and Discount - Responsive text sizes */}
                <div className="text-white">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
                    {banner.title}
                  </h2>
                  <p className="text-sm sm:text-lg md:text-xl font-semibold text-yellow-300 mb-2 sm:mb-0">
                    {banner.discount}
                  </p>
                  <button className="mt-2 sm:mt-4 px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-white text-gray-900 font-semibold rounded-md hover:bg-gray-100 transition-colors duration-300 text-sm sm:text-base">
                    + Explore
                  </button>
                </div>
              </div>

              {/* Right side spacer for larger screens */}
              <div className="hidden sm:block flex-1"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons - Responsive positioning and size */}
      <button className="absolute z-20 left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-white shadow-md p-1.5 sm:p-2 rounded-full hover:bg-gray-200 transition swiper-button-prev">
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" />
      </button>

      <button className="absolute z-20 right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-white shadow-md p-1.5 sm:p-2 rounded-full hover:bg-gray-200 transition swiper-button-next">
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" />
      </button>
    </div>
  );
}