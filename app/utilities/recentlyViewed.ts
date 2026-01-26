// utilities/recentlyViewed.ts

interface RecentlyViewedProduct {
  id: string;
  title: string;
  image: string;
  description: string;
  slug: string;
}

const STORAGE_KEY = "recentlyViewed";
const MAX_ITEMS = 10;

export const addToRecentlyViewed = (product: RecentlyViewedProduct): void => {
  if (typeof window === "undefined") return;

  try {
    // Get existing list or start fresh
    let products: RecentlyViewedProduct[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    // Remove product if it already exists (to avoid duplicates)
    products = products.filter((p) => p.id !== product.id);

    // Add new product at the front
    products.unshift(product);

    // Keep only last 10 items
    products = products.slice(0, MAX_ITEMS);

    // Save back to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error("Failed to save to recently viewed:", error);
  }
};

export const getRecentlyViewed = (): RecentlyViewedProduct[] => {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch (error) {
    console.error("Failed to get recently viewed:", error);
    return [];
  }
};

export const removeFromRecentlyViewed = (productId: string): void => {
  if (typeof window === "undefined") return;

  try {
    let products: RecentlyViewedProduct[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    products = products.filter((p) => p.id !== productId);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error("Failed to remove from recently viewed:", error);
  }
};

export const clearRecentlyViewed = (): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear recently viewed:", error);
  }
};
