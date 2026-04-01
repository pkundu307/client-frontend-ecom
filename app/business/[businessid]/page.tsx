// src/app/business/[businessid]/page.tsx

"use client";
export const runtime = 'edge';
import { useState, useEffect, useCallback, use } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import {
  Squares2X2Icon,
  ListBulletIcon,
  EyeIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

/* ================= TYPES ================= */

interface Product {
  id: string;
  title: string;
  description: string;
  slug: string;
  businessName: string;
  numberOfReviews: number;
  price: string;
  mrp: string;
  images: string[];
  isCustomizable: boolean;
}

interface BusinessInfo {
  name: string;
  state: string;
  logo: string;
}

interface BusinessResponse {
  business: BusinessInfo;
  products: Product[];
}

/* ================= API ================= */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.jottosop.in";

const fetchProducts = async (
  businessId: string
): Promise<BusinessResponse> => {
  const res = await fetch(
    `${BASE_URL}/business/${businessId}/products`
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

const getDiscount = (price: string, mrp: string) => {
  const p = parseFloat(price), m = parseFloat(mrp);
  return mrp !== "0" && m > p ? Math.round(((m - p) / m) * 100) : 0;
};

const CustomizableBadge = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
    <SparklesIcon className="w-3 h-3" /> Customizable
  </span>
);

/* ================= PRODUCT CARDS ================= */

const ProductCardGrid = ({ product }: { product: Product }) => {
  const disc = getDiscount(product.price, product.mrp);
  return (
    <motion.div variants={cardVariants} initial="hidden" animate="show" whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
      <Link href={`/product/${product.slug}`} className="block h-full">
        <div className="bg-[#e8ecf0] rounded-2xl p-3 flex flex-col h-full hover:shadow-xl transition-shadow duration-300"
          style={{ boxShadow: "10px 10px 20px #c5cdd5, -10px -10px 20px #ffffff" }}>
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
              {parseFloat(product.mrp) > parseFloat(product.price) && (
                <span className="text-xs text-gray-400 line-through">₹{Number(product.mrp).toLocaleString("en-IN")}</span>
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
  return (
    <motion.div variants={cardVariants} initial="hidden" animate="show" whileHover={{ x: 3 }} transition={{ duration: 0.25 }}>
      <Link href={`/product/${product.slug}`} className="block">
        <div className="bg-[#e8ecf0] rounded-2xl p-3 flex gap-4 hover:shadow-xl transition-shadow duration-300"
          style={{ boxShadow: "10px 10px 20px #c5cdd5, -10px -10px 20px #ffffff" }}>
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
              {parseFloat(product.mrp) > parseFloat(product.price) && (
                <span className="text-sm text-gray-400 line-through">₹{Number(product.mrp).toLocaleString("en-IN")}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};


/* ================= SKELETON ================= */

const SkeletonCard = () => (
  <div className="bg-[#e8ecf0] rounded-2xl p-3 animate-pulse"
    style={{ boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff" }}>
    <div className="aspect-square rounded-xl bg-gray-300 mb-3" />
    <div className="h-4 bg-gray-300 rounded mb-2 w-3/4" />
    <div className="h-3 bg-gray-200 rounded mb-3 w-1/2" />
    <div className="h-5 bg-gray-300 rounded w-1/3" />
  </div>
);

/* ================= MAIN COMPONENT ================= */

const BusinessCatalog = ({ params }: { params: Promise<{ businessid: string }> }) => {
  const { businessid } = use(params);

  const [data,        setData]        = useState<BusinessResponse | null>(null);
  const [products,    setProducts]    = useState<Product[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [isGridView,  setIsGridView]  = useState(true);

  // ── Load ─────────────────────────────────────────────────────────────────
  const loadProducts = useCallback(
    async () => {
      setLoading(true);
      try {
        const res = await fetchProducts(businessid);
        setData(res);
        setProducts(res.products);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [businessid]
  );

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessid]);

  // ── States ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center p-4">
        <div className="text-center bg-red-50 p-8 rounded-3xl shadow-lg">
          <p className="text-red-600 font-semibold text-lg mb-4">{error}</p>
          <button 
            className="px-6 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
                ) : data?.business.name}
              </h1>
              {!loading && data?.products && (
                <p className="text-xs text-gray-500">
                  {data.products.length} products
                </p>
              )}
            </div>

            {/* View toggle */}
            <div className="flex gap-1 bg-[#e8ecf0] rounded-xl p-1"
              style={{ boxShadow: "inset 3px 3px 6px #c5cdd5, inset -3px -3px 6px #ffffff" }}>
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
        </div>
      </div>

      {/* ── BUSINESS HEADER ───────────────────────────────────────────────── */}
      {!loading && data?.business && (
        <div className="bg-white/50 py-6 border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-4">
              {data.business.logo && (
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                  <Image
                    src={data.business.logo}
                    alt={data.business.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Business State</p>
                <p className="text-sm font-semibold text-gray-700">{data.business.state}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">

          {/* Products Area */}
          <div className="flex-1 min-w-0">

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
                <p className="font-bold text-gray-700 mb-1">No products found</p>
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

                              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCatalog;
