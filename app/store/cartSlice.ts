import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { CartState, CartItem, AddToCartPayload } from './types';

// ===================================================
// 🔧 API CONFIGURATION
// ===================================================

const API_BASE_URL = 'http://localhost:3001';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// ===================================================
// 🔧 ERROR HANDLER
// ===================================================

interface ErrorResponse {
  message?: string;
}

const handleAxiosError = (error: unknown, defaultMessage: string): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return axiosError.response?.data?.message || defaultMessage;
  }
  return defaultMessage;
};

// ===================================================
// 🌐 ASYNC THUNKS (SERVER-MODE)
// ===================================================

// 1️⃣ Fetch all cart items
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
export const selectUniqueItemCount = (state: { cart: CartState }) =>
  state.cart.items.length;
// 2️⃣ Add item to server cart
export const addItemToServer = createAsyncThunk<CartItem, AddToCartPayload, { rejectValue: string }>(
  'cart/addItemToServer',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post<CartItem>(`${API_BASE_URL}/cart/add-item`, payload, {
        ...getAuthHeaders(),
        headers: { ...getAuthHeaders().headers, 'Content-Type': 'application/json' },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error, 'Failed to add item to cart.'));
    }
  }
);

// 3️⃣ Update item quantity / customization
export const updateItemOnServer = createAsyncThunk<
  CartItem,
  { id: string; data: Partial<AddToCartPayload> },
  { rejectValue: string }
>('cart/updateItemOnServer', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axios.patch<CartItem>(`${API_BASE_URL}/cart/${id}`, data, getAuthHeaders());
    return res.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error, 'Failed to update cart item.'));
  }
});

// 4️⃣ Delete item from server cart
export const deleteItemFromServer = createAsyncThunk<
  string, // return deleted item id
  string, // payload = id
  { rejectValue: string }
>('cart/deleteItemFromServer', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_BASE_URL}/cart/${id}`, getAuthHeaders());
    return id;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error, 'Failed to remove cart item.'));
  }
});

// ===================================================
// 🧱 LOCAL STORAGE HELPERS (GUEST-MODE)
// ===================================================

const loadCartFromStorage = (): CartItem[] => {
  try {
    const data = localStorage.getItem('guest_cart');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (cart: CartItem[]) => {
  localStorage.setItem('guest_cart', JSON.stringify(cart));
};

// ===================================================
// 🧩 SLICE SETUP
// ===================================================

const initialState: CartState = {
  items: loadCartFromStorage(),
  isLoading: false,
  error: null,
  isAuthenticated: false, // toggled on login/logout
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // ---------------------------------------------
    // 🧭 AUTH MODE TOGGLE
    // ---------------------------------------------
    setAuthStatus: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },

    // ---------------------------------------------
    // 🛒 LOCAL CART ACTIONS (GUEST)
    // ---------------------------------------------
    addItemLocal: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
        // Check for existing item with same productId, variantId, and customizationImage
      const existing = state.items.find(
        (item) =>
          item.productId === newItem.productId &&
          item.variantId === newItem.variantId &&
          item.customizationImage === newItem.customizationImage
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
      const item = state.items.find((i) => i.id === id);
      if (item) {
        Object.assign(item, data);
      }
      saveCartToStorage(state.items);
    },

    removeItemLocal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveCartToStorage(state.items);
    },

    clearLocalCart: (state) => {
      state.items = [];
      localStorage.removeItem('guest_cart');
    },
  },

  extraReducers: (builder) => {
    // =============================================
    // 🌐 SERVER CART HANDLING
    // =============================================

    // FETCH CART
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error fetching cart.';
      });

    // ADD ITEM
    builder
      .addCase(addItemToServer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addItemToServer.fulfilled, (state, action) => {
        state.isLoading = false;
        const newItem = action.payload;
        const index = state.items.findIndex((i) => i.id === newItem.id);
        if (index !== -1) {
          state.items[index] = newItem;
        } else {
          state.items.push(newItem);
        }
      })
      .addCase(addItemToServer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error adding to cart.';
      });

    // UPDATE ITEM
    builder
      .addCase(updateItemOnServer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateItemOnServer.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload;
        const index = state.items.findIndex((i) => i.id === updated.id);
        if (index !== -1) state.items[index] = updated;
      })
      .addCase(updateItemOnServer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error updating cart item.';
      });

    // DELETE ITEM
    builder
      .addCase(deleteItemFromServer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteItemFromServer.fulfilled, (state, action) => {
        state.isLoading = false;
        const id = action.payload;
        state.items = state.items.filter((i) => i.id !== id);
      })
      .addCase(deleteItemFromServer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error deleting cart item.';
      });
  },
});

// ===================================================
// 🚀 EXPORTS
// ===================================================

export const {
  addItemLocal,
  updateItemLocal,
  removeItemLocal,
  clearLocalCart,
  setAuthStatus,
} = cartSlice.actions;

export default cartSlice.reducer;