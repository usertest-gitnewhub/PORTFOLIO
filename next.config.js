/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    GROQ_API_KEY: process.env.GROQ_API_KEY || "",
  },
  // Ensure we're not using any deprecated or invalid options
  experimental: {
    optimizeFonts: false,
  },
  poweredByHeader: false,
}

module.exports = nextConfig
