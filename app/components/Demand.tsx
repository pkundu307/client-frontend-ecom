"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  AlertTriangle,
} from "lucide-react";

const BASE_URL = "http://localhost:3001";

// TYPES
type JsonObject = { [key: string]: any };
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

interface HomepageItem {
  id: number;
  title: string | null;
  subtitle: string | null;
  imageUrl: string | null;
  linkType: LinkTypeEnum;
  linkValue: string | null;
  styleConfig: JsonObject | null;
}

interface HomepageSection {
  id: number;
  title: string | null;
  subtitle: string | null;
  type: SectionTypeEnum;
  styleConfig: JsonObject | null;
  items: HomepageItem[];
}

// LINK HELPER
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

// ITEM CARD
const ItemCard = ({
  item,
  className = "",
}: {
  item: HomepageItem;
  className?: string;
}) => {
  const href = generateLink(item);
  const isExternal = item.linkType === "EXTERNAL_URL";

  const cardStyle: React.CSSProperties = {
    backgroundColor: item.styleConfig?.backgroundColor || "#e8ecf0",
    borderRadius: item.styleConfig?.borderRadius
      ? `${item.styleConfig.borderRadius}px`
      : "16px",
    borderColor: item.styleConfig?.borderColor || "transparent",
    boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
  };

  const titleStyle: React.CSSProperties = {
    color: item.styleConfig?.titleColor || "#1f2937",
  };

  const subtitleStyle: React.CSSProperties = {
    color: item.styleConfig?.subtitleColor || "#6b7280",
  };

  const cardContent = (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative h-full w-full flex flex-col overflow-hidden ${className}`}
      style={cardStyle}
    >
      <div className="relative w-full h-48 xs:h-52 sm:h-60 md:h-72">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title || "Homepage Item"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-sm">
            No Image
          </div>
        )}

        {item.styleConfig?.overlayGradient && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: item.styleConfig.overlayGradient }}
          />
        )}
      </div>

      <div className="p-3 xs:p-4 sm:p-5 md:p-6 flex flex-col">
        {item.title && (
          <h3
            className="text-sm xs:text-base sm:text-lg md:text-xl font-bold transition-colors line-clamp-2"
            style={titleStyle}
          >
            {item.title}
          </h3>
        )}

        {item.subtitle && (
          <p
            className="text-xs sm:text-sm mt-1 leading-relaxed line-clamp-2"
            style={subtitleStyle}
          >
            {item.subtitle}
          </p>
        )}

        {item.styleConfig?.brandLogos &&
          Array.isArray(item.styleConfig.brandLogos) && (
            <div className="mt-auto pt-3 flex items-center gap-2 flex-wrap">
              {item.styleConfig.brandLogos.map(
                (logoUrl: string, index: number) => (
                  <div
                    key={index}
                    className="relative h-4 w-12 xs:h-5 xs:w-14 sm:h-6 sm:w-16"
                  >
                    <Image
                      src={logoUrl}
                      alt={`Brand ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                )
              )}
            </div>
          )}
      </div>
    </motion.div>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-full"
      >
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={href} className="block w-full h-full">
      {cardContent}
    </Link>
  );
};

