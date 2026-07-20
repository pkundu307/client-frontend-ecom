// src/app/category/[categoryid]/page.tsx

"use client";
export const runtime = 'edge';
import { useState, useEffect, useCallback, use } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  Squares2X2Icon,
  ListBulletIcon,
  EyeIcon,
  SparklesIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronUpIcon,
  PhotoIcon,
  Squares2X2Icon as GridIconAlt,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { baseUrl } from "@/app/utilities/baseUrl";

/* ================= NEUMORPHIC SHADOW CONSTANTS ================= */

const SHADOW_OUT = "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff";
const SHADOW_OUT_LG = "10px 10px 20px #c5cdd5, -10px -10px 20px #ffffff";
const SHADOW_OUT_SM = "4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff";
const SHADOW_IN = "inset 3px 3px 6px #c5cdd5, inset -3px -3px 6px #ffffff";

/* ================= PRODUCT TYPES ================= */

interface Product {
  id: string;
  title: string;
  description: string;
  slug: string;
  businessName: string;
  numberOfReviews: number;
  price: string;
  mrp: string | null; // API can send null when there's no MRP set
  images: string[];
  isCustomizable: boolean;
  shippingIncluded?: boolean;
  shippingCharge?: number;
  freeShippingEligible?: boolean;
}

interface AvailableFilter {
  name: string;
  options: string[];
}

interface CategoryInfo {
  id: number;
  name: string;
  slug: string;
  availableFilters: AvailableFilter[];
}

/* ================= LAYOUT TYPES ================= */

type LayoutLinkType =
  | "NONE"
  | "CATEGORY"
  | "PRODUCT"
  | "BRAND"
  | "SEARCH"
  | "EXTERNAL_URL"
  | "PROMOTION"
  | "PAGE";

interface LayoutItem {
  id: number;
  layoutId: number;
  title: string | null;
  subtitle: string | null;
  imageUrl: string | null;
  isActive: boolean;
  position: number;
  linkType: LayoutLinkType;
  linkValue: string | null;
  styleConfig: unknown;
  videoUrl: string | null;
}

type LayoutSectionType =
  | "HERO_BANNER"
  | "SCROLLABLE_ROW"
  | "GRID_2XN"
  | "GRID_3XN"
  | "GRID_SQUARE_COMPACT"
  | "SINGLE_BANNER"
  | "PRODUCT_CAROUSEL"
  | "FEATURED_PRODUCTS"
  | "BANNER_WITH_TEXT";

interface LayoutSection {
  id: number;
  categorySlug: string;
  title: string | null;
  subtitle: string | null;
  isActive: boolean;
  position: number;
  endDate: string | null;
  startDate: string | null;
  styleConfig: unknown;
  type: LayoutSectionType;
  createdAt: string;
  updatedAt: string;
  items: LayoutItem[];
}

