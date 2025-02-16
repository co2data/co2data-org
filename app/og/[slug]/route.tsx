import { mainEdgeLive } from '@/adapter/effect/edge-main'
import runtime from '@/adapter/effect/runtime'
import { Effect } from 'effect'
import { createOgImageResponse } from './create-og-image-response'

export async function GET(
  request: Request,
  props: { params: Promise<{ slug: string | undefined }> },
) {
  return createOgImageResponse(request, { params: await props.params }).pipe(
    runtime.runPromise,
  )
}
