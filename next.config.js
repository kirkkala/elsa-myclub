/** @type {import('next').NextConfig} */
import packageJson from "./package.json" with { type: "json" }

const nextConfig = {
  reactStrictMode: true,
  env: {
    APP_VERSION: packageJson.version,
  },
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Production optimizations
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
}

export default nextConfig