interface CategoryResponse {
  category: CategoryInfo;
  layout: {
    hasLayout: boolean;
    sections: LayoutSection[];
  };
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

interface ActiveFilters {
  priceRange: string;
  attributes: Record<string, string>; // { Color: "Red", Size: "XL" }
}

/* ================= PRICE RANGES ================= */

const PRICE_RANGES = [
  { label: "Under ₹500",       value: "0-500"   },
  { label: "₹500 – ₹1,000",   value: "500-1k"  },
  { label: "₹1,000 – ₹5,000", value: "1k-5k"   },
  { label: "₹5,000 – ₹10,000",value: "5k-10k"  },
  { label: "₹10,000 – ₹20,000",value: "10k-20k"},
];

/* ================= API ================= */

const fetchProducts = async (
  categorySlug: string,
  page = 1,
  limit = 12,
  filters: ActiveFilters
): Promise<CategoryResponse> => {
  // Validate that categorySlug is provided and not empty
  if (!categorySlug || categorySlug === "undefined" || categorySlug === "null") {
    throw new Error("Invalid category slug");
  }

  const params = new URLSearchParams({
    page:  String(page),
    limit: String(limit),
  });

  if (filters.priceRange) params.set("priceRange", filters.priceRange);

  const attrEntries = Object.entries(filters.attributes);
  if (attrEntries.length > 0) {
    params.set("attributes", attrEntries.map(([k, v]) => `${k}:${v}`).join(","));
  }

  const res = await fetch(
    `${baseUrl}/products/category-page/${categorySlug}?${params}`
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

/* ================= VARIANTS ================= */

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

/* ================= HELPERS ================= */

const getDiscount = (price: string, mrp: string | null) => {
  if (!mrp) return 0;
  const p = parseFloat(price), m = parseFloat(mrp);
  return m > p ? Math.round(((m - p) / m) * 100) : 0;
};

const CustomizableBadge = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
    <SparklesIcon className="w-3 h-3" /> Customizable
  </span>
);

// Resolves a layout item's link destination based on its linkType.
const generateItemLink = (item: LayoutItem): string => {
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
    case "PROMOTION":
      return `/promotions/${item.linkValue}`;
    case "PAGE":
      return `/${item.linkValue}`;
    case "EXTERNAL_URL":
      return item.linkValue;
    default:
      return "#";
  }
};

/* ================= PRODUCT CARDS ================= */

const ProductCardGrid = ({ product }: { product: Product }) => {
  const disc = getDiscount(product.price, product.mrp);
  const mrpNum = product.mrp ? parseFloat(product.mrp) : 0;
  return (
    <motion.div variants={cardVariants} initial="hidden" animate="show" whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
      <Link href={`/product/${product.slug}`} className="block h-full">
        <div className="bg-[#e8ecf0] rounded-2xl p-3 flex flex-col h-full hover:shadow-xl transition-shadow duration-300"
          style={{ boxShadow: SHADOW_OUT_LG }}>
          <div className="relative mb-3 rounded-xl overflow-hidden bg-gray-200 aspect-square">
            <Image
              src={product.images[0] || "/placeholder-product.jpg"}
              alt={product.title} fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
            {disc > 0 && (
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold shadow">
                -{disc}%
              </span>
            )}
            {product.isCustomizable && (
              <div className="absolute bottom-2 left-2"><CustomizableBadge /></div>
            )}
          </div>

          <div className="flex-1 flex flex-col">
            <h3 className="font-bold text-sm md:text-base text-gray-900 line-clamp-2 mb-1">{product.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-1 mb-1">by {product.businessName}</p>
            <div className="flex items-center gap-0.5 mb-2">
              {[1,2,3,4,5].map(s => <StarSolid key={s} className="w-3 h-3 text-yellow-400" />)}
              <span className="text-[10px] text-gray-400 ml-1">({product.numberOfReviews})</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-auto">
              <span className="text-lg font-black text-gray-900">₹{Number(product.price).toLocaleString("en-IN")}</span>
              {mrpNum > parseFloat(product.price) && (
                <span className="text-xs text-gray-400 line-through">₹{mrpNum.toLocaleString("en-IN")}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const ProductCardList = ({ product }: { product: Product }) => {
  const disc = getDiscount(product.price, product.mrp);
  const mrpNum = product.mrp ? parseFloat(product.mrp) : 0;
  return (
    <motion.div variants={cardVariants} initial="hidden" animate="show" whileHover={{ x: 3 }} transition={{ duration: 0.25 }}>
      <Link href={`/product/${product.slug}`} className="block">
        <div className="bg-[#e8ecf0] rounded-2xl p-3 flex gap-4 hover:shadow-xl transition-shadow duration-300"
          style={{ boxShadow: SHADOW_OUT_LG }}>
          <div className="relative w-28 h-28 md:w-36 md:h-36 shrink-0 rounded-xl overflow-hidden bg-gray-200">
            <Image src={product.images[0] || "/placeholder-product.jpg"} alt={product.title} fill className="object-cover" />
            {disc > 0 && (
              <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                -{disc}%
              </span>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-bold text-base md:text-lg text-gray-900 line-clamp-2">{product.title}</h3>
              </div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {product.isCustomizable && <CustomizableBadge />}
                <p className="text-xs font-medium text-gray-600">by {product.businessName}</p>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-2">{product.description}</p>
              <div className="flex items-center gap-0.5 mb-2">
                {[1,2,3,4,5].map(s => <StarSolid key={s} className="w-3.5 h-3.5 text-yellow-400" />)}
                <span className="text-xs text-gray-400 ml-1">({product.numberOfReviews})</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl md:text-2xl font-black text-gray-900">₹{Number(product.price).toLocaleString("en-IN")}</span>
              {mrpNum > parseFloat(product.price) && (
                <span className="text-sm text-gray-400 line-through">₹{mrpNum.toLocaleString("en-IN")}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

/* ================= LAYOUT: SHARED PRIMITIVES ================= */

// Handles missing imageUrl gracefully — falls back to a neumorphic
// placeholder instead of a broken <Image> or an empty box.
const LayoutImage = ({ src, alt }: { src: string | null; alt: string }) => {
  if (!src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <PhotoIcon className="w-10 h-10 text-gray-300" />
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="object-cover"
    />
  );
};

// Generic card used by all grid / carousel style sections.
const LayoutItemCard = ({
  item,
  aspect = "aspect-[4/3]",
  compact = false,
}: {
  item: LayoutItem;
  aspect?: string;
  compact?: boolean;
}) => {
  const href = generateItemLink(item);
  const isExternal = item.linkType === "EXTERNAL_URL";
  const hasLink = item.linkType !== "NONE" && !!item.linkValue;

  const content = (
    <motion.div
      whileHover={hasLink ? { y: -4 } : undefined}
      transition={{ duration: 0.25 }}
      className="group bg-[#e8ecf0] rounded-2xl overflow-hidden h-full flex flex-col"
      style={{ boxShadow: SHADOW_OUT }}
    >
      <div className={`relative ${aspect} overflow-hidden`}>
        <LayoutImage src={item.imageUrl} alt={item.title || "Banner"} />
      </div>
      {!compact && (item.title || item.subtitle) && (
        <div className="p-3 flex-1 flex flex-col justify-center">
          {item.title && (
            <h3 className="font-bold text-sm text-gray-900 line-clamp-2">{item.title}</h3>
          )}
          {item.subtitle && (
            <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{item.subtitle}</p>
          )}
        </div>
      )}
      {compact && item.title && (
        <p className="text-[11px] font-semibold text-gray-700 text-center py-2 line-clamp-1">
          {item.title}
        </p>
      )}
    </motion.div>
  );

  if (!hasLink) return content;

  return isExternal ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
      {content}
    </a>
  ) : (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  );
};

/* ================= LAYOUT SECTIONS (one per "type") ================= */

const HeroBannerSection = ({ section }: { section: LayoutSection }) => {
  const items = section.items.filter(i => i.isActive !== false);
  if (items.length === 0) return null;

  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      pagination={items.length > 1 ? { clickable: true, dynamicBullets: true } : false}
      loop={items.length > 1}
      autoplay={items.length > 1 ? { delay: 4500, disableOnInteraction: false } : false}
      className="w-full h-[280px] md:h-[420px] rounded-3xl overflow-hidden"
      style={{ boxShadow: SHADOW_OUT_LG }}
    >
      {items.map(item => {
        const href = generateItemLink(item);
        const hasLink = item.linkType !== "NONE" && !!item.linkValue;
        return (
          <SwiperSlide key={item.id}>
            <div className="relative w-full h-full">
              <LayoutImage src={item.imageUrl} alt={item.title || "Hero banner"} />
              {(item.title || item.subtitle || hasLink) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              )}
              <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white max-w-lg">
                {item.title && <h2 className="text-2xl md:text-4xl font-black mb-2">{item.title}</h2>}
                {item.subtitle && <p className="text-sm md:text-lg font-medium opacity-90 mb-4">{item.subtitle}</p>}
                {hasLink && (
                  <Link href={href} className="inline-block px-5 py-2.5 rounded-xl bg-white text-gray-900 font-bold text-sm hover:bg-gray-100 transition-colors">
                    Explore
                  </Link>
                )}
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

const SingleBannerSection = ({ section }: { section: LayoutSection }) => {
  const item = section.items.find(i => i.isActive !== false);
  if (!item) return null;

  const href = generateItemLink(item);
  const hasLink = item.linkType !== "NONE" && !!item.linkValue;
  const isExternal = item.linkType === "EXTERNAL_URL";

  const banner = (
    <div className="relative w-full h-[200px] md:h-[320px] rounded-3xl overflow-hidden"
      style={{ boxShadow: SHADOW_OUT_LG }}>
      <LayoutImage src={item.imageUrl} alt={item.title || "Banner"} />
      {(item.title || item.subtitle) && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 p-5 md:p-8 text-white">
            {item.title && <h2 className="text-xl md:text-3xl font-black mb-1">{item.title}</h2>}
            {item.subtitle && <p className="text-sm md:text-base opacity-90">{item.subtitle}</p>}
          </div>
        </>
      )}
    </div>
  );

  if (!hasLink) return banner;
  return isExternal ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block">{banner}</a>
  ) : (
    <Link href={href} className="block">{banner}</Link>
  );
};

const BannerWithTextSection = ({ section }: { section: LayoutSection }) => {
  const item = section.items.find(i => i.isActive !== false);
  if (!item) return null;

  const href = generateItemLink(item);
  const hasLink = item.linkType !== "NONE" && !!item.linkValue;

  const inner = (
    <div className="flex flex-col md:flex-row items-center gap-5 bg-[#e8ecf0] rounded-2xl p-5 md:p-6"
      style={{ boxShadow: SHADOW_OUT }}>
      <div className="relative w-full md:w-40 h-32 shrink-0 rounded-xl overflow-hidden">
        <LayoutImage src={item.imageUrl} alt={item.title || "Banner"} />
      </div>
      <div className="flex-1 text-center md:text-left">
        {item.title && <h3 className="font-bold text-lg text-gray-900 mb-1">{item.title}</h3>}
        {item.subtitle && <p className="text-sm text-gray-500">{item.subtitle}</p>}
      </div>
    </div>
  );

  if (!hasLink) return inner;
  return <Link href={href} className="block">{inner}</Link>;
};

const Grid2xNSection = ({ section }: { section: LayoutSection }) => {
  const items = section.items.filter(i => i.isActive !== false);
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {items.map(item => (
        <LayoutItemCard key={item.id} item={item} aspect="aspect-[16/9]" />
      ))}
    </div>
  );
};

const Grid3xNSection = ({ section }: { section: LayoutSection }) => {
  const items = section.items.filter(i => i.isActive !== false);
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {items.map(item => (
        <LayoutItemCard key={item.id} item={item} aspect="aspect-square" />
      ))}
    </div>
  );
};

const GridSquareCompactSection = ({ section }: { section: LayoutSection }) => {
  const items = section.items.filter(i => i.isActive !== false);
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {items.map(item => (
        <LayoutItemCard key={item.id} item={item} aspect="aspect-square" compact />
      ))}
    </div>
  );
};

const CarouselSection = ({ section }: { section: LayoutSection }) => {
  const items = section.items.filter(i => i.isActive !== false);
  if (items.length === 0) return null;
  return (
    <div className="relative group/carousel">
      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        breakpoints={{
          0:    { slidesPerView: 1.3 },
          480:  { slidesPerView: 2.1 },
          768:  { slidesPerView: 3.2 },
          1024: { slidesPerView: 4 },
        }}
        navigation={{ nextEl: `.lc-next-${section.id}`, prevEl: `.lc-prev-${section.id}` }}
        className="pb-2"
      >
        {items.map(item => (
          <SwiperSlide key={item.id} className="!h-auto">
            <LayoutItemCard item={item} aspect="aspect-square" />
          </SwiperSlide>
        ))}
      </Swiper>
      {items.length > 4 && (
        <>
          <button aria-label="Previous"
            className={`lc-prev-${section.id} absolute -left-3 top-1/3 z-10 w-9 h-9 rounded-full bg-white shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all flex items-center justify-center`}>
            <ChevronLeftIcon className="w-4 h-4 text-gray-700" />
          </button>
          <button aria-label="Next"
            className={`lc-next-${section.id} absolute -right-3 top-1/3 z-10 w-9 h-9 rounded-full bg-white shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all flex items-center justify-center`}>
            <ChevronRightIcon className="w-4 h-4 text-gray-700" />
          </button>
        </>
      )}
    </div>
  );
};

const ScrollableRowSection = ({ section }: { section: LayoutSection }) => {
  const items = section.items.filter(i => i.isActive !== false);
  if (items.length === 0) return null;
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
      {items.map(item => (
        <div key={item.id} className="shrink-0 w-40 md:w-48 snap-start">
          <LayoutItemCard item={item} aspect="aspect-[4/5]" />
        </div>
      ))}
    </div>
  );
};

const FeaturedProductsSection = ({ section }: { section: LayoutSection }) => {
  const items = section.items.filter(i => i.isActive !== false);
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map(item => (
        <div key={item.id} className="relative">
          <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-amber-400 text-[10px] font-bold text-gray-900 shadow">
            Featured
          </span>
          <LayoutItemCard item={item} aspect="aspect-square" />
        </div>
      ))}
    </div>
  );
};

// Dispatches purely on `section.type` — styleConfig is intentionally ignored.
const renderLayoutSection = (section: LayoutSection) => {
  switch (section.type) {
    case "HERO_BANNER":         return <HeroBannerSection section={section} />;
    case "SINGLE_BANNER":       return <SingleBannerSection section={section} />;
    case "BANNER_WITH_TEXT":    return <BannerWithTextSection section={section} />;
    case "GRID_2XN":            return <Grid2xNSection section={section} />;
    case "GRID_3XN":            return <Grid3xNSection section={section} />;
    case "GRID_SQUARE_COMPACT": return <GridSquareCompactSection section={section} />;
    case "PRODUCT_CAROUSEL":    return <CarouselSection section={section} />;
    case "SCROLLABLE_ROW":      return <ScrollableRowSection section={section} />;
    case "FEATURED_PRODUCTS":   return <FeaturedProductsSection section={section} />;
    default:                    return null;
  }
};

const LayoutSectionBlock = ({ section }: { section: LayoutSection }) => {
  const rendered = renderLayoutSection(section);
  if (!rendered) return null; // empty items → don't render an empty shell

  const showHeader =
    (section.title || section.subtitle) &&
    section.type !== "HERO_BANNER" &&
    section.type !== "SINGLE_BANNER";

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full"
    >
      {showHeader && (
        <div className="mb-4">
          {section.title && (
            <h2 className="text-xl md:text-2xl font-black text-gray-900">{section.title}</h2>
          )}
          {section.subtitle && (
            <p className="text-sm text-gray-500 mt-0.5">{section.subtitle}</p>
          )}
        </div>
      )}
      {rendered}
    </motion.section>
  );
};

/* ================= FILTER PANEL ================= */

const FilterAccordion = ({
  title, children, defaultOpen = false,
}: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-3 text-sm font-bold text-gray-800 hover:text-purple-600 transition-colors"
      >
        {title}
        {open ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterPanel = ({
  availableFilters,
  activeFilters,
  onFilterChange,
  onClearAll,
  activeCount,
}: {
  availableFilters: AvailableFilter[];
  activeFilters: ActiveFilters;
  onFilterChange: (filters: ActiveFilters) => void;
  onClearAll: () => void;
  activeCount: number;
}) => {
  const togglePrice = (val: string) => {
    onFilterChange({
      ...activeFilters,
      priceRange: activeFilters.priceRange === val ? "" : val,
    });
  };

  const toggleAttr = (name: string, value: string) => {
    const cur = activeFilters.attributes;
    const updated = { ...cur };
    if (updated[name] === value) delete updated[name];
    else updated[name] = value;
    onFilterChange({ ...activeFilters, attributes: updated });
  };

  return (
    <div className="bg-[#e8ecf0] rounded-2xl p-4" style={{ boxShadow: SHADOW_OUT }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <FunnelIcon className="w-4 h-4" /> Filters
          {activeCount > 0 && (
            <span className="bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </span>
        {activeCount > 0 && (
          <button onClick={onClearAll}
            className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">
            Clear All
          </button>
        )}
      </div>

      {availableFilters.length === 0 && (
        <p className="text-xs text-gray-400 mb-2">No attribute filters for this category.</p>
      )}

      {/* Price Range */}
      <FilterAccordion title="Price Range" defaultOpen>
        <div className="space-y-1.5">
          {PRICE_RANGES.map(r => (
            <label key={r.value}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all text-sm ${
                activeFilters.priceRange === r.value
                  ? "bg-purple-600 text-white font-semibold"
                  : "hover:bg-white/60 text-gray-700"
              }`}>
              <input type="radio" name="priceRange" className="hidden"
                checked={activeFilters.priceRange === r.value}
                onChange={() => togglePrice(r.value)} />
              {r.label}
            </label>
          ))}
        </div>
      </FilterAccordion>

      {/* Dynamic Attribute Filters */}
      {availableFilters
        .filter(filter => filter.options.length <= 10)
        .map(filter => (
          <FilterAccordion key={filter.name} title={filter.name} defaultOpen>
            <div className="flex flex-wrap gap-2">
              {filter.options.map(opt => {
                const active = activeFilters.attributes[filter.name] === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleAttr(filter.name, opt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      active
                        ? "bg-purple-600 text-white border-purple-600 shadow"
                        : "bg-white/60 text-gray-700 border-gray-200 hover:bg-white hover:border-purple-300"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </FilterAccordion>
        ))}
    </div>
  );
};

/* ================= ACTIVE FILTER CHIPS ================= */

const ActiveFilterChips = ({
  activeFilters,
  onRemovePrice,
  onRemoveAttr,
}: {
  activeFilters: ActiveFilters;
  onRemovePrice: () => void;
  onRemoveAttr: (name: string) => void;
}) => {
  const chips: { label: string; onRemove: () => void }[] = [];

  if (activeFilters.priceRange) {
    const found = PRICE_RANGES.find(r => r.value === activeFilters.priceRange);
    chips.push({ label: found?.label ?? activeFilters.priceRange, onRemove: onRemovePrice });
  }

  Object.entries(activeFilters.attributes).forEach(([k, v]) => {
    chips.push({ label: `${k}: ${v}`, onRemove: () => onRemoveAttr(k) });
  });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map(chip => (
        <span key={chip.label}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
          {chip.label}
          <button onClick={chip.onRemove} className="hover:text-red-500 transition-colors">
            <XMarkIcon className="w-3.5 h-3.5" />
          </button>
        </span>
      ))}
    </div>
  );
};

/* ================= SKELETON ================= */

const SkeletonCard = () => (
  <div className="bg-[#e8ecf0] rounded-2xl p-3 animate-pulse" style={{ boxShadow: SHADOW_OUT }}>
    <div className="aspect-square rounded-xl bg-gray-300 mb-3" />
    <div className="h-4 bg-gray-300 rounded mb-2 w-3/4" />
    <div className="h-3 bg-gray-200 rounded mb-3 w-1/2" />
    <div className="h-5 bg-gray-300 rounded w-1/3" />
  </div>
);

const LayoutSkeleton = () => (
  <div className="space-y-8 mb-8">
    <div className="w-full h-[280px] md:h-[380px] rounded-3xl bg-gray-300 animate-pulse" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="aspect-square rounded-2xl bg-gray-200 animate-pulse" />
      ))}
    </div>
  </div>
);

/* ================= MAIN COMPONENT ================= */

const ProductListing = ({ params }: { params: Promise<{ categoryid: string }> }) => {
  const { categoryid } = use(params);

  // Normalize categoryid - handle string "undefined" or "null"
  const normalizedCategory = categoryid === "undefined" || categoryid === "null" ? "" : categoryid;

  const [data,        setData]        = useState<CategoryResponse | null>(null);
  const [sections,    setSections]    = useState<LayoutSection[]>([]);
  const [hasLayout,   setHasLayout]   = useState(false);
  const [products,    setProducts]    = useState<Product[]>([]);
  const [pagination,  setPagination]  = useState<CategoryResponse["pagination"] | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [isGridView,  setIsGridView]  = useState(true);
  const [filterOpen,  setFilterOpen]  = useState(false); // mobile drawer

  // Once a layout exists, we hide the products grid + filters behind a
  // "Show All Products" CTA instead of dumping both on screen at once.
  // This stays true for the rest of the session — including page 2+ —
  // once the user opts in, so "Load More" keeps working in that view.
  const [showAllProducts, setShowAllProducts] = useState(false);

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    priceRange: "",
    attributes: {},
  });

  // count active filters
  const activeFilterCount =
    (activeFilters.priceRange ? 1 : 0) +
    Object.keys(activeFilters.attributes).length;

  // ── Load ─────────────────────────────────────────────────────────────────
  const loadProducts = useCallback(
    async (pageNum = 1, filters = activeFilters, append = false) => {
      const setL = append ? setLoadingMore : setLoading;
      try {
        // Validate categoryid before making API call
        if (!normalizedCategory) {
          throw new Error("Invalid category. Please select a valid category.");
        }
        setL(true);
        const res = await fetchProducts(normalizedCategory, pageNum, 12, filters);
        setData(res);

        // Layout sections are only ever attached to the "effective" page 1
        // (including when the backend silently snaps an out-of-range page
        // back to 1). Only replace them on a fresh load — never on a
        // "load more" append — so we don't wipe the layout out mid-scroll.
        if (!append) {
          setSections(res.layout?.sections ?? []);
          setHasLayout(res.layout?.hasLayout ?? false);
        }

        // Guard against the backend's snap-back behavior: if we asked for
        // a page beyond what's available (category has a layout but ran
        // out of real product pages) the server silently re-serves page 1
        // instead. Don't append that onto the tail of the list — it would
        // duplicate products already on screen. Just stop pagination here.
        const snappedBack = append && res.pagination.page < pageNum;

        if (!snappedBack) {
          setProducts(prev => (append ? [...prev, ...res.products] : res.products));
        }
        setPagination(res.pagination);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setL(false);
      }
    },
    [normalizedCategory, activeFilters]
  );

  useEffect(() => {
    if (!normalizedCategory) {
      setError("Invalid category. Please select a valid category.");
      setLoading(false);
      return;
    }
    loadProducts(1, activeFilters, false);
    setShowAllProducts(false); // reset the reveal state when the category changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedCategory]);

  // When filters change → reset to page 1
  const applyFilters = (filters: ActiveFilters) => {
    setActiveFilters(filters);
    loadProducts(1, filters, false);
    setFilterOpen(false);
  };

  const clearAllFilters = () => {
    const empty: ActiveFilters = { priceRange: "", attributes: {} };
    setActiveFilters(empty);
    loadProducts(1, empty, false);
  };

  const handleLoadMore = () => {
    if (!pagination || pagination.page >= pagination.lastPage || loadingMore) return;
    loadProducts(pagination.page + 1, activeFilters, true);
  };

  // ── States ────────────────────────────────────────────────────────────────
  if (error || !normalizedCategory) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center p-4">
        <div className="text-center bg-red-50 p-8 rounded-3xl shadow-lg">
          <p className="text-red-600 font-semibold text-lg mb-4">
            {error || "Invalid category. Please select a valid category."}
          </p>
          <Link href="/" className="px-6 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors inline-block">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const availableFilters = data?.category.availableFilters ?? [];

  // Products area (filters + grid/list) only shows once there's no layout
  // to begin with, or the user explicitly asked to see all products.
  const revealProducts = !hasLayout || showAllProducts;

  // ── Filter Panel (shared) ─────────────────────────────────────────────────
  const filterPanel = (
    <FilterPanel
      availableFilters={availableFilters}
      activeFilters={activeFilters}
      onFilterChange={applyFilters}
      onClearAll={clearAllFilters}
      activeCount={activeFilterCount}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d8e4e6] via-[#e8ecf0] to-[#dfe7e9]">

      {/* ── STICKY HEADER ─────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 backdrop-blur-lg bg-[#e8ecf0]/80 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">

            {/* Left: Title + count */}
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-black text-gray-900 truncate">
                {loading ? (
                  <span className="inline-block h-7 w-40 bg-gray-300 rounded animate-pulse" />
                ) : data?.category.name}
              </h1>
              {!loading && pagination && revealProducts && (
                <p className="text-xs text-gray-500">
                  {pagination.total} products
                  {pagination.lastPage > 1 && ` · Page ${pagination.page}/${pagination.lastPage}`}
                </p>
              )}
            </div>

            {/* Right side controls only make sense once products are shown */}
            {revealProducts && (
              <div className="flex items-center gap-2 shrink-0">
                {/* Mobile filter toggle */}
                <button onClick={() => setFilterOpen(true)}
                  className="lg:hidden relative flex items-center gap-1.5 px-3 py-2 bg-[#e8ecf0] rounded-xl text-sm font-semibold text-gray-700 hover:bg-white/60 transition-colors"
                  style={{ boxShadow: SHADOW_OUT_SM }}>
                  <FunnelIcon className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* View toggle */}
                <div className="flex gap-1 bg-[#e8ecf0] rounded-xl p-1" style={{ boxShadow: SHADOW_IN }}>
                  <button onClick={() => setIsGridView(true)}
                    className={`p-2 rounded-lg transition-all ${isGridView ? "bg-gray-900 text-white shadow" : "text-gray-500 hover:bg-white/50"}`}>
                    <Squares2X2Icon className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsGridView(false)}
                    className={`p-2 rounded-lg transition-all ${!isGridView ? "bg-gray-900 text-white shadow" : "text-gray-500 hover:bg-white/50"}`}>
                    <ListBulletIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE FILTER DRAWER ──────────────────────────────────────────── */}
      <AnimatePresence>
        {filterOpen && revealProducts && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setFilterOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-0 left-0 z-50 h-full w-[80vw] max-w-xs bg-[#e8ecf0] shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <span className="font-bold text-gray-900">Filters</span>
                <button onClick={() => setFilterOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/60 transition-colors">
                  <XMarkIcon className="w-5 h-5 text-gray-700" />
                </button>
              </div>
              <div className="p-4">{filterPanel}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── LAYOUT SECTIONS + "Show All Products" CTA ───────────────────────
          Shown only while the user hasn't opted into the products view yet.
          Once `showAllProducts` flips true, this whole block disappears —
          for this page and every subsequent "Load More" page too, since
          the flag never resets on data fetches. */}
      {loading && !data ? (
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <LayoutSkeleton />
        </div>
      ) : hasLayout && !showAllProducts ? (
        <div className="max-w-7xl mx-auto px-4 pt-6 space-y-10">
          {sections.map(section => (
            <LayoutSectionBlock key={section.id} section={section} />
          ))}

          <div className="text-center pt-4 pb-2">
            <button
              onClick={() => setShowAllProducts(true)}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#e8ecf0] text-gray-900 rounded-2xl font-bold hover:text-purple-600 transition-all hover:scale-105 active:scale-95"
              style={{ boxShadow: SHADOW_OUT_LG }}
            >
              <GridIconAlt className="w-5 h-5" />
              Show All Products
            </button>
            {pagination && (
              <p className="text-xs text-gray-500 mt-3">{pagination.total} products in this category</p>
            )}
          </div>
        </div>
      ) : null}

      {/* ── MAIN CONTENT (products + filters) ───────────────────────────────
          Only rendered once revealProducts is true — i.e. no layout exists,
          or the user clicked "Show All Products". Persists across page 2+. */}
      {revealProducts && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-56 xl:w-64 shrink-0">
              <div className="sticky top-24">
                {filterPanel}
              </div>
            </aside>

            {/* Products Area */}
            <div className="flex-1 min-w-0">

              {/* Divider label so users know they've left the highlights */}
              {hasLayout && !loading && (
                <h2 className="text-lg font-black text-gray-900 mb-4">All Products</h2>
              )}

              {/* Active Filter Chips */}
              <ActiveFilterChips
                activeFilters={activeFilters}
                onRemovePrice={() => applyFilters({ ...activeFilters, priceRange: "" })}
                onRemoveAttr={name => {
                  const updated = { ...activeFilters.attributes };
                  delete updated[name];
                  applyFilters({ ...activeFilters, attributes: updated });
                }}
              />

              {/* Product Grid / List */}
              {loading ? (
                <div className={isGridView
                  ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "flex flex-col gap-3"
                }>
                  {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : products.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20"
                >
                  <EyeIcon className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                  <p className="font-bold text-gray-700 mb-1">
                    {activeFilterCount > 0 ? "No products found" : "No products yet"}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {activeFilterCount > 0 ? "Try adjusting your filters" : "Check back soon for new arrivals"}
                  </p>
                  {activeFilterCount > 0 && (
                    <button onClick={clearAllFilters}
                      className="px-5 py-2 bg-purple-600 text-white rounded-xl font-semibold text-sm hover:bg-purple-700 transition-colors">
                      Clear Filters
                    </button>
                  )}
                </motion.div>
              ) : (
                <>
                  <motion.div
                    layout
                    className={isGridView
                      ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                      : "flex flex-col gap-3"
                    }
                  >
                    <AnimatePresence mode="popLayout">
                      {products.map(product =>
                        isGridView
                          ? <ProductCardGrid key={product.id} product={product} />
                          : <ProductCardList key={product.id} product={product} />
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Load More */}
                  {pagination && pagination.page < pagination.lastPage && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-10 text-center"
                    >
                      <button onClick={handleLoadMore} disabled={loadingMore}
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95">
                        {loadingMore ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            Loading...
                          </>
                        ) : (
                          <>
                            Load More
                            <ChevronDownIcon className="w-4 h-4" />
                          </>
                        )}
                      </button>
                      <p className="text-xs text-gray-500 mt-3">
                        Showing {products.length} of {pagination.total} products
                      </p>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListing;