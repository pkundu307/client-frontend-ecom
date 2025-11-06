// src/store/types.ts

// ----------------------------------------------
// Product info within the cart (for UI display)
// ----------------------------------------------
export interface CartProductInfo {
  id: string;
  title: string;
  slug: string;
  images: string[]; // Fallback images
}

// ----------------------------------------------
// Variant info within the cart
// ----------------------------------------------
export interface CartVariantInfo {
  id: string;
  sku?: string;
  price: string; // keep as string/Decimal for precision
  images: string[];
  product: CartProductInfo; // each variant belongs to a product
}

// ----------------------------------------------
// Single cart item as returned from API
// ----------------------------------------------
export interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;

  // ✅ Backend fields
  customizationImages: string[]; // now matches your Prisma model
  customizationDetails: Record<string, ''> | null;

  // ✅ Related data (from include in Prisma)
  product?: CartProductInfo | null;
  variant?: CartVariantInfo | null;
}

// ----------------------------------------------
// Cart state shape in Redux
// ----------------------------------------------
export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean; // toggled on login/logout
}

// ----------------------------------------------
// Add-to-cart payload structure (frontend → backend)
// ----------------------------------------------
export interface AddToCartPayload {
  productId: string;
  variantId?: string;
  quantity: number;

  // ✅ Multiple images, handled as multipart
  customizationImages?: File[];

  // ✅ JSON object (will be stringified before upload)
  customizationDetails?: Record<string, ''>;
}
