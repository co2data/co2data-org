import { PassKey } from '@/adapter/pass-key'
import { UserRepository } from '@/domain/user/repository'
import { Effect, flow, pipe } from 'effect'
import 'server-only'
import { Co2Repository } from '../../domain/co2/repository'
import { SourceRepository } from '../../domain/source/repository'
import { Session } from '../session'
import { mainLive } from './main'

export function run<P, Q, A>(
  effect: (
    arg1: P,
    arg2: Q,
  ) => Effect.Effect<A, never, Co2Repository | SourceRepository | Session>,
) {
  return flow(effect, Effect.provide(mainLive), Effect.runPromise)
}

export const runServerAction =
  (span: string) =>
  <E, A>(
    effect: Effect.Effect<
      A,
      E,
      Co2Repository | SourceRepository | UserRepository | PassKey | Session
    >,
  ) => {
    return pipe(
      effect,
      Effect.withSpan(span),
      Effect.either,
      Effect.map((a) => a.toJSON() as unknown as typeof a),
      Effect.provide(mainLive),
      Effect.runPromise,
    )
  }
