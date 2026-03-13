// src/store/types.ts

// ----------------------------------------------
// Product info within the cart (for UI display)
// ----------------------------------------------
export interface CartProductInfo {
  id: string;
  title: string;
  slug: string;
  images: string[];
  categoryId?: number | null;
  brand?: string | null;
}

// ----------------------------------------------
// Variant info within the cart
// ----------------------------------------------
export interface CartVariantInfo {
  id: string;
  sku?: string | null;
  price: string;
  images: string[];
  productId?: string;
  product: CartProductInfo;
}

// ----------------------------------------------
// Single cart item as returned from API
// ----------------------------------------------
export interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  customizationImages: string[];
  customizationDetails: Record<string, string> | null;
  product?: CartProductInfo | null;
  variant?: CartVariantInfo | null;
}

// ----------------------------------------------
// Cart state shape in Redux
// ----------------------------------------------
export interface CartState {
  items: CartItem[];
  selected: CartItem[];
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// ----------------------------------------------
// Add-to-cart payload structure (frontend → backend)
// ----------------------------------------------
export interface AddToCartPayload {
  productId: string;
  variantId?: string;
  quantity: number;
  customizationImages?: File[];
  customizationDetails?: Record<string, string>;
}

// ----------------------------------------------
// Coupon validate request item shape
// used in useCheckout applyCoupon cartItems[]
// ----------------------------------------------
export interface CouponCartItem {
  productId: string;
  categoryId?: number | null;
  brand?: string | null;
}

// ----------------------------------------------
// Coupon validate API response
// ----------------------------------------------
export interface CouponValidateResponse {
  valid: boolean;
  code: string;
  message?: string;
  discount: {
    calculatedDiscount: number;
    type: string;
    value: number;
  };
  newTotal: number;
}

// ----------------------------------------------
// Coupon state used in useCheckout
// ----------------------------------------------
export interface AppliedCoupon {
  code: string;
  calculatedDiscount: number;
  type: string;
  value: number;
}

// ----------------------------------------------
// Order item shape (from API responses)
// ----------------------------------------------
export interface OrderItem {
  id: string;
  productName: string;
  imageUrl?: string;
  quantity: number;
  price: string;
}

// ----------------------------------------------
// Address shape (shared across checkout + profile)
// ----------------------------------------------
export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  alternativePhoneNumber: string | null;
}

// ----------------------------------------------
// Order success data shape (from place-order API)
// ----------------------------------------------
export interface OrderData {
  id: string;
  orderNumber: string;
  createdAt: string;
  totalAmount: string;
  selectedAddress: Address;
  items: OrderItem[];
  couponCode: string | null;
  couponDiscount: number | null;
}
