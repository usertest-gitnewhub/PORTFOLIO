/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Webpack configuration to handle PDF generation and force Tailwind CSS v3
  webpack: (config) => {
    // Force Tailwind CSS v3
    config.resolve.alias = {
      ...config.resolve.alias,
      tailwindcss: require.resolve("tailwindcss"),
    }

    // Add fallbacks for Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      stream: false,
      util: false,
    }

    return config
  },
  // Prevent deployment issues by properly handling trailing slashes
  trailingSlash: false,
}

module.exports = nextConfig
