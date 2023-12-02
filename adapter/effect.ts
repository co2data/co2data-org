import { NodeSdkLive } from '@/adapter/tracing/NodeSdkLive'
import { co2RepoLive } from '@/domain/co2'
import { sourceRepoLive } from '@/domain/source'
import { Effect, Layer, flow } from 'effect'
import 'server-only'
import { Co2Repository } from '../domain/co2/repository'
import { SourceRepository } from '../domain/source/repository'

export function run<P, Q, A>(
  effect: (
    arg1?: P,
    arg2?: Q
  ) => Effect.Effect<Co2Repository | SourceRepository, never, A>
) {
  return flow(
    effect,
    Effect.provide(Layer.merge(co2RepoLive, sourceRepoLive)),
    Effect.provide(NodeSdkLive),
    Effect.runPromise
  )
}
