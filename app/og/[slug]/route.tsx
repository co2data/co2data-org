import { mainLive } from '@/adapter/effect/main'
import { Effect, flow } from 'effect'
import { createOgImageResponse } from './create-og-image-response'
import { mainEdgeLive } from '@/adapter/effect/edge-main'

export const runtime = 'edge'

export const GET = flow(
  createOgImageResponse,
  Effect.provide(mainEdgeLive),
  Effect.runPromise
)
