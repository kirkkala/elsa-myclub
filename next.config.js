/** @type {import('next').NextConfig} */
import packageJson from "./package.json" with { type: "json" }

const nextConfig = {
  reactStrictMode: true,
  env: {
    APP_VERSION: packageJson.version,
  },
  // Next.js 15 optimizations
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
}

export default nextConfig
