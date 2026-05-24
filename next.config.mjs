/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  devIndicators: false,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
