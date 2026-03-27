// next.config.ts
import type { NextConfig } from "next";

if (process.env.NODE_ENV === "development") {
  import("@cloudflare/next-on-pages/next-dev")
    .then(({ setupDevPlatform }) => setupDevPlatform())
    .catch((e) => console.error("Cloudflare dev platform setup failed:", e));
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const nextConfig: NextConfig = {
  async rewrites() {
    // ✅ Skip rewrites entirely if API URL is not set — prevents build crash
    if (!apiUrl) return [];

    return [
      {
        source: "/sitemap.xml",
        destination: `${apiUrl}/seo/sitemap.xml`,
      },
      {
        source: "/robots.txt",
        destination: `${apiUrl}/seo/robots.txt`,
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
