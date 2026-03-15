// app/components/InYourWishlist.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getWishlistAPI } from '@/app/utilities/wishlist';

interface WishlistProduct {
  wishlistItemId: string;
  addedAt:        string;
  product: {
    id:       string;
    title:    string;
    slug:     string;
    image:    string;
    category: string;
  };
}

const InYourWishlist = () => {
  const [items, setItems] = useState<WishlistProduct[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    getWishlistAPI(token)
      .then((data: WishlistProduct[]) => setItems(data))
      .catch(() => setItems([]));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-12 px-4 bg-[#e8ecf0]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          In Your Wishlist
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item, index) => (
            <motion.div
              key={item.wishlistItemId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-full"
            >
              <Link href={`/product/${item.product.slug}`} className="block h-full">
                <div
                  className="bg-[#e8ecf0] rounded-xl overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col"
                  style={{
                    boxShadow: '6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff',
                  }}
                >
                  {/* image */}
                  <div className="relative aspect-square flex-shrink-0">
                    <Image
                      src={item.product.image || '/placeholder.png'}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  </div>

                  {/* content */}
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 min-h-[2.5rem]">
                      {item.product.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2 min-h-[2rem]">
                      {item.product.category}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InYourWishlist;
