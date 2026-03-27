// app/layout.tsx
import type { Metadata } from "next";
export const runtime = 'edge';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./store/Provider";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Safer fallback logic
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jottosop.in';
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  verification: {
    google: GA_ID,
  },
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'Jottosop - Online Electronics Shopping Store in India',
    template: '%s | Jottosop',
  },
  description: 'Shop latest electronics, mobiles, laptops, TVs & more at best prices. Free shipping on orders above ₹499. Customizable products available. Shop now!',
  keywords: ['online shopping', 'electronics', 'mobiles', 'laptops', 'TVs', 'customizable products', 'India', 'e-commerce', 'Jottosop'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    title: 'Jottosop - Best Online Shopping Site for Electronics',
    description: 'Shop latest electronics at best prices with free shipping.',
    siteName: 'Jottosop',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jottosop - Online Electronics Shopping',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ✅ Razorpay moved here, removed the duplicate from the bottom */}
        <Script 
          src="https://checkout.razorpay.com/v1/checkout.js" 
          strategy="lazyOnload" 
        />

        {/* ✅ Google Analytics Logic with safety check */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}

        <Providers>
          <Toaster />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}