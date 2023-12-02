import { mainLive } from '@/adapter/effect/main'
import { Effect, flow } from 'effect'
import { createOgImageResponse } from './create-og-image-response'

export const runtime = 'edge'

export const GET = flow(
  // can't use run because of edge (OTel)
  createOgImageResponse,
  Effect.provide(mainLive),
  Effect.runPromise
)
