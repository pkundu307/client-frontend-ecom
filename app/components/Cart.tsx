"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrashIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
const RoyalCart = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Royal Velvet Cushion', price: 149.99, quantity: 2, image: '/cushion.jpg' },
    { id: 2, name: 'Gilded Tea Set', price: 299.99, quantity: 1, image: '/tea-set.jpg' },
  ]);

  const updateQuantity = (id: number, increment: boolean) => {
    setCartItems(items => items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + (increment ? 1 : -1)) } : item
    ));
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
<div className="min-h-screen bg--[var(--royal-gold)] text-[var(--foreground)]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    {/* Cart Heading */}
    <h1 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-[var(--royal-gold)] border-b-2 border-[var(--royal-gold)] pb-4">
      Cart
    </h1>

    {/* Responsive Grid Layout */}
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Cart Items - Span 2 Columns on Large Screens */}
      <div className="lg:col-span-2 space-y-4 sm:space-y-6">
        {cartItems.map(item => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-opacity-20 backdrop-blur-lg rounded-xl p-4 sm:p-6 shadow-lg border border-[var(--royal-green-light)]"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              {/* Image */}
              <Image
                width={128}
                height={128}
                src={item.image} 
                alt={item.name}
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border-2 border-[var(--royal-gold)]"
              />

              {/* Item Details */}
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-semibold text-[var(--royal-gold)]">{item.name}</h3>

                {/* Quantity & Price Controls */}
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-2 bg-royal-green px-4 py-2 rounded-full">
                    <button 
                      onClick={() => updateQuantity(item.id, false)}
                      className="text-[var(--royal-gold)] hover:text-[var(--royal-gold)]/80"
                    >
                      <ChevronDownIcon className="w-5 h-5" />
                    </button>
                    <span className="text-lg font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, true)}
                      className="text-[var(--royal-gold)] hover:text-[var(--royal-gold)]/80"
                    >
                      <ChevronUpIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Price */}
                  <p className="text-xl sm:text-2xl font-bold text-[var(--royal-gold)]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Order Summary - Sticks on Large Screens */}
      <div className="bg-royal-green p-6 sm:p-8 rounded-xl h-fit lg:sticky top-8 border border-[var(--royal-green-light)]">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--royal-gold)] mb-4 sm:mb-6">Order Summary</h2>

        <div className="space-y-3 sm:space-y-4">
          {/* Subtotal */}
          <div className="flex justify-between text-lg">
            <span>Subtotal</span>
            <span className="font-bold text-[var(--royal-gold)]">${subtotal.toFixed(2)}</span>
          </div>

          {/* Shipping */}
          <div className="py-3 sm:py-4 border-y border-[var(--royal-green-light)]">
            <div className="flex justify-between mb-1">
              <span>Shipping</span>
              <span className="text-[var(--royal-gold)]">Free</span>
            </div>
            <p className="text-sm opacity-75">Royal Priority Shipping</p>
          </div>

          {/* Checkout Button */}
          <button className="w-full bg-[var(--royal-gold)] text-[var(--royal-green)] py-3 sm:py-4 rounded-xl font-bold 
            hover:bg-[var(--royal-gold)]/90 transition-colors flex items-center justify-center gap-2"
          >
            Proceed to Checkout
            <span className="text-xl sm:text-2xl">→</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default RoyalCart;