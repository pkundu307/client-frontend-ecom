"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const products = [
  { id: 1, name: "Mattresses", price: "₹2,990", img: "/images/mattress.png" },
  { id: 2, name: "Sofa & Sectional", price: "₹7,999", img: "/images/sofa.png" },
  {
    id: 3,
    name: "Office Study Chairs",
    price: "₹1,890",
    img: "/images/chair.png",
  },
  { id: 4, name: "Beds", price: "₹1,790", img: "/images/bed.png" },
  { id: 5, name: "TV Units", price: "₹1,249", img: "/images/tv.png" },
  { id: 6, name: "Sofa Beds", price: "₹6,099", img: "/images/sofabed.png" },
];

const BasedOnYourActivity = () => {
  return (
    <div className="no-scrollbar">
    <section className="bg-royal-green/80 py-8 h-fit no-scrollbar">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <h2 className="text-2xl font-bold text-royal-gold mb-4">
          Based on Your Activity
        </h2>

        {/* Scrollable Container */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-6">
            {products.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                className="min-w-[160px] md:min-w-[200px] text-center"
              >
                <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md">
                  <Image
                    width={50}
                    height={50}
                    src={item.img}
                    alt={item.name}
                    className="w-full h-40 object-cover"
                  />
                </div>
                <h3 className="text-royal-gold-700 font-medium mt-2">{item.name}</h3>
                <p className="text-royal-gold-900 font-bold">{item.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};

export default BasedOnYourActivity;
