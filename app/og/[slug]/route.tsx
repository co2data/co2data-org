import runtime from '@/adapter/effect/runtime'
import { createOgImageResponse } from './create-og-image-response'

export async function GET(
  request: Request,
  props: { params: Promise<{ slug: string | undefined }> },
) {
  const params = await props.params
  return createOgImageResponse(request, { params }).pipe(runtime.runPromise)
}
