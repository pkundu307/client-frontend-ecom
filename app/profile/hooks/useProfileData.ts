// hooks/useProfileData.ts
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { baseUrl } from "@/app/utilities/baseUrl";

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface User {
  name: string;
  email?: string;
  picture?: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  productName: string;
  productImage: string;
  productSlug: string;
  variantSku: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: string;
  createdAt: string;
  estimatedDeliveryDate: string | null;
  selectedAddress: {
    id: string;
    city: string;
    type: string | null;
    state: string;
    street: string;
    country: string;
    landmark: string | null;
    latitude: number | null;
    createdAt: string;
    isDefault: boolean;
    longitude: number | null;
    updatedAt: string;
    postalCode: string;
    customerUserId: string;
    alternativePhoneNumber: string | null;
  } | null;
  items: OrderItem[];
  itemCount: number;
}

export interface UseProfileDataReturn {
  user: User | null;
  addresses: Address[];
  orders: Order[];
  isLoading: boolean;
  isAddressMutating: boolean;
  fetchAddresses: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  addAddress: (data: Omit<Address, "id">) => Promise<void>;
  updateAddress: (id: string, data: Omit<Address, "id">) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
}

export const useProfileData = (): UseProfileDataReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddressMutating, setIsAddressMutating] = useState<boolean>(false);

  // Read user from localStorage once on mount
  useEffect(() => {
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as User);
      } catch {
        setUser(null);
      }
    }
  }, []);

  const fetchAddresses = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setAddresses([]);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/user/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data: Address[] = await response.json();
        setAddresses(data);
      } else {
        setAddresses([]);
      }
    } catch {
      setAddresses([]);
    }
  };

  const fetchOrders = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setOrders([]);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data: unknown = await response.json();
        if (Array.isArray(data)) {
          setOrders(data as Order[]);
        } else {
          setOrders([]);
        }
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    }
  };

  // initial load
  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      await Promise.all([fetchAddresses(), fetchOrders()]);
      setIsLoading(false);
    };
    run();
  }, []);

  const addAddress = async (data: Omit<Address, "id">) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Please login to add address");
      return;
    }

    if (!data.street || !data.city || !data.state || !data.postalCode || !data.country) {
      toast.error("Please fill all address fields");
      return;
    }

    setIsAddressMutating(true);
    try {
      const response = await fetch(`${baseUrl}/user/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Address added successfully!");
        await fetchAddresses();
      } else {
        const error: { message?: string } = await response.json();
        toast.error(error.message || "Failed to add address");
      }
    } catch {
      toast.error("Error adding address");
    } finally {
      setIsAddressMutating(false);
    }
  };

  const updateAddress = async (id: string, data: Omit<Address, "id">) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Please login to update address");
      return;
    }

    if (!data.street || !data.city || !data.state || !data.postalCode || !data.country) {
      toast.error("Please fill all address fields");
      return;
    }

    setIsAddressMutating(true);
    try {
      const response = await fetch(`${baseUrl}/user/addresses/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Address updated successfully!");
        await fetchAddresses();
      } else {
        const error: { message?: string } = await response.json();
        toast.error(error.message || "Failed to update address");
      }
    } catch {
      toast.error("Error updating address");
    } finally {
      setIsAddressMutating(false);
    }
  };

  const deleteAddress = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Please login to delete address");
      return;
    }

    setIsAddressMutating(true);
    try {
      const response = await fetch(`${baseUrl}/user/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("Address deleted!");
        await fetchAddresses();
      } else {
        const error: { message?: string } = await response.json();
        toast.error(error.message || "Failed to delete address");
      }
    } catch {
      toast.error("Error deleting address");
    } finally {
      setIsAddressMutating(false);
    }
  };

  return {
    user,
    addresses,
    orders,
    isLoading,
    isAddressMutating,
    fetchAddresses,
    fetchOrders,
    addAddress,
    updateAddress,
    deleteAddress,
  };
};
