"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { RootState } from "../store/store";
import { clearSelected } from "../store/cartSlice";

export type Address = {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  alternativePhoneNumber: string | null;
};

export type PaymentMethod = "cod" | "online" | "";

const COUPON_CODE = "jotto50";
const COUPON_DISCOUNT = 50;
const COD_FEE = 30;
const COD_THRESHOLD = 600;

type RazorpayHandlerResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

interface OrderItem {
  productName: string;
  imageUrl: string;
  quantity: number;
  price: string;
}

interface OrderData {
  id: string;
  orderNumber: string;
  createdAt: string;
  totalAmount: string;
  selectedAddress: Address;
  items: OrderItem[];
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      close: () => void;
    };
  }
}

export const useCheckout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedItems = useSelector((state: RootState) => state.cart.selected);

  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<typeof selectedItems>([]);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("");
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    alternativePhoneNumber: "",
  });
  const [savingAddress, setSavingAddress] = useState(false);

  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [slideProgress, setSlideProgress] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const slideRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);

  // Order Success Modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  // Mount + load Razorpay script
  useEffect(() => {
    setMounted(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // sync items
  useEffect(() => {
    if (!mounted) return;
    if (!selectedItems || selectedItems.length === 0) {
      // Don't redirect if success modal is showing
      if (!showSuccessModal) {
        router.replace("/cart");
      }
      return;
    }
    setItems(selectedItems.map((item) => ({ ...item })));
  }, [mounted, selectedItems, router, showSuccessModal]);

  // fetch addresses
  useEffect(() => {
    if (!mounted) return;
    void fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/addresses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data: Address[] = await res.json();
      setAddresses(data || []);
      if (data && data.length > 0) setSelectedAddressId(data[0].id);
    } catch {
      setAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // pricing
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.variant?.price || 0) * item.quantity,
    0
  );
  const codFee =
    paymentMethod === "cod" && subtotal < COD_THRESHOLD ? COD_FEE : 0;
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

  const handleAddAddress = async () => {
    if (
      !newAddress.street ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.postalCode ||
      !newAddress.alternativePhoneNumber
    ) {
      alert("Please fill all address fields");
      return;
    }

    if (!/^\d{10}$/.test(newAddress.alternativePhoneNumber)) {
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
        alternativePhoneNumber: "",
      });
    } catch (err) {
      console.error("Failed to add address:", err);
      alert("Failed to add address. Please try again.");
    } finally {
      setSavingAddress(false);
    }
  };

  const showOrderSuccess = (data: OrderData) => {
    setOrderData(data);
    setShowSuccessModal(true);
  };

  const initializeRazorpay = async (orderId: string) => {
    const selectedAddr = addresses.find((a) => a.id === selectedAddressId);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: total * 100,
      currency: "INR",
      name: "Jottosop",
      description: "Order Payment",
      order_id: orderId,
      handler: async (response: RazorpayHandlerResponse) => {
        try {
          const token = localStorage.getItem("token");
          const verifyRes = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/payment/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const data = verifyRes.data?.order;

          setSlideProgress(0);
          setIsPlacingOrder(false);
          
          // Clear cart first
          dispatch(clearSelected());
          
          // Then show success modal
          showOrderSuccess(data);
        } catch (err) {
          console.error("Payment verification failed:", err);
          alert("Payment verification failed. Please contact support.");
          setSlideProgress(0);
          setIsPlacingOrder(false);
        }
      },
      prefill: {
        name: selectedAddr?.street || "",
        contact: selectedAddr?.alternativePhoneNumber || "",
      },
      theme: {
        color: "#1e3a8a",
      },
      modal: {
        ondismiss: function () {
          setSlideProgress(0);
          setIsPlacingOrder(false);
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return;

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

    setIsPlacingOrder(true);

    try {
      const token = localStorage.getItem("token");
      const selectedAddr = addresses.find((a) => a.id === selectedAddressId);

      if (!selectedAddr) {
        alert("Selected address not found.");
        setIsPlacingOrder(false);
        return;
      }

      // COD FLOW
      if (paymentMethod === "cod") {
        const cartItemIds = items.map((item) => item.id as string);

        const dto = {
          selectedAddress: selectedAddr,
          cartItemIds,
          shippingFee: codFee,
          taxAmount: 0,
          discount,
        };

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/place-order/cod`,
          {
            ...dto,
            paymentMethod: "cash_on_delivery",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = res.data;

        setSlideProgress(0);
        setIsPlacingOrder(false);
        
        // Clear cart first
        dispatch(clearSelected());
        
        // Then show success modal
        showOrderSuccess(data);
        return;
      }

      // ONLINE FLOW
      const payload = {
        items: items.map((item) => ({
          variantId: item.variant?.id ?? "",
          quantity: item.quantity,
        })),
        couponCode: "",
      };

      const initiateRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/initiate`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const razorpayOrder = initiateRes.data.razorpayOrder;

      await initializeRazorpay(razorpayOrder.id);
    } catch (err) {
      console.error("Order/payment initiation failed:", err);
      alert("Failed to initiate payment. Please try again.");
      setSlideProgress(0);
      setIsPlacingOrder(false);
    }
  };

  const handleSlide = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (slideProgress > 0.97 || isPlacingOrder) return;

    setIsSliding(true);
    const track = slideRef.current;
    if (!track) return;

    const startX = e.clientX;
    const trackWidth = track.offsetWidth - 56;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const currentX = moveEvent.clientX;
      const diff = currentX - startX;
      const newProgress = Math.min(Math.max(diff / trackWidth, 0), 1);
      setSlideProgress(newProgress);
      progressRef.current = newProgress;
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
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
    window.addEventListener("pointerup", onPointerUp);
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
    couponInput,
    setCouponInput,
    couponApplied,
    couponError,
    applyCoupon,
    handleAddAddress,
    subtotal,
    codFee,
    discount,
    total,
    slideRef,
    slideProgress,
    isSliding,
    isPlacingOrder,
    handleSlide,
    handlePlaceOrder,
    showSuccessModal,
    orderData,
    handleSuccessOk,
  };
};
