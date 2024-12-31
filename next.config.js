/** @type {import('next').NextConfig} */
const packageJson = require('./package.json')

const nextConfig = {
  reactStrictMode: true,
  env: {
    APP_VERSION: packageJson.version,
  },
}

module.exports = nextConfig
