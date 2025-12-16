// app/order-success/page.tsx
"use client";

import React, { Suspense } from "react";
import OrderSuccessContent from "./OrderSuccessContent";

const OrderSuccessPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600 text-lg">Loading your order...</p>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
};

export default OrderSuccessPage;
