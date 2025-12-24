"use client";

import { useEffect, useState } from "react";
import { baseUrl } from "../../utilities/baseUrl";

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

export const useOrdersData = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      setOrders([]);
      setError("Please login to view your orders.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${baseUrl}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.message || "Failed to load orders.");
        setOrders([]);
        return;
      }

      const data: unknown = await response.json();

      if (Array.isArray(data)) {
        setOrders(data as Order[]);
      } else {
        setOrders([]);
      }
    } catch {
      setError("Failed to load orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { orders, loading, error, refetch: fetchOrders };
};
