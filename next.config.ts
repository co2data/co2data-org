import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/c',
      },
    ]
  },
}
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform()
}
export default nextConfig
