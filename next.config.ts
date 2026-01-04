import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/seo/sitemap.xml`,
      },
      {
        source: '/robots.txt',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/seo/robots.txt`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Wildcard to match any domain
      },
    ],
  },
};

export default nextConfig;