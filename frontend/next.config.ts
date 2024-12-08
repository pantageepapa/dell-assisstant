import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    domains: ['dellforstartups.com'], // Add the domain for external images
  },
};

export default nextConfig;
