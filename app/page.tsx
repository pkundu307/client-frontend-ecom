"use client"; // ✅ Must be a client component for the guard to work

export const runtime = 'edge';

import React, { useEffect, useState } from 'react'
import Home from './page/Home'

const Page = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // While the server is rendering or client is hydrating, 
  // we show a consistent container.
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#e8ecf0] flex items-center justify-center">
        {/* Replace this with your actual logo/spinner if you have one */}
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className='no-scrollbar'>
      <Home />
    </div>
  )
}

export default Page;