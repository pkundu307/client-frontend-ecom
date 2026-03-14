// src/app/checkout/useCheckout.ts
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { RootState } from "../store/store";
import { clearSelected } from "../store/cartSlice";
import type { Address } from "../store/types";
import { calculateShipping, ShippingResult } from "./shippingCalculator";

export type { Address };
export type PaymentMethod = "cod" | "online" | "";

const COD_FEE        = 30;
const COD_THRESHOLD  = 600;
const PLATFORM_FEE   = 4;
const PACKAGING_FEE = 8.5;
type RazorpayHandlerResponse = {
  razorpay_order_id:  string;
  razorpay_payment_id: string;
  razorpay_signature:  string;
};

interface OrderItem {
  productName: string;
  imageUrl:    string;
  quantity:    number;
  price:       string;
}

interface OrderData {
  id:              string;
  orderNumber:     string;
  createdAt:       string;
  totalAmount:     string;
  selectedAddress: Address;
  items:           OrderItem[];
  couponCode:      string | null;
  couponDiscount:  number | null;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open:  () => void;
      close: () => void;
    };
  }
}

const emptyNewAddress = () => ({
  street:                 "",
  city:                   "",
  state:                  "",
  postalCode:             "",
  country:                "India",
  landmark:               "",
  alternativePhoneNumber: "",
  type:                   "HOME",
  isDefault:              false,
});

