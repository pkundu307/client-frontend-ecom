// src/store/types.ts

// ----------------------------------------------
// Business info (full — from product detail page)
// ----------------------------------------------
export interface CartProductBusiness {
  id: string;
  name: string;
  state: string;
  stateCode?: string | null;
  // ── NEW from product detail ──
  gstNumber?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  phone?: string | null;
  isVerified?: boolean;
}

// ----------------------------------------------
// Category parent
// ----------------------------------------------
export interface CartCategoryParent {
  id: number;
  name: string;
  slug: string;
}

// ----------------------------------------------
// Category info
// ----------------------------------------------
export interface CartCategory {
  id: number;
  name: string;
  slug: string;
  parent?: CartCategoryParent | null;
}

// ----------------------------------------------
// Attribute option inside variant
// ----------------------------------------------
export interface CartAttributeOption {
  id: number;
  value: string;
  slug: string;
  attributeId?: number;
  position?: number;
}

export interface CartAttribute {
  id: number;
  name: string;
  categoryId?: number;
  position?: number;
}

export interface CartAttributeValue {
  id: number;
  variantId: string;
  attributeOptionId: number;
  attributeId: number;
  attribute: CartAttribute;
  attributeOption: CartAttributeOption;
}

// ----------------------------------------------
// Variant dimensions (for shipping calculation)
// ----------------------------------------------
export interface CartVariantDimensions {
  weightInGrams: number | null;       // actual weight
  dimensionUnit: string | null;       // CM / IN
  height: string | null;
  length: string | null;
  width: string | null;
}

// ----------------------------------------------
// Variant info within the cart
// OLD fields kept + dimensions/weight added
// ----------------------------------------------
export interface CartVariantInfo {
  id: string;
  sku?: string | null;
  price: string;
  images: string[];
  productId?: string;
  product: CartProductInfo;
  // ── weight & dimensions (for shipping) ──
  weightInGrams?: number | null;
  dimensionUnit?: string | null;
  height?: string | null;
  length?: string | null;
  width?: string | null;
  // ── pricing ──
  mrp?: string | null;
  tax?: string | null;
  purchasePrice?: string | null;
  purchasePriceType?: string | null;
  // ── stock ──
  stock?: number;
  isDefault?: boolean;
  minStockCount?: string | null;
  isMinStockAlertEnabled?: boolean | null;
  status?: string;
  // ── misc ──
  description?: string | null;
  hsnCode?: string | null;
  sacCode?: string | null;
  isBatchingEnabled?: boolean;
  isExpiryTracked?: boolean;
  isSerialTracked?: boolean;
  expiryAlertDays?: number | null;
  stockDeductionMethod?: string;
  deletedAt?: string | null;
  attributeValues?: CartAttributeValue[];
}

// ----------------------------------------------
// Product info within the cart
// OLD fields kept + full product detail fields added
// ----------------------------------------------
export interface CartProductInfo {
  id: string;
  title: string;
  slug: string;
  images: string[];
  categoryId?: number | null;
  brand?: string | null;
  // ── NEW from product detail ──
  description?: string | null;
  isCustomizable?: boolean;
  isPublished?: boolean;
  isFeatured?: boolean;
  isArable?: boolean;
  businessId?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  tags?: string[];
  productType?: string;
  model3dUrl?: string | null;
  licenseDocumentUrl?: string | null;
  customizationConfig?: Record<string, unknown> | null;
  publishDate?: string | null;
  deletedAt?: string | null;
  // ── relations ──
  business?: CartProductBusiness | null;
  category?: CartCategory | null;
}

// ----------------------------------------------
// Single cart item as returned from API
// OLD fields kept + supply state + weight snapshot
// ----------------------------------------------
export interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  customizationImages: string[];
  customizationDetails: Record<string, unknown> | null;
  // ── old optional relations ──
  product?: CartProductInfo | null;
  variant?: CartVariantInfo | null;
  // ── supply state snapshot ──
  customerUserId?: string;
  supplyState?: string | null;
  supplyStateCode?: string | null;
  // ── weight/dimension snapshot (set from product detail page) ──
  // These mirror variant dimensions — stored here for easy shipping calc
  snapshotWeightInGrams?: number | null;
  snapshotDimensionUnit?: string | null;
  snapshotHeight?: string | null;
  snapshotLength?: string | null;
  snapshotWidth?: string | null;
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
  stateCode?: string | null;
  landmark?: string | null;
  isDefault?: boolean;
  type?: string;
  latitude?: number | null;
  longitude?: number | null;
  notes?: string | null;
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
