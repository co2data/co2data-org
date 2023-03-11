import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
export const config = {
  runtime: 'edge',
}

const formatter = new Intl.NumberFormat('en', {
  style: 'unit',
  unit: 'kilogram',
  notation: 'compact',
})

export default function OG(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // ?contributor=<contributor>
    const contributorRaw = searchParams.get('contributor')
    const contributor =
      (contributorRaw?.length ?? 0) > 36
        ? contributorRaw?.slice(0, 36).concat('...')
        : contributorRaw
    // ?unit=<unit>
    const unit = searchParams.get('unit')?.slice(0, 20)
    // ?avg_per_unit=<avg_per_unit>
    const avgPerUnit = Number(
      searchParams.get('avg_per_unit')?.slice(0, 20) ?? 0
    )

    const hasAllContributorData = !!contributor && !!unit && !!avgPerUnit

    const formattedAvg = formatter
      .formatToParts((avgPerUnit ?? 1) / 1000)
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
            return <></>
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
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '3em 5em',
            color: 'white',
            background: '#3982C2',
          }}
        >
          <div tw="flex flex-col grow">
            <div tw="flex grow justify-between">
              <div tw="flex flex-col text-center justify-center items-center rounded-lg min-w-20 min-h-20 self-start p-3 text-xl leading-4 font-bold bg-white text-sky-600">
                CO₂
                <br />
                Data
              </div>
              <div tw="text-4xl">co2data.org</div>
            </div>
            {hasAllContributorData ? (
              <div tw="flex flex-col mt-8">
                <div tw="flex justify-between items-end">
                  <div tw="flex flex-col shrink mr-12">
                    <div tw="flex flex-col text-4xl">Emissions of 1 {unit}</div>
                    <p tw="flex flex-col text-8xl leading-[0.9]">
                      {contributor}
                    </p>
                  </div>
                  <div tw="flex shrink-0 items-end">{formattedAvg}</div>
                </div>
                <div tw="flex flex-col text-4xl mb-4 ml-4 self-end">
                  kg CO₂e
                </div>
              </div>
            ) : (
              <div tw="flex flex-col">
                <div tw="flex text-[50]">CO₂ Data</div>
                <div tw="flex text-4xl">
                  What are the CO₂ emissions of things.
                </div>
              </div>
            )}
          </div>
        </div>
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
