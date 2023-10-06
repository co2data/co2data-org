import OgImageFrame from '@/components/og-image-frame'
import { Co2Average, Co2Repository, co2RepoLive } from '@/domain/co2'
import { DbError } from '@/infra/db'
import { BaseError } from '@/lib/types'
import convert from 'convert'
import { Data, Effect, flow } from 'effect'
import { ImageResponse } from 'next/server'
import { Fragment } from 'react'

export const runtime = 'edge'

export const GET = flow(
  createImage,
  Effect.provide(co2RepoLive),
  Effect.runPromise
)
function createImage(
  request: Request,
  { params }: { params: { slug: string | undefined } }
) {
  return Effect.fromNullable(params.slug).pipe(
    Effect.mapError(() => new NoParamError()),
    Effect.flatMap(getCo2Average),
    Effect.flatMap(Effect.orElseFail(notFound(params.slug))),
    Effect.flatMap(renderImage),
    Effect.catchAll(handleError)
  ) satisfies Effect.Effect<any, never, ImageResponse>
}

const formatter = new Intl.NumberFormat('en', {
  style: 'unit',
  unit: 'kilogram',
  notation: 'compact',
})

function renderImage(co2Avg: Co2Average) {
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
  const imageResponse = Effect.try({
    try: () =>
      createNewImageResponse(co2Avg, formattedInteger, formattedAvgRest),
    catch: (cause) => new ImageRenderError({ cause }),
  })

  return imageResponse
}

function createNewImageResponse(
  co2Avg: Co2Average,
  formattedInteger: string | undefined,
  formattedAvgRest: JSX.Element[]
) {
  return new ImageResponse(
    (
      <OgImageFrame>
        <div tw="flex justify-between items-end mt-8">
          <div tw="flex flex-col shrink flex-1 -mb-1">
            <div tw="flex flex-col text-4xl">Emissions of 1 {co2Avg.unit}</div>
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
}

function getCo2Average(slug: string) {
  return Co2Repository.pipe(
    Effect.flatMap((repo) => repo.getCo2AverageBySlug(slug))
  )
}
function notFound(slug: string | undefined) {
  return () =>
    new NotFoundError({
      cause: `Entry with slug ${slug} not found.`,
    })
}

class ImageRenderError extends Data.TaggedClass(
  'ImageRenderError'
)<BaseError> {}

class NoParamError extends Data.TaggedClass('NoParamError')<{}> {
  readonly cause = 'No parameter defined.'
}
class NotFoundError extends Data.TaggedClass('NotFoundError')<BaseError> {}

function handleError(
  error: NoParamError | DbError | NotFoundError | ImageRenderError
) {
  return Effect.succeed(
    new Response(`Failed to generate the image. ${error.cause}`, {
      status: 500,
    })
  )
}
