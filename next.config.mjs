/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/c',
      },
    ]
  },
}

export default nextConfig
