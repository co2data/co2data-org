import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/c',
      },
      {
        source: '/stats/:match*',
        destination: 'https://umami.schoenholzer.com/:match*',
      },
      {
        source: '/api/send',
        destination: 'https://umami.schoenholzer.com/api/send',
      },
    ]
  },
}

export default nextConfig
