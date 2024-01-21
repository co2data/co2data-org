import { NodeSdkLive } from '@/adapter/tracing/NodeSdkLive'
import { PassKey } from '@/adapter/pass-key'
import { Effect, Layer, flow, pipe } from 'effect'
import 'server-only'
import { Co2Repository } from '../../domain/co2/repository'
import { SourceRepository } from '../../domain/source/repository'
import { mainLive } from './main'
import { UserRepository } from '@/domain/user/repository'

export function run<P, Q, A>(
  effect: (
    arg1: P,
    arg2: Q
  ) => Effect.Effect<Co2Repository | SourceRepository, never, A>
) {
  return flow(effect, Effect.provide(mainLive), Effect.runPromise)
}

export const runServerAction =
  (span: string) =>
  <E, A>(
    effect: Effect.Effect<
      Co2Repository | SourceRepository | UserRepository | PassKey,
      E,
      A
    >
  ) => {
    return pipe(
      effect,
      Effect.withSpan(span),
      Effect.either,
      Effect.map((a) => a.toJSON() as unknown as typeof a),
      Effect.provide(mainLive),
      Effect.runPromise
    )
  }
