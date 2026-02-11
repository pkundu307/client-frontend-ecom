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
const SHADOW_OUTSET = "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff";
const SHADOW_INSET = "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff";

// --- PALETTES (expanded to 8 options) ---
const SECTION_PALETTES: Record<
  "neutral" | "sunset" | "ocean" | "forest" | "lavender" | "coral" | "slate" | "amber",
  { background: string; title: string; subtitle: string }
> = {
  neutral: {
    background: "#f8fafc",
    title: "#1e293b",
    subtitle: "#64748b",
  },
  sunset: {
    background: "#fef3c7",
    title: "#b91c1c",
    subtitle: "#dc2626",
  },
  ocean: {
    background: "#eff6ff",
    title: "#1e40af",
    subtitle: "#3b82f6",
  },
  forest: {
    background: "#f0fdf4",
    title: "#166534",
    subtitle: "#22c55e",
  },
  lavender: {
    background: "#f5f3ff",
    title: "#6b21a8",
    subtitle: "#9333ea",
  },
  coral: {
    background: "#fff1f2",
    title: "#be123c",
    subtitle: "#fb7185",
  },
  slate: {
    background: "#f1f5f9",
    title: "#0f172a",
    subtitle: "#475569",
  },
  amber: {
    background: "#fffbeb",
    title: "#92400e",
    subtitle: "#f59e0b",
  },
};

// --- ITEM THEMES (expanded to 6 options) ---
const ITEM_THEMES: Record<
  "soft" | "bold" | "blue" | "green" | "purple" | "orange",
  { background: string; title: string; subtitle: string; border: string }
> = {
  soft: {
    background: "#ffffff",
    title: "#111827",
    subtitle: "#6b7280",
    border: "1px solid #e5e7eb",
  },
  bold: {
    background: "#111827",
    title: "#ffffff",
    subtitle: "#d1d5db",
    border: "1px solid #374151",
  },
  blue: {
    background: "#eff6ff",
    title: "#1e3a8a",
    subtitle: "#3b82f6",
    border: "1px solid #bfdbfe",
  },
  green: {
    background: "#f0fdf4",
    title: "#14532d",
    subtitle: "#22c55e",
    border: "1px solid #bbf7d0",
  },
  purple: {
    background: "#faf5ff",
    title: "#581c87",
    subtitle: "#a855f7",
    border: "1px solid #e9d5ff",
  },
  orange: {
    background: "#fff7ed",
    title: "#9a3412",
    subtitle: "#f97316",
    border: "1px solid #fed7aa",
  },
};

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
  // New system
  palette?: keyof typeof SECTION_PALETTES;
  itemTheme?: keyof typeof ITEM_THEMES;
  brandLogos?: string[];
  // Legacy fallback
  backgroundColor?: string;
  borderRadius?: number | string;
  borderColor?: string;
  padding?: string;
  titleColor?: string;
  subtitleColor?: string;
  titleAlign?: "left" | "center" | "right";
  overlayGradient?: string;
  autoplay?: boolean;
  autoplaySpeed?: number;
  itemsToShow?: number;
  showArrows?: boolean;
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
    case "PRODUCT":
    case "BRAND":
      return `${item.linkValue}`;
    case "SEARCH":
      return `/search?q=${encodeURIComponent(item.linkValue || "")}`;
    case "EXTERNAL_URL":
      return item.linkValue;
    default:
      return "#";
  }
};

const getBorderRadius = (val?: number | string): string => {
  if (!val) return "20px";
  return typeof val === "number" ? `${val}px` : val;
};

// Resolve section colors (palette OR legacy fallback)
const resolveSectionStyle = (section: HomepageSection) => {
  const paletteKey = section.styleConfig?.palette as keyof typeof SECTION_PALETTES;
  
  if (paletteKey && SECTION_PALETTES[paletteKey]) {
    return {
      bg: SECTION_PALETTES[paletteKey].background,
      titleColor: SECTION_PALETTES[paletteKey].title,
      subtitleColor: SECTION_PALETTES[paletteKey].subtitle,
    };
  }

  // LEGACY FALLBACK
  return {
    bg: section.styleConfig?.backgroundColor || "transparent",
    titleColor: section.styleConfig?.titleColor || "#1e293b",
    subtitleColor: section.styleConfig?.subtitleColor || "#64748b",
  };
};

