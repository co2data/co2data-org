import OgImageFrame from '@/components/og-image-frame'
import { repository } from '@/domain/co2'
import { raise } from '@/lib/utils'
import { ImageResponse } from '@vercel/og'
import convert from 'convert'
import type { NextRequest } from 'next/server'
import { Fragment } from 'react'

export const config = {
  runtime: 'edge',
}

const formatter = new Intl.NumberFormat('en', {
  style: 'unit',
  unit: 'kilogram',
  notation: 'compact',
})

const { getCo2AverageBySlug } = repository()

export default async function OG(req: NextRequest) {
  try {
    const slug =
      req.nextUrl.searchParams.get('slug') ?? raise('No slug defined.')

    const co2Avg =
      (await getCo2AverageBySlug(slug)) ??
      raise(`Didn\'t find co2 data with slug "${slug}".`)

    const formattedParts = formatter.formatToParts(
      convert(co2Avg.avgPerUnit, 'grams').to('kg')
    )

    const formattedInteger = formattedParts.find(
      (part) => part.type === 'integer'
    )?.value
    const formattedAvgRest = formattedParts.map(({ type, value }) => {
      switch (type) {
        case 'integer':
        case 'unit':
        case 'literal':
          return <Fragment key={type} />
        default:
          return (
            <div key={type} tw="flex text-8xl leading-[0.8] mt-1">
              {value}
            </div>
          )
      }
    })

    return new ImageResponse(
      (
        <OgImageFrame>
          <div tw="flex justify-between items-end mt-8">
            <div tw="flex flex-col shrink flex-1 -mb-1">
              <div tw="flex flex-col text-4xl">
                Emissions of 1 {co2Avg.unit}
              </div>
              <div tw="flex flex-col text-8xl leading-[0.9] -ml-1">
                {co2Avg.title}
              </div>
            </div>
            <div tw="flex shrink-0 text-[42] leading-[0.75] ml-6">
              {formattedInteger}
            </div>
            <div tw="flex flex-col text-4xl justify-end">
              <div tw="flex flex-col ml-2 self-end">kg CO₂e</div>
              <div tw="flex">{formattedAvgRest}</div>
            </div>
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
    return new Response(
      `Failed to generate the image${e.message ? ': ' + e.message : ''}`,
      {
        status: 500,
      }
    )
  }
}
