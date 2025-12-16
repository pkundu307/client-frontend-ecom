import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { CartState, CartItem, AddToCartPayload } from "./types";

// -----------------------------
// API CONFIG
// -----------------------------
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// -----------------------------
// Auth header helper
// -----------------------------
const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return {}; 
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
    return (
      axiosError.response?.data?.message || axiosError.message || defaultMessage
    );
  }
  try {
    return (error as Error).message || defaultMessage;
  } catch {
    return defaultMessage;
  }
};

// -----------------------------
// LocalStorage helpers
// -----------------------------
const GUEST_CART_KEY = "guest_cart";

const loadCartFromStorage = (): CartItem[] => {
  try {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(GUEST_CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (cart: CartItem[]) => {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  } catch {
    /* ignore */
  }
};

const sameCustomization = (
  a?: Record<string, unknown> | null,
  b?: Record<string, unknown> | null
) => {
  try {
    return JSON.stringify(a || {}) === JSON.stringify(b || {});
  } catch {
    return false;
  }
};

// -----------------------------
// 🟢 DEFENSIVE MERGE FUNCTION (Keeps Images!)
// -----------------------------
const mergeServerItem = (items: CartItem[], newItem: CartItem) => {
  const idx = items.findIndex((i) => i.id === newItem.id);
  if (idx !== -1) {
    const existingItem = items[idx];
    const mergedItem = { ...existingItem };

    // 1. Update basic fields
    mergedItem.quantity = newItem.quantity;
    
    // 2. Update Customization
    if (newItem.customizationDetails) {
        mergedItem.customizationDetails = newItem.customizationDetails;
    }
    if (newItem.customizationImages && newItem.customizationImages.length > 0) {
        mergedItem.customizationImages = newItem.customizationImages;
    }

    // 3. DEFENSIVE UPDATE for Relations
    // Only overwrite 'variant' if the new one has images or price data
    if (
      newItem.variant && 
      (newItem.variant.images?.length > 0 || newItem.variant.price)
    ) {
      mergedItem.variant = newItem.variant;
    }

    // Only overwrite 'product' if the new one has a title or images
    if (
      newItem.product && 
      (newItem.product.title || newItem.product.images?.length > 0)
    ) {
      mergedItem.product = newItem.product;
    }

    items[idx] = mergedItem;
  } else {
    items.push(newItem);
  }
};

// -----------------------------
// Async thunks
// -----------------------------

export const fetchCartItems = createAsyncThunk<
  CartItem[],
  void,
  { rejectValue: string }
>("cart/fetchItems", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get<CartItem[]>(
      `${API_BASE_URL}/cart`,
      getAuthHeaders()
    );
    return res.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error, "Failed to fetch cart."));
  }
});

export const addItemToServer = createAsyncThunk<
  CartItem,
  AddToCartPayload,
  { rejectValue: string }
>("cart/addItemToServer", async (payload, { rejectWithValue }) => {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return rejectWithValue("Please log in first.");

    const {
      productId,
      variantId,
      quantity,
      customizationDetails,
      customizationImages,
    } = payload;

    const formData = new FormData();
    formData.append("productId", productId);
    if (variantId) formData.append("variantId", variantId);
    formData.append("quantity", quantity.toString());
    if (customizationDetails)
      formData.append(
        "customizationDetails",
        JSON.stringify(customizationDetails)
      );

    if (Array.isArray(customizationImages)) {
      customizationImages.forEach((file) => {
        formData.append("customizationImages", file as File);
      });
    }

    const res = await axios.post<CartItem>(
      `${API_BASE_URL}/cart/add-item`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    return rejectWithValue(
      handleAxiosError(error, "Failed to add item to cart.")
    );
  }
});

export const updateItemOnServer = createAsyncThunk<
  CartItem,
  { id: string; data: Partial<AddToCartPayload> },
  { rejectValue: string }
>("cart/updateItemOnServer", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axios.patch<CartItem>(
      `${API_BASE_URL}/cart/${id}`,
      data,
      getAuthHeaders()
    );
    return res.data;
  } catch (error) {
    return rejectWithValue(
      handleAxiosError(error, "Failed to update cart item.")
    );
  }
});

export const deleteItemFromServer = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("cart/deleteItemFromServer", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_BASE_URL}/cart/${id}`, getAuthHeaders());
    return id;
  } catch (error) {
    return rejectWithValue(
      handleAxiosError(error, "Failed to remove cart item.")
    );
  }
});

// -----------------------------
// Slice initial state
// -----------------------------
const initialState: CartState = {
  items: loadCartFromStorage(),
  isLoading: false,
  selected: [],
  error: null,
  isAuthenticated: false,
};

// -----------------------------
// Slice
// -----------------------------
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setAuthStatus: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      if (!action.payload) saveCartToStorage(state.items);
    },
    setSelected: (state, action: PayloadAction<CartItem[]>) => {
      state.selected = action.payload;
    },
    clearSelected: (state) => {
      state.selected = [];
    },

    addItemLocal: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existing = state.items.find(
        (item) =>
          item.productId === newItem.productId &&
          item.variantId === newItem.variantId &&
          sameCustomization(
            item.customizationDetails,
            newItem.customizationDetails
          ) &&
          JSON.stringify(item.customizationImages || []) ===
            JSON.stringify(newItem.customizationImages || [])
      );

      if (existing) {
        existing.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
      saveCartToStorage(state.items);
    },

    updateItemLocal: (
      state,
      action: PayloadAction<{ id: string; data: Partial<CartItem> }>
    ) => {
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
      .addCase(
        fetchCartItems.fulfilled,
        (state, action: PayloadAction<CartItem[]>) => {
          state.isLoading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Error fetching cart.";
      });

    // ADD
    builder
      .addCase(addItemToServer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        addItemToServer.fulfilled,
        (state, action: PayloadAction<CartItem>) => {
          state.isLoading = false;
          mergeServerItem(state.items, action.payload);
        }
      )
      .addCase(addItemToServer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Error adding to cart.";
      });

    // UPDATE
    builder
      .addCase(updateItemOnServer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateItemOnServer.fulfilled,
        (state, action: PayloadAction<CartItem>) => {
          state.isLoading = false;
          mergeServerItem(state.items, action.payload);
        }
      )
      .addCase(updateItemOnServer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Error updating cart item.";
      });

    // DELETE
    builder
      .addCase(deleteItemFromServer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        deleteItemFromServer.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.items = state.items.filter((i) => i.id !== action.payload);
          saveCartToStorage(state.items);
        }
      )
      .addCase(deleteItemFromServer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Error deleting cart item.";
      });
  },
});

// -----------------------------
// Action Exports
// -----------------------------
export const {
  addItemLocal,
  updateItemLocal,
  removeItemLocal,
  clearLocalCart,
  setAuthStatus,
  setSelected,
  clearSelected,
} = cartSlice.actions;

export default cartSlice.reducer;

// -----------------------------
// 🟢 RESTORED SELECTORS
// -----------------------------
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.isLoading;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;
export const selectUniqueItemCount = (state: { cart: CartState }) => state.cart.items.length;