// Resolve item theme (new OR legacy fallback)
const resolveItemTheme = (item: HomepageItem) => {
  const themeKey = item.styleConfig?.itemTheme as keyof typeof ITEM_THEMES;
  if (themeKey && ITEM_THEMES[themeKey]) {
    return ITEM_THEMES[themeKey];
  }

  // LEGACY FALLBACK
  return {
    background: item.styleConfig?.backgroundColor || "#ffffff",
    title: item.styleConfig?.titleColor || "#111827",
    subtitle: item.styleConfig?.subtitleColor || "#6b7280",
    border: "1px solid #e5e7eb",
  };
};

// --- ITEM CARD ---
const ItemCard = ({
  item,
  className = "",
}: {
  item: HomepageItem;
  className?: string;
}) => {
  const href = generateLink(item);
  const isExternal = item.linkType === "EXTERNAL_URL";

  // Resolve theme with fallback
  const theme = resolveItemTheme(item);
  const radius = getBorderRadius(item.styleConfig?.borderRadius);
  const overlay = item.styleConfig?.overlayGradient;
  const logos = item.styleConfig?.brandLogos || [];

  const CardContent = (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`group relative flex flex-col w-full h-full overflow-hidden p-4 ${className}`}
      style={{
        backgroundColor: theme.background,
        color: theme.title,
        border: theme.border,
        borderRadius: radius,
        boxShadow: SHADOW_OUTSET,
      }}
    >
      {/* Image */}
      <div 
        className="relative w-full aspect-video rounded-lg overflow-hidden mb-3 flex-shrink-0"
        style={{ 
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title || "Item"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div 
            className="flex h-full items-center justify-center relative"
            style={{
              background: `linear-gradient(135deg, ${theme.background}11 0%, ${theme.background}44 50%, ${theme.background}22 100%)`,
            }}
          >
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: "radial-gradient(circle at 25% 25%, currentColor 1px, transparent 0), radial-gradient(circle at 75% 75%, currentColor 1px, transparent 0)",
                backgroundSize: "30px 30px"
              }}
            />
            
            <div className="relative z-10 text-center px-4">
              <ImageOff className="h-12 w-12 mx-auto mb-2 opacity-30" style={{color: theme.subtitle}} />
              <p className="text-xs font-medium opacity-50" style={{color: theme.subtitle}}>
                Image coming soon
              </p>
            </div>
          </div>
        )}
        {overlay && (
          <div
            className="absolute inset-0 opacity-60"
            style={{ background: overlay }}
          />
        )}
      </div>

      {/* Content */}
      <div className="space-y-1 flex-1">
        {item.title && (
          <h3
            className="font-bold text-base leading-tight line-clamp-2"
            style={{ color: theme.title }}
          >
            {item.title}
          </h3>
        )}
        {item.subtitle && (
          <p
            className="text-sm font-medium line-clamp-2"
            style={{ color: theme.subtitle }}
          >
            {item.subtitle}
          </p>
        )}
      </div>

      {/* Logos Footer */}
      {logos.length > 0 && (
        <div 
          className="flex items-center gap-1.5 pt-3 mt-auto border-t"
          style={{ borderColor: theme.subtitle + "30" }}
        >
          {logos.slice(0, 3).map((logo, i) => (
            <div
              key={i}
              className="relative h-5 w-10 flex-shrink-0 opacity-70 hover:opacity-100 transition-all"
            >
              <Image 
                src={logo} 
                alt="Brand" 
                fill 
                className="object-contain object-left" 
              />
            </div>
          ))}
          {logos.length > 3 && (
            <span className="text-xs opacity-50" style={{color: theme.subtitle}}>
              +{logos.length - 3}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );

  return isExternal ? (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block h-full w-full"
    >
      {CardContent}
    </a>
  ) : (
    <Link href={href} className="block h-full w-full">
      {CardContent}
    </Link>
  );
};

// --- SECTIONS ---
const HeroSlider = ({ section }: { section: HomepageSection }) => (
  <div className="w-full">
    <Swiper
      modules={[Autoplay, Pagination]}
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
      className="w-full h-[350px] md:h-[450px] rounded-3xl"
      style={{ boxShadow: SHADOW_OUTSET }}
    >
      {section.items.map((item) => (
        <SwiperSlide key={item.id} className="!h-full">
          <ItemCard 
            item={item}
            className="!h-full !rounded-none !shadow-none !border-none" 
          />
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
        className="pb-8 items-stretch"
        breakpoints={{
          0: { slidesPerView: 1.2, spaceBetween: 12 },
          480: { slidesPerView: 1.8, spaceBetween: 16 },
          768: { slidesPerView: 2.5, spaceBetween: 20 },
          1024: { slidesPerView: itemsToShow, spaceBetween: 24 },
        }}
        navigation={{
          nextEl: `.next-${section.id}`,
          prevEl: `.prev-${section.id}`,
        }}
      >
        {section.items.map((item) => (
          <SwiperSlide key={item.id} className="!h-auto !flex !flex-col">
            <ItemCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>

      {section.styleConfig?.showArrows !== false && (
        <>
          <button
            className={`prev-${section.id} absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center text-gray-700 opacity-0 group-hover/carousel:opacity-100 transition-all bg-white shadow-lg hover:shadow-xl`}
            aria-label="Previous"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            className={`next-${section.id} absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center text-gray-700 opacity-0 group-hover/carousel:opacity-100 transition-all bg-white shadow-lg hover:shadow-xl`}
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
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 w-full items-stretch">
    {section.items.map((item, index) => (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="h-full"
      >
        <ItemCard item={item} />
      </motion.div>
    ))}
  </div>
);

const GridSquareCompact = ({ section }: { section: HomepageSection }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 w-full items-stretch">
    {section.items.map((item, index) => (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className="h-full"
      >
        <ItemCard item={item} />
      </motion.div>
    ))}
  </div>
);

const SingleBanner = ({ section }: { section: HomepageSection }) =>
  section.items[0] ? (
    <div className="w-full">
      <ItemCard item={section.items[0]} />
    </div>
  ) : null;

const renderSection = (section: HomepageSection) => {
  switch (section.type) {
    case "HERO_SLIDER":
      return <HeroSlider section={section} />;
    case "PRODUCT_CAROUSEL":
    case "SCROLLABLE_ROW":
      return <ProductCarousel section={section} />;
    case "GRID_2XN":
      return <Grid2xn section={section} />;
    case "GRID_3XN":
    case "GRID_SQUARE_COMPACT":
      return <GridSquareCompact section={section} />;
    case "SINGLE_BANNER":
      return <SingleBanner section={section} />;
    default:
      return null;
  }
};

// --- MAIN LAYOUT ---
const HomePageLayout = () => {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/homepage`);
        setSections(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load homepage content.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomepageData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-slate-50 to-blue-50">
        <LoaderCircle className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center text-red-500 bg-gradient-to-br from-slate-50 to-blue-50 gap-4">
        <AlertTriangle className="w-16 h-16" />
        <p className="text-xl font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">
        {sections.map((section) => {
          if (section.items?.length === 0) return null;

          const styles = resolveSectionStyle(section);
          const align = section.styleConfig?.titleAlign || "center";
          const padding = section.styleConfig?.padding || "2rem";
          const radius = getBorderRadius(section.styleConfig?.borderRadius);

          return (
            <section
              key={section.id}
              className="w-full transition-all duration-300"
              style={{
                backgroundColor: styles.bg,
                padding,
                borderRadius: radius,
                boxShadow: styles.bg !== "transparent" ? SHADOW_INSET : "none",
              }}
            >
              {(section.title || section.subtitle) && (
                <div
                  className={`mb-8 ${
                    align === "left"
                      ? "text-left"
                      : align === "right"
                      ? "text-right"
                      : "text-center"
                  }`}
                >
                  {section.title && (
                    <h2
                      className="text-3xl md:text-4xl font-black tracking-tight mb-2"
                      style={{ color: styles.titleColor }}
                    >
                      {section.title}
                    </h2>
                  )}
                  {section.subtitle && (
                    <p
                      className="text-lg md:text-xl font-semibold opacity-80"
                      style={{ color: styles.subtitleColor }}
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
      <RecentlyViewed />
    </div>
  );
};

export default HomePageLayout;
