import OgImageFrame from '@/components/og'
import { getCo2AverageBySlug } from '@/domain/co2'
import { ImageResponse } from '@vercel/og'
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

export default async function OG(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get('slug')
    if (!slug) throw Error('No slug defined.')

    const co2Avg = await getCo2AverageBySlug(slug)
    if (!co2Avg) throw Error(`Didn\'t find co2 data with slug "${slug}".`)

    const formattedAvg = formatter
      .formatToParts((co2Avg.avg_per_unit ?? 1) / 1000)
      .map(({ type, value }) => {
        switch (type) {
          case 'integer':
            return (
              <p key={type} tw="flex text-[40] leading-[0.75]">
                {value}
              </p>
            )
          case 'unit':
          case 'literal':
            return <Fragment key={type} />
          default:
            return (
              <p key={type} tw="flex text-8xl mb-1">
                {value}
              </p>
            )
        }
      })

    return new ImageResponse(
      (
        <OgImageFrame>
          <div tw="flex flex-col mt-8">
            <div tw="flex justify-between items-end">
              <div tw="flex flex-col shrink mr-12">
                <div tw="flex flex-col text-4xl">
                  Emissions of 1 {co2Avg.unit}
                </div>
                <p tw="flex flex-col text-8xl leading-[0.9]">{co2Avg.title}</p>
              </div>
              <div tw="flex shrink-0 items-end">{formattedAvg}</div>
            </div>
            <div tw="flex flex-col text-4xl mb-4 ml-4 self-end">kg CO₂e</div>
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
    return new Response(
      `Failed to generate the image${e.message ? ': ' + e.message : ''}`,
      {
        status: 500,
      }
    )
  }
}
