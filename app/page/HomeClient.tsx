// app/page/HomeClient.tsx
"use client";
import React, { Suspense } from "react";

// ✅ React.lazy is the correct replacement for dynamic+ssr:false on edge runtime
const Home = React.lazy(() => import("./Home"));

export default function HomeClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <Home />
    </Suspense>
  );
}
