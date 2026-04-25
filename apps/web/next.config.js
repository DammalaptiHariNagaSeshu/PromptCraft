/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ["@promptcraft/ui", "@promptcraft/types"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  webpack: (config) => {
    // Monaco Editor fix for Next.js
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },
};

module.exports = nextConfig;
