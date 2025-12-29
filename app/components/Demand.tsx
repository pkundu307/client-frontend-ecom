"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  AlertTriangle,
  ImageOff,
} from "lucide-react";
import { baseUrl } from "../utilities/baseUrl";
import RecentlyViewed from "./RecentlyViewed";

// --- CONFIG ---
const BASE_URL = `${baseUrl}`;

// --- DESIGN CONSTANTS ---
const NEUMORPHIC_BG = "#e8ecf0";
const SHADOW_OUTSET = "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff";
const SHADOW_INSET = "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff";

// --- TYPES ---
type SectionTypeEnum =
  | "HERO_SLIDER"
  | "PRODUCT_CAROUSEL"
  | "GRID_2XN"
  | "GRID_3XN"
  | "GRID_SQUARE_COMPACT"
  | "SINGLE_BANNER"
  | "SCROLLABLE_ROW";

type LinkTypeEnum =
  | "NONE"
  | "CATEGORY"
  | "PRODUCT"
  | "BRAND"
  | "SEARCH"
  | "EXTERNAL_URL";

interface StyleConfig {
  // Layout
  backgroundColor?: string;
  borderRadius?: number | string;
  borderColor?: string;
  padding?: string;

  // Typography
  titleColor?: string;
  subtitleColor?: string;
  titleAlign?: "left" | "center" | "right";

  // Visuals
  overlayGradient?: string;
  objectFit?: "cover" | "contain";

  // Slider Config
  autoplay?: boolean;
  autoplaySpeed?: number;
  showDots?: boolean;
  itemsToShow?: number;
  showArrows?: boolean;

  // Branding
  brandLogos?: string[];
}

interface HomepageItem {
  id: number;
  title: string | null;
  subtitle: string | null;
  imageUrl: string | null;
  linkType: LinkTypeEnum;
  linkValue: string | null;
  styleConfig: StyleConfig | null;
}

interface HomepageSection {
  id: number;
  title: string | null;
  subtitle: string | null;
  type: SectionTypeEnum;
  styleConfig: StyleConfig | null;
  items: HomepageItem[];
}

// --- UTILS ---
const generateLink = (item: HomepageItem): string => {
  if (item.linkType === "NONE" || !item.linkValue) return "#";

  switch (item.linkType) {
    case "CATEGORY":
      return `/category/${item.linkValue}`;
    case "PRODUCT":
      return `/product/${item.linkValue}`;
    case "BRAND":
      return `/brand/${item.linkValue}`;
    case "SEARCH":
      return `/search?q=${encodeURIComponent(item.linkValue)}`;
    case "EXTERNAL_URL":
      return item.linkValue;
    default:
      return "#";
  }
};

const getBorderRadius = (val?: number | string): string => {
  if (!val) return "20px"; // Default slightly rounder for Neumorphism
  return typeof val === "number" ? `${val}px` : val;
};

