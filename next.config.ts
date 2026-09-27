import type { NextConfig } from "next";
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  turbopack: {},
  output: "export",
  basePath: process.env.BASE_PATH || undefined,
  images: {
    unoptimized: true,
  },
};

export default withPWA(nextConfig);
