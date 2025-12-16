// app/order-success/OrderSuccessContent.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

type OrderSuccessResponse = {
  success: boolean;
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  paymentMethod: "cash_on_delivery" | "online";
  createdAt: string;
  estimatedDeliveryDate: string | null;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    contactNumber?: string;
  } | null;
  items: {
    id: string;
    quantity: number;
    price: number;
    productName: string;
    productImage: string;
  }[];
};

const OrderSuccessContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderSuccessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Missing order id in URL.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view this order.");
          setLoading(false);
          return;
        }

        const res = await axios.get<OrderSuccessResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/success`,
          {
            params: { orderId },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setOrder(res.data);
      } catch (err: unknown) {
        const error = err as AxiosError<{ message: string }>;
        console.error(error);
        setError(
          error?.response?.data?.message || "Failed to load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading your order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold mb-2 text-red-600">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-4 text-center">
          {error || "Order not found."}
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-900 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow p-6 md:p-8">
        {/* Success header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-3">
            <span className="text-3xl">✅</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-950 mb-1">
            Order placed successfully!
          </h1>
          <p className="text-gray-600">
            Thank you for shopping with us. Your order is being processed.
          </p>
        </div>

        {/* Basic info */}
        <div className="grid md:grid-cols-2 gap-4 mb-6 text-sm md:text-base">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-500">Order Number</p>
            <p className="font-semibold text-gray-900">
              {order.orderNumber || order.orderId}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-500">Total Amount</p>
            <p className="font-semibold text-gray-900">
              ₹{order.totalAmount.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-500">Payment Method</p>
            <p className="font-semibold text-gray-900 capitalize">
              {order.paymentMethod === "cash_on_delivery"
                ? "Cash on Delivery"
                : "Online Payment"}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-500">Order Date</p>
            <p className="font-semibold text-gray-900">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          {order.estimatedDeliveryDate && (
            <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
              <p className="text-gray-500">Estimated Delivery</p>
              <p className="font-semibold text-gray-900">
                {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Address */}
        {order.deliveryAddress && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-blue-950 mb-2">
              Delivery Address
            </h2>
            <div className="bg-gray-50 rounded-xl p-4 text-sm md:text-base">
              <p className="font-semibold text-gray-900">
                {order.deliveryAddress.street}
              </p>
              <p className="text-gray-700">
                {order.deliveryAddress.city}, {order.deliveryAddress.state}{" "}
                {order.deliveryAddress.postalCode}
              </p>
              <p className="text-gray-700">{order.deliveryAddress.country}</p>
              {order.deliveryAddress.contactNumber && (
                <p className="text-gray-700 mt-1">
                  📞 {order.deliveryAddress.contactNumber}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Items */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-blue-950 mb-2">Order Items</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
              >
                <div className="w-14 h-14 rounded-lg bg-gray-200 overflow-hidden flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.productImage || "/placeholder.png"}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm md:text-base">
                    {item.productName}
                  </p>
                  <p className="text-xs text-gray-600">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-sm md:text-base font-semibold text-gray-900">
                  ₹{item.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex-1 bg-blue-900 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => router.push(`/orders/${order.orderId}`)}
            className="flex-1 border border-gray-300 text-gray-800 px-4 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            View Order Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessContent;
