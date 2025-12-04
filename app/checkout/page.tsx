"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { clearSelected } from "../store/cartSlice";
import axios from "axios";
import Image from "next/image";

type Address = {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  contactNumber: string;
};

const COUPON_CODE = "jotto50";
const COUPON_DISCOUNT = 50; // ₹50
const COD_FEE = 30;
const COD_THRESHOLD = 600; // ₹600

// Declare Razorpay on window object
declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage = () => {
  // Add this near your other useState hooks
const progressRef = useRef(0);
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedItems = useSelector((state: RootState) => state.cart.selected);

  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<typeof selectedItems>([]);

  // Address & payment
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online" | "">("");
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // Add Address Modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    contactNumber: ""
  });
  const [savingAddress, setSavingAddress] = useState(false);

  // Coupon
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Slide to Pay
  const [slideProgress, setSlideProgress] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  const slideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!selectedItems || selectedItems.length === 0) {
      router.replace("/cart");
      return;
    }
    setItems(selectedItems.map(item => ({ ...item })));
  }, [mounted, selectedItems, router]);

  // Fetch addresses
  useEffect(() => {
    if (!mounted) return;
    fetchAddresses();
  }, [mounted]);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/addresses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAddresses(data || []);
      if (data && data.length > 0) setSelectedAddressId(data[0].id);
    } catch {
      setAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };


  // Pricing calculations
  const subtotal = items.reduce((sum, item) => sum + Number(item.variant?.price || 0) * item.quantity, 0);
  const codFee = paymentMethod === "cod" && subtotal < COD_THRESHOLD ? COD_FEE : 0;
  const discount = couponApplied ? COUPON_DISCOUNT : 0;
  const total = Math.max(subtotal + codFee - discount, 0);

  const applyCoupon = () => {
    if (couponInput.trim().toLowerCase() === COUPON_CODE) {
      setCouponApplied(true);
      setCouponError(null);
    } else {
      setCouponApplied(false);
      setCouponError("Invalid coupon code.");
    }
  };

  // Add new address
  const handleAddAddress = async () => {
    // Validate fields
    if (!newAddress.street || !newAddress.city || !newAddress.state || 
        !newAddress.postalCode || !newAddress.contactNumber) {
      alert("Please fill all address fields");
      return;
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(newAddress.contactNumber)) {
      alert("Please enter a valid 10-digit contact number");
      return;
    }

    setSavingAddress(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/addresses`,
        newAddress,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await fetchAddresses();
      setSelectedAddressId(res.data.id);
      setShowAddressModal(false);
      setNewAddress({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        contactNumber: ""
      });
    } catch (err) {
      console.error("Failed to add address:", err);
      alert("Failed to add address. Please try again.");
    } finally {
      setSavingAddress(false);
    }
  };

  // Razorpay integration
  const initializeRazorpay = async (orderId: string) => {
    const selectedAddr = addresses.find(a => a.id === selectedAddressId);
    
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your test key
      amount: total * 100, // Amount in paise
      currency: "INR",
      name: "Your Store Name",
      description: "Order Payment",
      order_id: orderId, // Order ID from backend
      handler: async function (response: any) {
        // Payment successful
        try {
          const token = localStorage.getItem("token");
          // Verify payment on backend
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/orders/verify-payment`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          dispatch(clearSelected());
          router.push(`/order-success?orderId=${orderId}`);
        } catch (err) {
          console.error("Payment verification failed:", err);
          alert("Payment verification failed. Please contact support.");
        }
      },
      prefill: {
        name: selectedAddr?.street || "",
        contact: selectedAddr?.contactNumber || "",
      },
      theme: {
        color: "#1e3a8a", // Your brand color
      },
      modal: {
        ondismiss: function() {
          setSlideProgress(0);
          alert("Payment cancelled");
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

 const handleSlide = (e: React.PointerEvent<HTMLDivElement>) => {
    // Prevent default browser behavior (text selection, scrolling)
    e.preventDefault();
    
    // Stop if already submitting
    if (slideProgress > 0.97) return;

    setIsSliding(true);
    const track = slideRef.current;
    if (!track) return;

    const startX = e.clientX;
    const trackWidth = track.offsetWidth - 48; // Width minus knob size

    const onPointerMove = (moveEvent: PointerEvent) => {
      const currentX = moveEvent.clientX;
      // Calculate distance moved from the click point
      const diff = currentX - startX;
      
      // Calculate percentage (0 to 1)
      const newProgress = Math.min(Math.max(diff / trackWidth, 0), 1);
      
      // Update BOTH state (for UI) and Ref (for logic)
      setSlideProgress(newProgress);
      progressRef.current = newProgress;
    };

    const onPointerUp = () => {
      // Remove listeners
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      
      setIsSliding(false);

      // Check the REF, not the state (state is stale in this closure)
      if (progressRef.current > 0.97) {
        setSlideProgress(1); // Snap to end
        setTimeout(handlePlaceOrder, 100);
      } else {
        setSlideProgress(0); // Snap back to start
        progressRef.current = 0;
      }
    };

    // Add global listeners
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

const handlePlaceOrder = async () => {
  if (items.length === 0) {
    alert("Please select at least one item to place the order.");
    return;
  }
  if (!selectedAddressId) {
    alert("Please select a delivery address.");
    return;
  }
  if (!paymentMethod) {
    alert("Please select a payment method.");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const selectedAddr = addresses.find((a) => a.id === selectedAddressId);

    if (!selectedAddr) {
      alert("Selected address not found.");
      return;
    }
// after: const total = Math.max(...);

const cartItemIds = items.map((item) => item.id as string);

    // Common DTO fields
    const dto = {
      selectedAddress: selectedAddr,          // backend expects full address object
      cartItemIds,                            // array of cartItem IDs
      shippingFee: codFee,                    // you can pass 0 if not needed
      taxAmount: 0,                           // adapt if you have tax logic
      discount,                               // coupon discount
    };

    if (paymentMethod === "cod") {
      // COD endpoint
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/place-order/cod`,
        {
          ...dto,
          paymentMethod: "cash_on_delivery",   // must match Prisma enum
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(clearSelected());
      setSlideProgress(0);
      router.push(`/order-success?orderId=${res.data.id}`);
      return;
    }

    // Online payment (existing flow, slightly adjusted)
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/orders`,
      {
        items,
        addressId: selectedAddressId,
        paymentMethod: "online",
        amount: total,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    await initializeRazorpay(res.data.razorpayOrderId);
  } catch (err) {
    console.error("Order creation failed:", err);
    alert("Failed to place order. Please try again.");
    setSlideProgress(0);
  }
};


  if (!mounted) return null;
  if (!items || items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center">
        <span className="text-3xl mb-4 font-bold">No selected items</span>
        <p className="text-gray-500 mb-8">Please select items from your cart.</p>
        <button
          onClick={() => router.push("/cart")}
          className="bg-black text-white px-6 py-3 rounded-lg font-semibold text-base hover:bg-gray-800 transition"
        >
          View Cart
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen w-full bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 py-10 px-3 md:px-10">
          {/* --- Section 1: Product Overview --- */}
          <section className="md:col-span-1 bg-gray-50 p-4 rounded-2xl shadow md:block hidden">
            <h2 className="font-bold text-lg mb-4 text-blue-950">Order Items</h2>
            <ul className="space-y-4">
              {items.map((item, idx) => (
                <li key={item.id} className="flex items-center gap-2">
                  <div className="w-14 h-14 rounded-xl bg-gray-200 overflow-hidden flex items-center justify-center">
                    <Image
                      src={item.variant?.product?.images?.[0] || "/placeholder.png"}
                      alt={item.variant?.product?.title || ""}
                      width={56}
                      height={56}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-semibold text-gray-900">{item.variant?.product?.title}</div>
                    <div className="text-xs text-gray-500">x{item.quantity}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* --- Section 2: Address selection --- */}
          <section className="md:col-span-1 bg-white p-6 rounded-2xl shadow min-h-[340px] mb-6 md:mb-0 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-blue-950">Delivery Address</h1>
              <button
                onClick={() => setShowAddressModal(true)}
                className="text-blue-700 hover:text-blue-900 font-semibold text-sm flex items-center gap-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New
              </button>
            </div>
            
            {loadingAddresses ? (
              <div className="text-gray-500 py-4">Loading addresses...</div>
            ) : addresses.length === 0 ? (
              <div className="text-gray-500 py-4">No saved addresses. Click &quot;Add New&quot; to add one.</div>
            ) : (
              <div className="space-y-3">
                {addresses.map(addr => (
                  <label
                    key={addr.id}
                    className={`block cursor-pointer bg-gray-50 rounded-xl px-5 py-4 border ${
                      selectedAddressId === addr.id
                        ? "border-blue-700 ring-2 ring-blue-200"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mr-4 accent-blue-700"
                    />
                    <div>
                      <div className="font-bold text-black">{addr.street}</div>
                      <div className="text-gray-600 text-sm">
                        {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                      </div>
                      <div className="text-gray-600 text-sm mt-1">
                        📞 {addr.contactNumber}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </section>

          {/* --- Section 3: Pricing, Payment, Coupon, Slide to Pay --- */}
          <section className="md:col-span-1 flex flex-col gap-6 bg-white p-6 rounded-2xl shadow">
            {/* Order Summary */}
            <div className="mb-2">
              <h2 className="text-xl font-bold mb-2 text-blue-950">Order Summary</h2>
              <div className="flex justify-between py-1 text-gray-700">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {paymentMethod === "cod" && subtotal < COD_THRESHOLD && (
                <div className="flex justify-between py-1 text-gray-700">
                  <span>COD fee</span>
                  <span>+₹30</span>
                </div>
              )}
              {couponApplied && (
                <div className="flex justify-between py-1 text-green-700 font-semibold">
                  <span>Coupon ({COUPON_CODE})</span>
                  <span>-₹{COUPON_DISCOUNT}</span>
                </div>
              )}
              <div className="flex justify-between py-2 mt-1 text-black text-lg font-semibold border-t border-gray-200">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment */}
            <div className="mb-4">
              <h2 className="text-base font-bold mb-1 text-blue-950">Payment</h2>
              <div className="flex gap-3">
                <label className={`flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-3 rounded-xl border ${paymentMethod === "cod" ? "border-blue-700 ring-2 ring-blue-200" : "border-gray-200"}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-blue-700"
                  />
                  Cash on Delivery
                </label>
                <label className={`flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-3 rounded-xl border ${paymentMethod === "online" ? "border-blue-700 ring-2 ring-blue-200" : "border-gray-200"}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                    className="accent-blue-700"
                  />
                  Online
                </label>
              </div>
            </div>
            
            {/* Coupon */}
            <div>
              <h2 className="text-base font-bold mb-1 text-blue-950">Have a coupon?</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponInput}
                  onChange={e => {
                    setCouponInput(e.target.value);
                    setCouponApplied(false);
                    setCouponError(null);
                  }}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-base"
                  disabled={couponApplied}
                />
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg font-semibold ${couponApplied ? "bg-green-200 text-green-800" : "bg-blue-900 text-white hover:bg-blue-700"}`}
                  disabled={couponApplied}
                  onClick={applyCoupon}
                >
                  {couponApplied ? "Applied" : "Apply"}
                </button>
              </div>
              {couponError && <p className="mt-2 text-sm text-red-600">{couponError}</p>}
              {couponApplied && <p className="mt-2 text-sm text-green-700">₹50 discount applied!</p>}
            </div>

            {/* Slide to Pay */}
            <div className="mt-auto pt-4 pb-2">
          <div
  ref={slideRef}
  className="w-full h-14 bg-gray-200 rounded-full relative select-none touch-none" // Added touch-none
  style={{
    touchAction: "none", // CRITICAL: Prevents page scrolling while dragging on mobile
    userSelect: "none",
    background:
      isSliding && slideProgress > 0
        ? `linear-gradient(90deg, #1e3a8a ${(slideProgress * 100).toFixed(1)}%, #e5e7eb 0%)` // Changed color to match your blue theme
        : "#e5e7eb",
    transition: isSliding ? "none" : "background 200ms",
  }}
  // Use Pointer Events instead of Mouse/Touch
  onPointerDown={handleSlide}
>
  <div
    style={{
      // Use percentage for left position to match progress
      left: `calc(${slideProgress * 100}% - ${slideProgress * 48}px)`,
      transition: isSliding ? "none" : "left 0.3s",
    }}
    className="absolute z-10 top-1/2 -translate-y-1/2 w-12 h-12 bg-black text-white flex items-center justify-center rounded-full shadow-lg cursor-grab active:cursor-grabbing"
  >
    {slideProgress > 0.97 ? "✓" : "→"}
  </div>
  
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-base font-bold text-gray-700 opacity-80">
    {slideProgress > 0.97 ? "Processing..." : "Slide to Pay"}
  </div>
</div>
            </div>
          </section>
        </div>

        {/* Mobile product overview */}
        <div className="md:hidden mt-8 px-2">
          <h2 className="font-bold text-lg mb-4 text-blue-950">Order Items</h2>
          <div className="flex gap-2 overflow-x-scroll scrollbar-thin">
            {items.map(item => (
              <div key={item.id} className="w-32 shrink-0 bg-white rounded-lg shadow p-3 flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                  <Image
                    src={item.variant?.product?.images?.[0] || "/placeholder.png"}
                    alt={item.variant?.product?.title || ""}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div className="text-xs font-semibold text-gray-900 truncate w-full text-center">{item.variant?.product?.title}</div>
                <span className="text-xs text-gray-600">x{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddressModal(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-950">Add New Address</h2>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter street address"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number</label>
                <input
                  type="tel"
                  value={newAddress.contactNumber}
                  onChange={(e) => setNewAddress({...newAddress, contactNumber: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="PIN Code"
                    maxLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Country"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  disabled={savingAddress}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAddress}
                  className="flex-1 bg-blue-900 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  disabled={savingAddress}
                >
                  {savingAddress ? "Saving..." : "Save Address"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutPage;
