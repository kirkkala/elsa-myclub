import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    // Keep console.error/warn so API route failures show up in the Vercel logs
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
}

export default nextConfig
