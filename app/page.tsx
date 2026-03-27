"use client";

export const runtime = 'edge';

import React from 'react';
import dynamic from 'next/dynamic';

// ✅ This prevents the 'Home' code from even being loaded on the server.
// It only downloads and runs when the browser is ready.
const Home = dynamic(() => import('./page/Home'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center">
      {/* While the JS is loading, show this simple spinner */}
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
});

export default function Page() {
  return (
    <main className='no-scrollbar'>
      <Home />
    </main>
  );
}