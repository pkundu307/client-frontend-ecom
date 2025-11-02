"use client";

import { useEffect } from "react"; // 👈 STEP 1: Import useEffect
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
  updateItemLocal,
  removeItemLocal,
  updateItemOnServer,
  deleteItemFromServer,
  fetchCartItems,      // 👈 STEP 2: Import the thunk and action
  setAuthStatus,
} from "../store/cartSlice";
import { motion } from "framer-motion";
import { TrashIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { CartItem } from "../store/types";

const RoyalCart = () => {
  const dispatch = useDispatch<AppDispatch>();

  // 🛒 Selectors
  const { items: cartItems, isAuthenticated } = useSelector(
    (state: RootState) => state.cart
  );
  console.log("Cart Items from Redux:", cartItems);

  // 👇 STEP 3: ADD THIS useEffect HOOK
  // This effect runs once when the component mounts to sync the auth state
  // and fetch the cart if the user is logged in.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // If a token exists, we assume the user is authenticated.
      // 1. Tell the cart slice to switch to "server mode".
      dispatch(setAuthStatus(true));
      // 2. Fetch the cart items from the server.
      dispatch(fetchCartItems());
    }
  }, [dispatch]); // The dependency array ensures this runs only once on mount.


  // 🧮 Subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.variant?.price || 0) * item.quantity),
    0
  );

  // 🔼🔽 Quantity update handler
  const updateQuantity = (item: CartItem, increment: boolean) => {
    // Prevent updating if the item ID is missing (can happen briefly during sync)
    if (!item.id) return;
    
    const newQty = Math.max(1, item.quantity + (increment ? 1 : -1));

    if (isAuthenticated) {
      // Server mode
      dispatch(
        updateItemOnServer({
          id: item.id,
          data: { quantity: newQty },
        })
      );
    } else {
      // Guest mode
      dispatch(
        updateItemLocal({
          id: item.id,
          data: { quantity: newQty },
        })
      );
    }
  };

  // 🗑️ Remove item handler
  const removeItem = (item: CartItem) => {
    if (!item.id) return;
    
    if (isAuthenticated) {
      dispatch(deleteItemFromServer(item.id));
    } else {
      dispatch(removeItemLocal(item.id));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--royal-green)] text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Cart Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-[var(--royal-gold)] border-b-2 border-[var(--royal-gold)] pb-4">
          Cart
        </h1>

        {/* Responsive Grid Layout */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {cartItems.length === 0 ? (
              <p className="text-center text-[var(--royal-gold)] text-lg font-medium py-12">
                Your cart is empty.
              </p>
            ) : (
              cartItems.map((item) => (
                <motion.div
                  key={item.id} // Ensure item.id is always unique
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
                      src={
                        item.variant?.images?.[0] ||
                        item.variant?.product?.images?.[0] || // Access product images through variant
                        "/placeholder.png"
                      }
                      alt={item.variant?.product?.title || "Cart item"}
                      className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border-2 border-[var(--royal-gold)]"
                    />

                    {/* Item Details */}
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg sm:text-xl font-semibold text-[var(--royal-gold)]">
                        {item.variant?.product?.title || "Product"}
                      </h3>
                      {/* You can add variant details here if needed */}
                      {/* <p className="text-sm opacity-80">{item.variant?.attributeValues?.map(av => av.attributeOption.value).join(', ')}</p> */}
                      
                      {/* Quantity & Price Controls */}
                      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-2 bg-royal-green px-4 py-2 rounded-full">
                          <button
                            onClick={() => updateQuantity(item, false)}
                            className="text-[var(--royal-gold)] hover:text-[var(--royal-gold)]/80"
                          >
                            <ChevronDownIcon className="w-5 h-5" />
                          </button>
                          <span className="text-lg font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item, true)}
                            className="text-[var(--royal-gold)] hover:text-[var(--royal-gold)]/80"
                          >
                            <ChevronUpIcon className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Price */}
                        <p className="text-xl sm:text-2xl font-bold text-[var(--royal-gold)]">
                          $
                          {(
                            Number(item.variant?.price || 0) * item.quantity
                          ).toFixed(2)}
                        </p>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item)}
                          className="text-red-400 hover:text-red-300 transition-colors ml-auto"
                        >
                          <TrashIcon className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="bg-royal-green p-6 sm:p-8 rounded-xl h-fit lg:sticky top-8 border border-[var(--royal-green-light)]">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--royal-gold)] mb-4 sm:mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between text-lg">
                  <span>Subtotal</span>
                  <span className="font-bold text-[var(--royal-gold)]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="py-3 sm:py-4 border-y border-[var(--royal-green-light)]">
                  <div className="flex justify-between mb-1">
                    <span>Shipping</span>
                    <span className="text-[var(--royal-gold)]">Free</span>
                  </div>
                  <p className="text-sm opacity-75">Royal Priority Shipping</p>
                </div>

                <button
                  className="w-full bg-[var(--royal-gold)] text-[var(--royal-green)] py-3 sm:py-4 rounded-xl font-bold 
                  hover:bg-[var(--royal-gold)]/90 transition-colors flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <span className="text-xl sm:text-2xl">→</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoyalCart;