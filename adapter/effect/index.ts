import { NodeSdkLive } from '@/adapter/tracing/NodeSdkLive'
import { Effect, flow } from 'effect'
import 'server-only'
import { Co2Repository } from '../../domain/co2/repository'
import { SourceRepository } from '../../domain/source/repository'
import { mainLive } from './main'

export function run<P, Q, A>(
  effect: (
    arg1: P,
    arg2: Q
  ) => Effect.Effect<Co2Repository | SourceRepository, never, A>
) {
  return flow(
    effect,
    Effect.provide(mainLive),
    Effect.provide(NodeSdkLive),
    Effect.runPromise
  )
}
