/** @type {import('next').NextConfig} */
const packageJson = require("./package.json")

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

module.exports = nextConfig
