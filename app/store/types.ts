// types.ts

// Define the structure of the product/variant data returned in the cart
interface CartProductInfo {
    id: string;
    title: string;
    slug: string;
    images: string[]; // Added: Essential for fallback images
}

interface CartVariantInfo {
    id: string;
    sku: string;
    price: string; // Keep as string/Decimal for accurate finance handling
    images: string[];
    product: CartProductInfo;
}

// Matches the structure returned by GET /cart
export interface CartItem {
    id: string;
    productId: string;
    variantId: string | null;
    quantity: number;
    customizationImage: string | null;
    customizationDetails: unknown | null; // JSON object
    
    // Included relations from the API response
    product: CartProductInfo | null; // Added: Makes `item.product.title` valid
    variant: CartVariantInfo | null; 
}

// Defines the shape of the entire Redux state slice for the cart
export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean; // toggled when user logs in/out
}

// Defines the shape of the data needed for the add to cart API call
export interface AddToCartPayload {
    productId: string;
    variantId?: string;
    quantity: number;
    customizationImage?: string;
    customizationDetails?: string; // JSON string
}