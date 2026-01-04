import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

interface WishlistItem {
  wishlistItemId: string;
  addedAt: string;
  product: {
    id: string;
    title: string;
    slug: string;
    image: string | null;
    category: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useWishlistCount = (): number => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fetchCount = async (): Promise<void> => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get<WishlistItem[]>(`${API_URL}/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCount(response.data.length);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Failed to fetch wishlist count:", error.message);
        } else {
          console.error("Failed to fetch wishlist count:", error);
        }
      }
    };

    fetchCount();
  }, []);

  return count;
};
