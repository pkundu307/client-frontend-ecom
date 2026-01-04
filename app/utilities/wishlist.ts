// app/utilities/wishlist.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const addToWishlistAPI = async (productId: string, token: string) => {
  const response = await axios.post(
    `${API_URL}/wishlist`,
    { productId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const removeFromWishlistAPI = async (wishlistItemId: string, token: string) => {
  const response = await axios.delete(`${API_URL}/wishlist/${wishlistItemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getWishlistAPI = async (token: string) => {
  const response = await axios.get(`${API_URL}/wishlist`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
