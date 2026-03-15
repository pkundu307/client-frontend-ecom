// app/product/[productId]/(component)/SimilarProducts.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

interface SimilarVariant {
  id:    string;
  price: string;
  mrp:   string | null;
  stock: number;
  image: string | null;
}

interface SimilarProduct {
  id:      string;
  title:   string;
  slug:    string;
  images:  string[];
  brand:   string | null;
  score:   number;
  variant: SimilarVariant;
}

interface Props {
  slug:              string | null | undefined;
  currentProductId?: string;
}

const SimilarProducts = ({ slug, currentProductId }: Props) => {
  const [products, setProducts] = useState<SimilarProduct[]>([]);

  useEffect(() => {
    if (!slug) return;
    axios
      .get<SimilarProduct[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/products/same/${slug}`,
        { params: { limit: 10 } },
      )
      .then((res) =>
        setProducts(res.data.filter((p) => p.id !== currentProductId)),
      )
      .catch(() => setProducts([]));
  }, [slug, currentProductId]);

  if (products.length === 0) return null;

  return (
    <section className="py-12 px-4 bg-[#e8ecf0]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          Similar Products
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product, index) => {
            const price    = parseFloat(product.variant.price);
            const mrp      = product.variant.mrp ? parseFloat(product.variant.mrp) : null;
            const discount = mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
            const image    = product.variant.image ?? product.images?.[0] ?? '/placeholder.png';

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <Link href={`/product/${product.slug}`} className="block h-full">
                  <div
                    className="bg-[#e8ecf0] rounded-xl overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col"
                    style={{
                      boxShadow: '6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff',
                    }}
                  >
                    {/* image */}
                    <div className="relative aspect-square flex-shrink-0">
                      <Image
                        src={image}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                      {discount > 0 && (
                        <span className="absolute top-2 left-2 bg-green-500 text-white
                                         text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow">
                          {discount}% off
                        </span>
                      )}
                    </div>

                    {/* content */}
                    <div className="p-3 flex flex-col flex-1">
                      <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 min-h-[2.5rem]">
                        {product.title}
                      </h3>

                      {product.brand && (
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {product.brand}
                        </p>
                      )}

                      {/* price */}
                      <div className="flex items-center gap-2 mt-auto pt-2">
                        <span className="font-bold text-sm text-gray-900">
                          ₹{price.toFixed(0)}
                        </span>
                        {mrp && mrp > price && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{mrp.toFixed(0)}
                          </span>
                        )}
                      </div>

                      {product.variant.stock > 0 && product.variant.stock <= 5 && (
                        <p className="text-orange-500 text-[10px] font-medium mt-1">
                          Only {product.variant.stock} left!
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SimilarProducts;
