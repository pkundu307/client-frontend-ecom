// Make this a Client Component to use browser-only APIs like `window`
"use client";

import React, { useState, useEffect } from 'react';
import { MonitorOff } from 'lucide-react'; // Icon for the desktop message
import SearchPage from '../components/SearchBar';

/**
 * A component to display when the user is on a desktop device.
 */
const UnavailableOnDesktop = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <MonitorOff className="w-20 h-20 text-gray-400 mb-6" />
      <h1 className="text-3xl font-bold text-gray-800">
        This Page is Mobile-Only
      </h1>
      <p className="text-lg text-gray-600 mt-2">
        For the best experience, please visit this page on a mobile device.
      </p>
    </div>
  );
};

/**
 * The main page component that conditionally renders based on screen size.
 */
const Page = () => {
  // Initialize state to `null` to handle server-side rendering gracefully.
  // We don't know the screen size on the server, so we wait until the client loads.
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    // This function checks the window width and updates the state.
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // 768px is a common breakpoint for tablets
    };

    // 1. Run the check once when the component mounts on the client.
    checkScreenSize();

    // 2. Add an event listener to re-check whenever the window is resized.
    window.addEventListener('resize', checkScreenSize);

    // 3. Cleanup: Remove the event listener when the component unmounts.
    // This is crucial to prevent memory leaks.
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []); // The empty dependency array [] ensures this effect runs only once on mount.


  // --- Render Logic ---

  // While `isMobile` is `null`, we are either on the server or the client
  // hasn't run the effect yet. Render nothing to avoid a flash of incorrect content.
  if (isMobile === null) {
    return null; // Or a loading spinner: <div className="min-h-screen" />
  }

  // Once the check has run, render the appropriate component.
  return (
    <div>
      {isMobile ? <SearchPage /> : <UnavailableOnDesktop />}
    </div>
  );
};

export default Page;