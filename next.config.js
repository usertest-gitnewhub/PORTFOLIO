/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  // Prevent deployment issues by properly handling trailing slashes
  trailingSlash: false,
  // Ignore ESLint errors during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore TypeScript errors during builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable page optimization to prevent export errors
  optimizeFonts: false,
  poweredByHeader: false,
}

module.exports = nextConfig
