import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import type { NextConfig } from 'next'

initOpenNextCloudflareForDev()
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

export default nextConfig