// HERO SLIDER
const HeroSlider = ({ section }: { section: HomepageSection }) => (
  <div className="w-full">
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      pagination={
        section.styleConfig?.showDots !== false
          ? { clickable: true, dynamicBullets: true }
          : false
      }
      navigation={false}
      loop={section.items.length > 1}
      autoplay={
        section.styleConfig?.autoplay
          ? {
              delay: section.styleConfig?.autoplaySpeed || 5000,
              disableOnInteraction: false,
            }
          : false
      }
      className="w-full rounded-xl sm:rounded-2xl"
      style={{
        boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff",
      }}
    >
      {section.items.map((item) => (
        <SwiperSlide key={item.id}>
          <ItemCard item={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
);

// PRODUCT CAROUSEL
const ProductCarousel = ({ section }: { section: HomepageSection }) => {
  const itemsToShow = section.styleConfig?.itemsToShow || 4;

  return (
    <div className="relative w-full overflow-hidden">
      <Swiper
        modules={[Navigation]}
        spaceBetween={12}
        breakpoints={{
          0: {
            slidesPerView: 1.3,
            spaceBetween: 10,
          },
          380: {
            slidesPerView: 1.5,
            spaceBetween: 12,
          },
          480: {
            slidesPerView: 1.8,
            spaceBetween: 14,
          },
          640: {
            slidesPerView: 2.3,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 2.8,
            spaceBetween: 18,
          },
          1024: {
            slidesPerView: Math.min(itemsToShow, 4),
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: itemsToShow,
            spaceBetween: 24,
          },
        }}
        navigation={{
          nextEl: `.next-${section.id}`,
          prevEl: `.prev-${section.id}`,
        }}
        className="w-full"
      >
        {section.items.map((item) => (
          <SwiperSlide key={item.id}>
            <ItemCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>

      {section.styleConfig?.showArrows && (
        <>
          <button
            aria-label="Previous"
            className={`prev-${section.id} hidden lg:flex items-center justify-center absolute top-1/2 -left-4 xl:-left-6 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#e8ecf0] transition-transform hover:scale-110`}
            style={{
              boxShadow: "6px 6px 12px #c5cdd5, -4px -4px 8px #ffffff",
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            aria-label="Next"
            className={`next-${section.id} hidden lg:flex items-center justify-center absolute top-1/2 -right-4 xl:-right-6 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#e8ecf0] transition-transform hover:scale-110`}
            style={{
              boxShadow: "6px 6px 12px #c5cdd5, -4px -4px 8px #ffffff",
            }}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
};

// GRIDS
const Grid2xn = ({ section }: { section: HomepageSection }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 w-full">
    {section.items.map((item, index) => (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="w-full"
      >
        <ItemCard item={item} />
      </motion.div>
    ))}
  </div>
);

const GridSquareCompact = ({ section }: { section: HomepageSection }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 w-full">
    {section.items.map((item, index) => (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="w-full"
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

// MAIN COMPONENT
const HomePageLayout = () => {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/homepage`);
        setSections(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load homepage. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomepageData();
  }, []);

  const renderSection = (section: HomepageSection) => {
    if (
      !hasMounted &&
      (section.type === "HERO_SLIDER" ||
        section.type === "PRODUCT_CAROUSEL" ||
        section.type === "SCROLLABLE_ROW")
    ) {
      return (
        <div className="w-full h-64 bg-gray-200 rounded-2xl animate-pulse" />
      );
    }

    const SectionComponent =
      {
        HERO_SLIDER: HeroSlider,
        PRODUCT_CAROUSEL: ProductCarousel,
        GRID_2XN: Grid2xn,
        GRID_3XN: Grid2xn,
        GRID_SQUARE_COMPACT: GridSquareCompact,
        SINGLE_BANNER: SingleBanner,
        SCROLLABLE_ROW: ProductCarousel,
      }[section.type] || null;

    if (!SectionComponent || section.items.length === 0) return null;

    return <SectionComponent section={section} />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center bg-linear-to-br from-[#d8e4e6] via-[#e8ecf0] to-[#dfe7e9]">
        <LoaderCircle className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center bg-red-50 text-red-600 px-4">
        <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 mb-3" />
        <p className="text-sm sm:text-base text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-[#d8e4e6] via-[#e8ecf0] to-[#dfe7e9]">
      <div className="w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-10 md:py-12 max-w-480">
        <div className="w-full max-w-7xl mx-auto space-y-10 sm:space-y-14 md:space-y-16 lg:space-y-20">
          {sections.map((section) => {
            if (
              section.type.startsWith("GRID") &&
              section.items.length === 0
            ) {
              return null;
            }

            const sectionPadding = section.styleConfig?.padding || "12px";
            const sectionBg = section.styleConfig?.backgroundColor;
            const sectionBorderRadius =
              section.styleConfig?.borderRadius || "16px";

            return (
              <section
                key={section.id}
                className="w-full"
                style={{
                  backgroundColor: sectionBg,
                  padding: sectionPadding,
                  borderRadius: sectionBorderRadius,
                }}
              >
                {section.title && (
                  <div
                    className="mb-6 sm:mb-8 md:mb-10"
                    style={{
                      textAlign: section.styleConfig?.titleAlign || "center",
                    }}
                  >
                    <motion.h2
                      initial={{ opacity: 0, y: -20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold relative inline-block"
                      style={{
                        color: section.styleConfig?.titleColor || "#111827",
                      }}
                    >
                      {section.title}
                      <span className="absolute -bottom-1.5 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-linear-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full w-3/4 mx-auto" />
                    </motion.h2>

                    {section.subtitle && (
                      <p
                        className="mt-2 sm:mt-3 text-xs xs:text-sm sm:text-base"
                        style={{
                          color:
                            section.styleConfig?.subtitleColor || "#6b7280",
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
      </div>
    </div>
  );
};

export default HomePageLayout;
