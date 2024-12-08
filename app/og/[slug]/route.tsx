import { mainEdgeLive } from '@/adapter/effect/edge-main'
import { Effect } from 'effect'
import { createOgImageResponse } from './create-og-image-response'

export async function GET(
  request: Request,
  props: { params: Promise<{ slug: string | undefined }> },
) {
  return createOgImageResponse(request, { params: await props.params }).pipe(
    Effect.provide(mainEdgeLive),
    Effect.runPromise,
  )
}
