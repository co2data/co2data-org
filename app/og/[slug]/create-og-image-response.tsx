import OgImageFrame from '@/components/og-image-frame'
import { Co2Average, Co2Repository } from '@/domain/co2'
import { DbError } from '@/infra/db'
import { BaseError } from '@/lib/types'
import convert from 'convert'
import { Data, Effect } from 'effect'
import { ImageResponse } from 'next/server'
import { Fragment } from 'react'

export function createOgImageResponse(
  request: Request,
  { params }: { params: { slug: string | undefined } }
) {
  return parseSlug(params.slug).pipe(
    Effect.flatMap(getCo2Average),
    Effect.flatMap(renderImageAsResponse),
    Effect.catchAll(handleErrors)
  ) satisfies Effect.Effect<any, never, ImageResponse>
}

export function renderImageAsResponse(co2Avg: Co2Average) {
  const { formattedInteger, formattedAvgRest } = renderNumberParts(co2Avg)
  const renderedImage = renderImage(co2Avg, formattedInteger, formattedAvgRest)
  return wrapInResponse(renderedImage).pipe(Effect.withSpan('/render image'))
}
function renderNumberParts(co2Avg: Co2Average) {
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
  return { formattedInteger, formattedAvgRest }
}

export function renderImage(
  co2Avg: Co2Average,
  formattedInteger: string | undefined,
  formattedAvgRest: JSX.Element[]
) {
  return (
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
          <div tw="flex flex-col ml-2 self-end">kg CO2e</div>
          <div tw="flex">{formattedAvgRest}</div>
        </div>
      </div>
    </OgImageFrame>
  )
}

export function wrapInResponse(renderedImage: JSX.Element) {
  return Effect.try({
    try: () =>
      new ImageResponse(renderedImage, {
        width: 1200,
        height: 630,
      }),
    catch: (cause) => new ImageRenderError({ cause }),
  })
}

const formatter = new Intl.NumberFormat('en', {
  style: 'unit',
  unit: 'kilogram',
  notation: 'compact',
})

function parseSlug(slug: string | undefined) {
  return Effect.fromNullable(slug).pipe(
    Effect.mapError(() => new NoParamError())
  )
}

function getCo2Average(slug: string) {
  return Co2Repository.pipe(
    Effect.flatMap((repo) => repo.getCo2AverageBySlug(slug)),
    Effect.flatMap(Effect.orElseFail(notFound(slug)))
  )
}
function notFound(slug: string | undefined) {
  return () =>
    new NotFoundError({
      cause: `Entry with slug ${slug} not found.`,
    })
}

class NoParamError extends Data.TaggedError('NoParam')<{}> {
  readonly cause = 'No parameter defined.'
}
class NotFoundError extends Data.TaggedError('NotFound')<BaseError> {}

class ImageRenderError extends Data.TaggedError('ImageRender')<BaseError> {}

function handleErrors(
  error: NoParamError | DbError | NotFoundError | ImageRenderError
) {
  return Effect.succeed(
    new Response(`Failed to generate the image. ${error.cause}`, {
      status: 500,
    })
  )
}
