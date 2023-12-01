import { Effect, Layer, flow } from 'effect'
import { Co2Repository } from './co2-repository'
import { SourceRepository, SourceRepositoryLive } from './source-repository'
import { NodeSdkLive } from '@/infra/tracing/NodeSdkLive'
import { sourceRepoLive } from '@/domain/source'
import { co2RepoLive } from '@/domain/co2'

export function run<P, Q, A>(
  effect: (
    arg1: P,
    arg2: Q
  ) => Effect.Effect<Co2Repository | SourceRepository, never, A>
) {
  return flow(
    effect,
    Effect.provide(Layer.merge(co2RepoLive, sourceRepoLive)),
    Effect.provide(NodeSdkLive),
    Effect.runPromise
  )
}
