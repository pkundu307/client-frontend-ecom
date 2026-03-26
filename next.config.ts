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
    // ✅ Fix: Move unoptimized here (Top level of images)
    unoptimized: true, 
    
    // ✅ Keep remotePatterns to allow your specific image sources
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // This allows all HTTPS images
      },
    ],
  },
  trailingSlash: true,
};

export default nextConfig;