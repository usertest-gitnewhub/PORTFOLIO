/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["placeholder.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true,
  },
  // Ensure proper handling of environment variables
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://codemuse.com",
  },
  // Optimize build output
  output: "standalone",
  // Improve performance with experimental features
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  // Transpile dependencies that use modern JavaScript features
  transpilePackages: ["jspdf", "jspdf-autotable"],
  // Webpack configuration to handle PDF generation
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      stream: false,
      util: false,
    }
    return config
  },
  // Prevent deployment errors by properly handling trailing slashes
  trailingSlash: false,
  // Ensure proper handling of internationalized routes
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  // Properly handle redirects
  async redirects() {
    return []
  },
  // Properly handle rewrites
  async rewrites() {
    return []
  },
  // Properly handle headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
