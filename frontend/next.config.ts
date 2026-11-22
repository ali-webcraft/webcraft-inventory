import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  // Browser hamesha apni hi site ko "/api/..." bhejta hai, aur Next.js use backend ko forward kar deta hai.
  // Is tarah cookie "first-party" rehti hai (Safari/iPhone par bhi login chalta hai) aur CORS ka masla nahi aata.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL ?? "http://localhost:5000"}/api/:path*`,
      },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
