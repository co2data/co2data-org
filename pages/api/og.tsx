import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
export const config = {
  runtime: 'edge',
}

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

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '3em',
            color: 'white',
            background: '#3982C2',
          }}
        >
          <div tw="flex flex-col grow">
            <div tw="flex grow justify-between">
              <div tw="flex flex-col text-center justify-center items-center rounded min-w-20 min-h-20 self-start p-3 text-xl leading-4 font-bold bg-white text-sky-600">
                CO₂
                <br />
                Data
              </div>
              <div tw="text-4xl">co2data.org</div>
            </div>
            {hasAllContributorData ? (
              <div tw="flex flex-col">
                <div tw="flex justify-between items-end">
                  <div tw="flex flex-col mb-2 shrink max-w-140 max-h-80">
                    <div tw="flex flex-col text-4xl">Emissons of</div>
                    <div tw="flex flex-col text-4xl">1 {unit}</div>
                    <div tw="flex flex-col text-8xl">{contributor}</div>
                  </div>
                  <div tw="flex flex-col text-[40] leading-[0.9]">
                    {(avgPerUnit ?? 1) / 1000}
                  </div>
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
