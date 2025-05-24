/** @type {import('next').NextConfig} */
const nextConfig = {
  // Completely hides the prerender/compile indicators in dev mode
  devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
