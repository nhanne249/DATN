import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: '.next',
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*', // Proxy API requests to NestJS backend
      },
    ];
  },
};

export default nextConfig;
