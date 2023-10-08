import { co2RepoLive } from '@/domain/co2'
import { Effect, flow } from 'effect'
import { createOgImageResponse } from './create-og-image-response'

export const runtime = 'edge'

export const GET = flow(
  createOgImageResponse,
  Effect.provide(co2RepoLive),
  Effect.runPromise
)