export const useCheckout = () => {
  const router   = useRouter();
  const dispatch = useDispatch();
  const selectedItems = useSelector((state: RootState) => state.cart.selected);

  const [mounted,   setMounted]   = useState(false);
  const [items,     setItems]     = useState<typeof selectedItems>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [paymentMethod,     setPaymentMethod]      = useState<PaymentMethod>("");
  const [loadingAddresses,  setLoadingAddresses]   = useState(false);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress,       setNewAddress]       = useState(emptyNewAddress());
  const [savingAddress,    setSavingAddress]    = useState(false);

  // ── Coupon ────────────────────────────────────────────
  const [couponInput,   setCouponInput]   = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError,   setCouponError]   = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponData,    setCouponData]    = useState<{
    code:               string;
    calculatedDiscount: number;
    type:               string;
    value:              number;
  } | null>(null);

  // ── Shipping ──────────────────────────────────────────
  const [shippingResult, setShippingResult] = useState<ShippingResult | null>(null);

  // ── Slide / Order ─────────────────────────────────────
  const [slideProgress,  setSlideProgress]  = useState(0);
  const [isSliding,      setIsSliding]      = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const slideRef    = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderData,        setOrderData]        = useState<OrderData | null>(null);

  // ── Boot ──────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    const script   = document.createElement("script");
    script.src     = "https://checkout.razorpay.com/v1/checkout.js";
    script.async   = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!selectedItems || selectedItems.length === 0) {
      if (!showSuccessModal) router.replace("/cart");
      return;
    }
    setItems(selectedItems.map((item) => ({ ...item })));
  }, [mounted, selectedItems, router, showSuccessModal]);

  useEffect(() => {
    if (!mounted) return;
    void fetchAddresses();
  }, [mounted]);

  // ── Recalculate shipping when address or items change ──
  useEffect(() => {
    if (!selectedAddressId || items.length === 0) {
      setShippingResult(null);
      return;
    }
    const address = addresses.find((a) => a.id === selectedAddressId);
    if (!address) return;
    const result = calculateShipping(items, address);
    setShippingResult(result);
  }, [selectedAddressId, items, addresses]);

  // ── Fetch addresses ────────────────────────────────────
  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/addresses`,
        { headers: { Authorization: `Bearer ${token ?? ""}` } }
      );
      const data: Address[] = (await res.json()) as Address[];
      setAddresses(data || []);
      if (data && data.length > 0) {
        const def = data.find((a) => a.isDefault) ?? data[0];
        setSelectedAddressId(def.id);
      }
    } catch {
      setAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // ── Pricing ────────────────────────────────────────────
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.variant?.price ?? 0) * item.quantity,
    0
  );

  const isFreeShippingCoupon =
    couponApplied && couponData?.type === "free_shipping";

  const shippingFee = isFreeShippingCoupon
    ? 0
    : (shippingResult?.totalShippingCharge ?? 0);

  const codFee =
    paymentMethod === "cod" && subtotal < COD_THRESHOLD ? COD_FEE : 0;

  const discount =
    couponApplied && couponData ? couponData.calculatedDiscount : 0;

  const total = Math.max(
    subtotal + shippingFee + codFee + PACKAGING_FEE + PLATFORM_FEE - discount,
    0
  );

  // ── Apply coupon ───────────────────────────────────────
  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }
    setCouponLoading(true);
    setCouponError(null);
    setCouponApplied(false);
    setCouponData(null);

    try {
      const cartItems = items.map((item) => ({
        productId:  item.productId ?? item.variant?.productId ?? "",
        categoryId: item.variant?.product?.categoryId ?? undefined,
        brand:      item.variant?.product?.brand ?? undefined,
      }));

      const res  = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/coupons/validate`,
        { code, subtotal, cartItems }
      );
      const data = res.data as {
        code: string;
        discount: { calculatedDiscount: number; type: string; value: number };
      };

      setCouponData({
        code:               data.code,
        calculatedDiscount: data.discount.calculatedDiscount,
        type:               data.discount.type,
        value:              data.discount.value,
      });
      setCouponApplied(true);
      setCouponError(null);
    } catch (err: unknown) {
      setCouponApplied(false);
      setCouponData(null);
      if (axios.isAxiosError(err)) {
        setCouponError(
          (err.response?.data as { message?: string })?.message ??
          "Invalid coupon code."
        );
      } else {
        setCouponError("Failed to validate coupon. Try again.");
      }
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponApplied(false);
    setCouponData(null);
    setCouponInput("");
    setCouponError(null);
  };

  // ── Add address ────────────────────────────────────────
  const handleAddAddress = async () => {
    if (
      !newAddress.street ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.postalCode ||
      !newAddress.alternativePhoneNumber
    ) {
      alert("Please fill all required address fields");
      return;
    }
    if (!/^\d{10}$/.test(newAddress.alternativePhoneNumber)) {
      alert("Please enter a valid 10-digit contact number");
      return;
    }

    setSavingAddress(true);
    try {
      const token = localStorage.getItem("token");
      const res   = await axios.post<{ id: string }>(
        `${process.env.NEXT_PUBLIC_API_URL}/user/addresses`,
        newAddress,
        { headers: { Authorization: `Bearer ${token ?? ""}` } }
      );
      await fetchAddresses();
      setSelectedAddressId(res.data.id);
      setShowAddressModal(false);
      setNewAddress(emptyNewAddress());
    } catch (err) {
      console.error("Failed to add address:", err);
      alert("Failed to add address. Please try again.");
    } finally {
      setSavingAddress(false);
    }
  };

  // ── Order success ──────────────────────────────────────
  const showOrderSuccess = (data: OrderData) => {
    setOrderData(data);
    setShowSuccessModal(true);
  };

  // ── Razorpay init ──────────────────────────────────────
  const initializeRazorpay = async (orderId: string) => {
    const selectedAddr = addresses.find((a) => a.id === selectedAddressId);
    const options = {
      key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount:      total * 100,
      currency:    "INR",
      name:        "Jottosop",
      description: "Order Payment",
      order_id:    orderId,
      handler: async (response: RazorpayHandlerResponse) => {
        try {
          const token     = localStorage.getItem("token");
          const verifyRes = await axios.post<{ order: OrderData }>(
            `${process.env.NEXT_PUBLIC_API_URL}/payment/verify`,
            {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            },
            { headers: { Authorization: `Bearer ${token ?? ""}` } }
          );
          setSlideProgress(0);
          setIsPlacingOrder(false);
          dispatch(clearSelected());
          showOrderSuccess(verifyRes.data.order);
        } catch (err) {
          console.error("Payment verification failed:", err);
          alert("Payment verification failed. Please contact support.");
          setSlideProgress(0);
          setIsPlacingOrder(false);
        }
      },
      prefill: {
        name:    selectedAddr?.street ?? "",
        contact: selectedAddr?.alternativePhoneNumber ?? "",
      },
      theme: { color: "#1e3a8a" },
      modal: {
        ondismiss: () => {
          setSlideProgress(0);
          setIsPlacingOrder(false);
        },
      },
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  // ── Place order ────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (isPlacingOrder)       return;
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
    if (!shippingResult) {
      alert("Shipping is still being calculated. Please wait.");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const token        = localStorage.getItem("token");
      const selectedAddr = addresses.find((a) => a.id === selectedAddressId);
      if (!selectedAddr) {
        alert("Selected address not found.");
        setIsPlacingOrder(false);
        return;
      }

      // ── COD flow ────────────────────────────────────────
      if (paymentMethod === "cod") {
        const cartItemIds = items.map((item) => item.id);
        const dto: Record<string, unknown> = {
          selectedAddress: selectedAddr,
          cartItemIds,
          paymentMethod:   "cash_on_delivery",
          shippingFee:     shippingFee + codFee,
          platformFee:     PLATFORM_FEE,
          taxAmount:       0,
          discount,
        };
        if (couponApplied && couponData) {
          dto.couponCode     = couponData.code;
          dto.couponDiscount = couponData.calculatedDiscount;
        }

        const res = await axios.post<OrderData>(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/place-order/cod`,
          dto,
          { headers: { Authorization: `Bearer ${token ?? ""}` } }
        );

        setSlideProgress(0);
        setIsPlacingOrder(false);
        dispatch(clearSelected());
        showOrderSuccess(res.data);
        return;
      }

      // ── Online flow ──────────────────────────────────────
      const payload = {
        items: items.map((item) => ({
          variantId: item.variant?.id ?? "",
          quantity:  item.quantity,
        })),
        selectedAddressId: selectedAddressId, 
        couponCode: couponApplied && couponData ? couponData.code : "",
      };

      const initiateRes = await axios.post<{ razorpayOrder: { id: string } }>(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/initiate`,
        payload,
        { headers: { Authorization: `Bearer ${token ?? ""}` } }
      );

      await initializeRazorpay(initiateRes.data.razorpayOrder.id);
    } catch (err) {
      console.error("Order/payment initiation failed:", err);
      alert("Failed to initiate payment. Please try again.");
      setSlideProgress(0);
      setIsPlacingOrder(false);
    }
  };

  // ── Slide handler ──────────────────────────────────────
  const handleSlide = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (slideProgress > 0.97 || isPlacingOrder) return;
    setIsSliding(true);
    const track = slideRef.current;
    if (!track) return;
    const startX     = e.clientX;
    const trackWidth = track.offsetWidth - 56;

    const onPointerMove = (ev: PointerEvent) => {
      const newProgress = Math.min(Math.max((ev.clientX - startX) / trackWidth, 0), 1);
      setSlideProgress(newProgress);
      progressRef.current = newProgress;
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup",   onPointerUp);
      setIsSliding(false);
      if (progressRef.current > 0.97) {
        setSlideProgress(1);
        setTimeout(() => void handlePlaceOrder(), 100);
      } else {
        setSlideProgress(0);
        progressRef.current = 0;
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup",   onPointerUp);
  };

  const handleSuccessOk = () => {
    setShowSuccessModal(false);
    setOrderData(null);
    router.push("/");
  };

  return {
    mounted,
    items,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    paymentMethod,
    setPaymentMethod,
    loadingAddresses,
    showAddressModal,
    setShowAddressModal,
    newAddress,
    setNewAddress,
    savingAddress,
    // coupon
    couponInput,
    setCouponInput,
    couponApplied,
    couponError,
    couponLoading,
    couponData,
    applyCoupon,
    removeCoupon,
    // shipping
    shippingResult,
    isFreeShippingCoupon,
    // pricing
    subtotal,
    shippingFee,
    codFee,
    platformFee:  PLATFORM_FEE,
    packagingFee: PACKAGING_FEE,
    discount,
    total,
    // slide / place order
    slideRef,
    slideProgress,
    isSliding,
    isPlacingOrder,
    handleSlide,
    handlePlaceOrder,
    handleAddAddress,
    // modals
    showSuccessModal,
    orderData,
    handleSuccessOk,
  };
};
