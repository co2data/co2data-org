import OgImageFrame from '@/components/og-image-frame'
import { ImageResponse } from 'next/server'

export const runtime = 'edge'

export function GET(request: Request) {
  try {
    return new ImageResponse(
      (
        <OgImageFrame>
          <div tw="flex flex-col">
            <div tw="flex text-[50]">CO2 Data</div>
            <div tw="flex text-4xl">What are the CO2 emissions of things.</div>
          </div>
        </OgImageFrame>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
