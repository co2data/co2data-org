import OgImageFrame from '@/components/og-image-frame'
import { ImageResponse } from '@vercel/og'
import type { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
}

export default function OG(req: NextRequest) {
  try {
    return new ImageResponse(
      (
        <OgImageFrame>
          <div tw="flex flex-col">
            <div tw="flex text-[50]">CO₂ Data</div>
            <div tw="flex text-4xl">What are the CO₂ emissions of things.</div>
          </div>
        </OgImageFrame>
      ),
      {
        width: 1200,
        height: 600,
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
