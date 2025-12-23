"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, type Variants } from "framer-motion";
import { use } from "react";
import {
  // Squares2X2Icon,
  // ListBulletIcon,
  HeartIcon,
  EyeIcon,
  ShoppingCartIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartSolid,
  StarIcon as StarSolid,
} from "@heroicons/react/24/solid";
import Image from "next/image";
// import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

interface Product {
  id: string;
  title: string;
  description: string;
  businessName: string;
  numberOfReviews: number;
  numberOfVariants: number;
  price: string;
  mrp: string;
  images: string[];
  isCustomizable: boolean;
}

interface ProductResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

/* ================= API ================= */

const fetchProductsByCategory = async (
  categoryId: string,
  page = 1,
  limit = 10
): Promise<ProductResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/featured/category/${categoryId}?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};

/* ================= VARIANTS (FIXED) ================= */

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.46, 0.45, 0.94], // ✅ typed-safe easing
    },
  },
};

/* ================= UI HELPERS ================= */

// const NeuCard = ({
//   children,
//   className = "",
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) => (
//   <div
//     className={`bg-[#e8ecf0] rounded-2xl ${className}`}
//     style={{
//       boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff",
//     }}
//   >
//     {children}
//   </div>
// );

const PrimaryButton = ({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`w-full bg-gray-900 text-white py-2.5 rounded-2xl font-semibold text-sm md:text-base flex items-center justify-center gap-2 ${className}`}
    style={{
      boxShadow: "8px 8px 16px #c5cdd5, -6px -6px 12px #ffffff",
    }}
    {...props}
  >
    {children}
  </button>
);

const SecondaryButton = ({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`w-full bg-[#e8ecf0] text-gray-900 py-2.5 rounded-2xl font-semibold text-sm md:text-base flex items-center justify-center gap-2 ${className}`}
    style={{
      boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
    }}
    {...props}
  >
    {children}
  </button>
);

const CustomizableBadge = ({ className = "" }: { className?: string }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 ${className}`}
  >
    <SparklesIcon className="w-3 h-3" />
    Customizable
  </span>
);

/* ================= PRODUCT CARDS ================= */

const ProductCardGrid = ({
  product,
  isWishlisted,
  onToggleWishlist,
}: {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}) => {
  const discountPercentage =
    product.mrp !== "0" && parseFloat(product.mrp) > parseFloat(product.price)
      ? Math.round(
          ((parseFloat(product.mrp) - parseFloat(product.price)) /
            parseFloat(product.mrp)) *
            100
        )
      : 0;

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="show">
      <div
        className="bg-[#e8ecf0] rounded-3xl p-3 flex flex-col h-full"
        style={{
          boxShadow: "16px 16px 32px #c5cdd5, -16px -16px 32px #ffffff",
        }}
      >
        {/* IMAGE */}
        <div className="relative mb-3 rounded-2xl overflow-hidden bg-gray-200">
          <div className="relative w-full h-48">
            <Image
              src={product.images[0] || "/placeholder-product.jpg"}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>

          {/* BADGES */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discountPercentage > 0 && (
              <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                -{discountPercentage}%
              </span>
            )}
            {product.isCustomizable && <CustomizableBadge />}
          </div>

          {/* ACTIONS */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <button
              onClick={() => onToggleWishlist(product.id)}
              className="rounded-full p-2 bg-[#e8ecf0]/80 text-gray-700"
            >
              {isWishlisted ? (
                <HeartSolid className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5" />
              )}
            </button>
            <button className="rounded-full p-2 bg-[#e8ecf0]/80 text-gray-700">
              <EyeIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <h3 className="font-semibold text-sm md:text-base text-gray-900 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-xs text-gray-600 line-clamp-2 mb-1">
          {product.description}
        </p>
        <p className="text-xs font-medium text-gray-800 mb-2">
          {product.businessName}
        </p>

        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarSolid key={star} className="w-3.5 h-3.5 text-yellow-400" />
          ))}
          <span className="text-xs text-gray-500 ml-1">
            ({product.numberOfReviews})
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            ${product.price}
          </span>
          {parseFloat(product.mrp) > parseFloat(product.price) && (
            <span className="text-xs text-gray-500 line-through">
              ${product.mrp}
            </span>
          )}
        </div>

        <div className="flex gap-2 mt-auto">
          <SecondaryButton className="py-2 text-xs">
            <ShoppingCartIcon className="w-4 h-4" />
            Add to Cart
          </SecondaryButton>
          {product.isCustomizable && (
            <PrimaryButton className="py-2 text-xs">
              <WrenchScrewdriverIcon className="w-4 h-4" />
            </PrimaryButton>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ================= MAIN ================= */

const ProductListing = ({
  params,
}: {
  params: Promise<{ categoryid: string }>;
}) => {
  const { categoryid } = use(params);
  // const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchProductsByCategory(categoryid);
      setProducts(res.products);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [categoryid]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  if (loading) return <div className="min-h-screen bg-[#e8ecf0]" />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-[#e8ecf0] px-4 py-8"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {products.map((product) => (
          <ProductCardGrid
            key={product.id}
            product={product}
            isWishlisted={false}
            onToggleWishlist={() => {}}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ProductListing;
