import { mainEdgeLive } from '@/adapter/effect/edge-main'
import { mainLive } from '@/adapter/effect/main'
import { Effect, flow } from 'effect'
import { createOgImageResponse } from './create-og-image-response'

export const runtime = 'edge'

export const GET = flow(
  createOgImageResponse,
  Effect.provide(mainEdgeLive),
  Effect.runPromise,
)
