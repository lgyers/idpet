import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    remotePatterns: [
      // Vercel Blob Storage
      {
        protocol: "https",
        hostname: "*.vercel-storage.com",
      },
      // Replicate API generated images
      {
        protocol: "https",
        hostname: "replicate.delivery",
      },
      // Google user avatars
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      // GitHub user avatars
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
