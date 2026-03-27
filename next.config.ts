// next.config.ts
import type { NextConfig } from "next";

// ✅ Use .catch() instead of await — top-level await breaks next.config.ts
if (process.env.NODE_ENV === "development") {
  import("@cloudflare/next-on-pages/next-dev")
    .then(({ setupDevPlatform }) => setupDevPlatform())
    .catch((e) => console.error("Cloudflare dev platform setup failed:", e));
}

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/seo/sitemap.xml`,
      },
      {
        source: "/robots.txt",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/seo/robots.txt`,
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