// --- COMPONENT: ITEM CARD (Neumorphic Style) ---
const ItemCard = ({
  item,
  className = "",
  aspectRatio = "aspect-[4/3]",
}: {
  item: HomepageItem;
  className?: string;
  aspectRatio?: string;
}) => {
  const href = generateLink(item);
  const isExternal = item.linkType === "EXTERNAL_URL";

  // Robust Defaults
  // Default to the Neumorphic base color unless overridden
  const bgColor = item.styleConfig?.backgroundColor || NEUMORPHIC_BG; 
  const radius = getBorderRadius(item.styleConfig?.borderRadius);
  const titleColor = item.styleConfig?.titleColor || "#1f2937";
  const subtitleColor = item.styleConfig?.subtitleColor || "#6b7280";
  const padding = item.styleConfig?.padding || "1rem";
  const overlay = item.styleConfig?.overlayGradient;
  const logos = item.styleConfig?.brandLogos;

  const CardContent = (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      // Neumorphic Styling: No Border, Specific Shadow
      className={`group relative flex flex-col w-full h-full overflow-hidden ${className}`}
      style={{
        backgroundColor: bgColor,
        borderRadius: radius,
        boxShadow: SHADOW_OUTSET, // The "Pop Up" Effect
      }}
    >
      {/* 1. Image Area - Fixed Aspect Ratio */}
      {/* Added a small margin/padding inside so the image doesn't break the soft corners */}
      <div className="p-2 pb-0">
        <div
          className={`relative w-full ${aspectRatio} overflow-hidden shrink-0 rounded-xl`}
          style={{ boxShadow: "inset 2px 2px 5px rgba(0,0,0,0.05)" }} // Slight inset for image depth
        >
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title || "Item Image"}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200/50 text-gray-400">
              <ImageOff className="h-8 w-8 opacity-50" />
            </div>
          )}

          {/* Optional Overlay */}
          {overlay && (
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{ background: overlay }}
            />
          )}
        </div>
      </div>

      {/* 2. Text Content & Footer */}
      <div className="flex flex-col flex-1" style={{ padding: padding }}>
        {/* Text Area */}
        <div className="mb-2">
          {item.title && (
            <h3
              className="text-base sm:text-lg font-bold leading-tight line-clamp-2"
              style={{ color: titleColor }}
            >
              {item.title}
            </h3>
          )}

          {item.subtitle && (
            <p
              className="mt-1 text-xs sm:text-sm leading-relaxed line-clamp-2 font-medium"
              style={{ color: subtitleColor }}
            >
              {item.subtitle}
            </p>
          )}
        </div>

        {/* Footer Area */}
        <div className="mt-auto pt-2">
          {logos && Array.isArray(logos) && logos.length > 0 ? (
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-gray-200/50">
              {logos.map((logoUrl, index) => (
                <div
                  key={index}
                  className="relative h-5 w-12 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all"
                >
                  <Image
                    src={logoUrl}
                    alt="Brand"
                    fill
                    className="object-contain object-left"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="min-h-[4px]" />
          )}
        </div>
      </div>
    </motion.div>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full w-full"
      >
        {CardContent}
      </a>
    );
  }

  return (
    <Link href={href} className="block h-full w-full">
      {CardContent}
    </Link>
  );
};

// --- SECTIONS ---

