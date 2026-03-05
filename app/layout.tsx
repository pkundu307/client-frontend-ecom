import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://jottosop.in'),
    verification: {
    google: process.env.NEXT_PUBLIC_GA_ID, // ✅ Add this exact code
  },
 alternates: {
    canonical: '/', // Or use process.env.NEXT_PUBLIC_SITE_URL for the base
  },
  title: {
    default: 'Jottosop - Online Electronics Shopping Store in India',
    template: '%s | Jottosop',
  },
  description: 'Shop latest electronics, mobiles, laptops, TVs & more at best prices. Free shipping on orders above ₹499. Customizable products available. Shop now!',
  keywords: ['online shopping', 'electronics', 'mobiles', 'laptops', 'TVs', 'customizable products', 'India', 'e-commerce', 'Jottosop'],
  authors: [{ name: 'Jottosop' }],
  creator: 'Jottosop',
  publisher: 'Jottosop',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    title: 'Jottosop - Best Online Shopping Site for Electronics',
    description: 'Shop latest electronics at best prices with free shipping. Customizable products available.',
    siteName: 'Jottosop',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jottosop Online Shopping',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jottosop - Online Electronics Shopping',
    description: 'Shop latest electronics at best prices',
    images: ['/twitter-image.png'],
    creator: '@jottosop',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#e8ecf0" />
        
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Toaster />
          <Navbar />
          {children}
        </Providers>
        <Footer />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </body>
    </html>
  );
}
