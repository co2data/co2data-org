import OgImageFrame from '@/components/og-image-frame'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export function GET(request: Request) {
  try {
    return new ImageResponse(
      <OgImageFrame>
        <div tw="flex flex-col">
          <div tw="flex text-[50]">CO2 Data</div>
          <div tw="flex text-4xl">What are the CO2 emissions of things.</div>
        </div>
      </OgImageFrame>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e: unknown) {
    console.log(`${isErrorMessage(e) ? e.message : e}`)
    return new Response('Failed to generate the image', {
      status: 500,
    })
  }
}

function isErrorMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  )
}
