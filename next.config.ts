import type { NextConfig } from "next";
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const isExport = process.env.NODE_ENV === "production" && process.env.EXPORT_MODE === "true";

const nextConfig: NextConfig = {
  turbopack: {},
  output: isExport ? "export" : undefined,
  basePath: isExport ? (process.env.BASE_PATH || undefined) : undefined,
  images: {
    unoptimized: true,
  },
};

// Only apply PWA when not doing static export
const config = isExport ? nextConfig : withPWA(nextConfig);

export default config;
