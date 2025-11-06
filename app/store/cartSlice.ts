// src/store/cartSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { CartState, CartItem, AddToCartPayload } from './types';

/**
 * NOTE:
 * - This file assumes you have `./types` exporting CartState, CartItem, AddToCartPayload.
 * - Adjust API_BASE_URL to match your env / runtime config if needed.
 */

// -----------------------------
// API CONFIG
// -----------------------------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// -----------------------------
// Auth header helper
// -----------------------------
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) return {}; // safe: return empty object when unauthenticated
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// -----------------------------
// Error handler
// -----------------------------
interface ErrorResponse {
  message?: string;
}

const handleAxiosError = (error: unknown, defaultMessage: string): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return axiosError.response?.data?.message || axiosError.message || defaultMessage;
  }
  // Non-axios error
  try {
    return (error as Error).message || defaultMessage;
  } catch {
    return defaultMessage;
  }
};

// -----------------------------
// LocalStorage helpers (guest cart)
// -----------------------------
const GUEST_CART_KEY = 'guest_cart';

const loadCartFromStorage = (): CartItem[] => {
  try {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(GUEST_CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (cart: CartItem[]) => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  } catch {
    /* ignore */
  }
};

// Helper to compare customization (simple deterministic compare)
const sameCustomization = (a?: Record<string, unknown> | null, b?: Record<string, unknown> | null) => {
  try {
    return JSON.stringify(a || {}) === JSON.stringify(b || {});
  } catch {
    return false;
  }
};

// -----------------------------
// Async thunks (server-side)
// -----------------------------

// 1) Fetch cart items
export const fetchCartItems = createAsyncThunk<CartItem[], void, { rejectValue: string }>(
  'cart/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get<CartItem[]>(`${API_BASE_URL}/cart`, getAuthHeaders());
      return res.data;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error, 'Failed to fetch cart.'));
    }
  }
);

// 2) Add item to server (handles multipart uploads)
export const addItemToServer = createAsyncThunk<CartItem, AddToCartPayload, { rejectValue: string }>(
  'cart/addItemToServer',
  async (payload, { rejectWithValue }) => {
    try {
      // Ensure logged in
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) return rejectWithValue('Please log in first.');

      const { productId, variantId, quantity, customizationDetails, customizationImages } = payload;

      const formData = new FormData();
      formData.append('productId', productId);
      if (variantId) formData.append('variantId', variantId);
      formData.append('quantity', quantity.toString());
      if (customizationDetails) formData.append('customizationDetails', JSON.stringify(customizationDetails));

      if (Array.isArray(customizationImages)) {
        customizationImages.forEach((file) => {
          // `file` should be an instance of File in browser
          formData.append('customizationImages', file as File);
        });
      }

      const res = await axios.post<CartItem>(
        `${API_BASE_URL}/cart/add-item`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // DO NOT set Content-Type here — axios sets the correct multipart boundary.
          },
        },
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error, 'Failed to add item to cart.'));
    }
  }
);

// 3) Update item on server (payload `data` may be JSON; if you need to update images, change to multipart)
export const updateItemOnServer = createAsyncThunk<
  CartItem,
  { id: string; data: Partial<AddToCartPayload> },
  { rejectValue: string }
>('cart/updateItemOnServer', async ({ id, data }, { rejectWithValue }) => {
  try {
    // Simple JSON patch/update
    const res = await axios.patch<CartItem>(`${API_BASE_URL}/cart/${id}`, data, getAuthHeaders());
    return res.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error, 'Failed to update cart item.'));
  }
});

// 4) Delete item from server
export const deleteItemFromServer = createAsyncThunk<string, string, { rejectValue: string }>(
  'cart/deleteItemFromServer',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/cart/${id}`, getAuthHeaders());
      return id;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error, 'Failed to remove cart item.'));
    }
  }
);

// -----------------------------
// Slice initial state & helpers
// -----------------------------
const initialState: CartState = {
  items: loadCartFromStorage(),
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Utility to merge a server-returned item into state (replace or push)
const mergeServerItem = (items: CartItem[], newItem: CartItem) => {
  const idx = items.findIndex((i) => i.id === newItem.id);
  if (idx !== -1) {
    items[idx] = newItem;
  } else {
    items.push(newItem);
  }
};

// -----------------------------
// Slice
// -----------------------------
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Toggle authentication status (used to switch guest <> server mode)
    setAuthStatus: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      // If switching to guest mode (false) keep guest storage in sync
      if (!action.payload) saveCartToStorage(state.items);
    },

    // Local-only actions for guest mode
    addItemLocal: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existing = state.items.find(
        (item) =>
          item.productId === newItem.productId &&
          item.variantId === newItem.variantId &&
          sameCustomization(item.customizationDetails, newItem.customizationDetails) &&
          // compare customizationImages arrays by JSON
          JSON.stringify(item.customizationImages || []) === JSON.stringify(newItem.customizationImages || [])
      );

      if (existing) {
        existing.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
      saveCartToStorage(state.items);
    },

    updateItemLocal: (state, action: PayloadAction<{ id: string; data: Partial<CartItem> }>) => {
      const { id, data } = action.payload;
      const idx = state.items.findIndex((i) => i.id === id);
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...data };
        saveCartToStorage(state.items);
      }
    },

    removeItemLocal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveCartToStorage(state.items);
    },

    clearLocalCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
  },

  extraReducers: (builder) => {
    // FETCH
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error fetching cart.';
      });

    // ADD
    builder
      .addCase(addItemToServer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addItemToServer.fulfilled, (state, action: PayloadAction<CartItem>) => {
        state.isLoading = false;
        mergeServerItem(state.items, action.payload);
      })
      .addCase(addItemToServer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error adding to cart.';
      });

    // UPDATE
    builder
      .addCase(updateItemOnServer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateItemOnServer.fulfilled, (state, action: PayloadAction<CartItem>) => {
        state.isLoading = false;
        mergeServerItem(state.items, action.payload);
      })
      .addCase(updateItemOnServer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error updating cart item.';
      });

    // DELETE
    builder
      .addCase(deleteItemFromServer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteItemFromServer.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.items = state.items.filter((i) => i.id !== action.payload);
        // sync guest storage just in case
        saveCartToStorage(state.items);
      })
      .addCase(deleteItemFromServer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error deleting cart item.';
      });
  },
});

// -----------------------------
// Exports
// -----------------------------
export const {
  addItemLocal,
  updateItemLocal,
  removeItemLocal,
  clearLocalCart,
  setAuthStatus,
} = cartSlice.actions;

export default cartSlice.reducer;

// -----------------------------
// Selectors (example)
// -----------------------------
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.isLoading;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;
export const selectUniqueItemCount = (state: { cart: CartState }) => state.cart.items.length;