const HeroSlider = ({ section }: { section: HomepageSection }) => (
  <div className="w-full">
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      pagination={{ clickable: true, dynamicBullets: true }}
      loop={section.items.length > 1}
      autoplay={
        section.styleConfig?.autoplay
          ? {
              delay: section.styleConfig?.autoplaySpeed || 5000,
              disableOnInteraction: false,
            }
          : false
      }
      className="w-full rounded-3xl"
      // The slider container itself gets the Pop-up shadow
      style={{ boxShadow: SHADOW_OUTSET }}
    >
      {section.items.map((item) => (
        <SwiperSlide key={item.id} className="h-auto! flex!">
          <div className="w-full h-full relative">
             {/* Hero usually fills the whole space, so we simplify the card logic slightly */}
             <ItemCard 
                item={item} 
                aspectRatio="aspect-[21/9] xs:aspect-[16/9]" 
                className="shadow-none! rounded-none!" // Reset shadow inside the slider wrapper
             />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
);

const ProductCarousel = ({ section }: { section: HomepageSection }) => {
  const itemsToShow = section.styleConfig?.itemsToShow || 4;

  return (
    <div className="relative w-full group/carousel">
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        // Increased padding bottom to allow space for the shadows
        className="pb-8! items-stretch px-2!"
        breakpoints={{
          0: { slidesPerView: 1.2, spaceBetween: 16 },
          480: { slidesPerView: 1.8, spaceBetween: 18 },
          640: { slidesPerView: 2.2, spaceBetween: 20 },
          768: { slidesPerView: 3.2, spaceBetween: 24 },
          1024: { slidesPerView: itemsToShow, spaceBetween: 28 },
        }}
        navigation={{
          nextEl: `.next-${section.id}`,
          prevEl: `.prev-${section.id}`,
        }}
      >
        {section.items.map((item) => (
          <SwiperSlide key={item.id} className="!h-auto !flex !flex-col py-2">
            <ItemCard item={item} aspectRatio="aspect-[4/3]" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Neumorphic Navigation Buttons */}
      {section.styleConfig?.showArrows !== false && (
        <>
          <button
            className={`prev-${section.id} absolute left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center text-gray-700 opacity-0 group-hover/carousel:opacity-100 transition-all disabled:opacity-0 -ml-5 lg:-ml-6`}
            style={{ 
                backgroundColor: NEUMORPHIC_BG,
                boxShadow: SHADOW_OUTSET 
            }}
            aria-label="Previous"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            className={`next-${section.id} absolute right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center text-gray-700 opacity-0 group-hover/carousel:opacity-100 transition-all disabled:opacity-0 -mr-5 lg:-mr-6`}
            style={{ 
                backgroundColor: NEUMORPHIC_BG,
                boxShadow: SHADOW_OUTSET 
            }}
            aria-label="Next"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
};

const Grid2xn = ({ section }: { section: HomepageSection }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 w-full items-stretch">
    {section.items.map((item, index) => (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className="h-full"
      >
        <ItemCard item={item} aspectRatio="aspect-[16/9]" />
      </motion.div>
    ))}
  </div>
);

const GridSquareCompact = ({ section }: { section: HomepageSection }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full items-stretch">
    {section.items.map((item, index) => (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className="h-full"
      >
        <ItemCard item={item} aspectRatio="aspect-square" />
      </motion.div>
    ))}
  </div>
);

const SingleBanner = ({ section }: { section: HomepageSection }) =>
  section.items[0] ? (
    <div className="w-full">
      <ItemCard
        item={section.items[0]}
        aspectRatio="aspect-[3/1] xs:aspect-[4/1]"
      />
    </div>
  ) : null;

// --- MAIN LAYOUT ---

const HomePageLayout = () => {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const fetchHomepageData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/homepage`);
        setSections(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load content.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomepageData();
  }, []);

  const renderSection = (section: HomepageSection) => {
    if (
      !hasMounted &&
      ["HERO_SLIDER", "PRODUCT_CAROUSEL"].includes(section.type)
    ) {
      return (
        <div 
            className="w-full h-64 rounded-3xl animate-pulse" 
            style={{ 
                backgroundColor: NEUMORPHIC_BG, 
                boxShadow: SHADOW_INSET 
            }} 
        />
      );
    }

    if (!section.items || section.items.length === 0) return null;

    switch (section.type) {
      case "HERO_SLIDER":
        return <HeroSlider section={section} />;
      case "PRODUCT_CAROUSEL":
      case "SCROLLABLE_ROW":
        return <ProductCarousel section={section} />;
      case "GRID_2XN":
        return <Grid2xn section={section} />;
      case "GRID_3XN":
        return <GridSquareCompact section={section} />;
      case "GRID_SQUARE_COMPACT":
        return <GridSquareCompact section={section} />;
      case "SINGLE_BANNER":
        return <SingleBanner section={section} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      // Matches the background
      <div className="min-h-[50vh] w-full flex justify-center items-center bg-[#e8ecf0]">
        <LoaderCircle className="w-10 h-10 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] w-full flex flex-col justify-center items-center text-red-500 bg-[#e8ecf0]">
        <AlertTriangle className="w-12 h-12 mb-3" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    // Global Background Change
    <div className="min-h-screen w-full bg-[#e8ecf0]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {sections.map((section) => {
          if (section.type.startsWith("GRID") && section.items.length === 0)
            return null;

          // If a section has a specific background color, we use the "Inset" (engraved) shadow
          // to make it look like a depressed container holding the content.
          const hasCustomBg = section.styleConfig?.backgroundColor && section.styleConfig.backgroundColor !== "transparent";
          const padding = section.styleConfig?.padding || "0px";
          const radius = getBorderRadius(section.styleConfig?.borderRadius);

          return (
            <section
              key={section.id}
              className="w-full transition-all"
              style={{
                backgroundColor: hasCustomBg ? section.styleConfig?.backgroundColor : "transparent",
                padding: hasCustomBg ? (padding === "0px" ? "24px" : padding) : padding,
                borderRadius: radius,
                boxShadow: hasCustomBg ? SHADOW_INSET : "none", // Engraved effect for colored sections
              }}
            >
              {section.title && (
                <div
                  className={`mb-8 ${
                    section.styleConfig?.titleAlign === "left"
                      ? "text-left"
                      : section.styleConfig?.titleAlign === "right"
                      ? "text-right"
                      : "text-center"
                  }`}
                >
                  <h2
                    className="text-2xl sm:text-3xl font-bold tracking-tight"
                    style={{
                      color: section.styleConfig?.titleColor || "#1f2937",
                    }}
                  >
                    {section.title}
                  </h2>
                  {section.subtitle && (
                    <p
                      className="mt-2 text-sm font-medium"
                      style={{
                        color: section.styleConfig?.subtitleColor || "#6b7280",
                      }}
                    >
                      {section.subtitle}
                    </p>
                  )}
                </div>
              )}

              {renderSection(section)}
            </section>
          );
        })}
      </div>
      <RecentlyViewed/>
    </div>
  );
};

export default HomePageLayout;