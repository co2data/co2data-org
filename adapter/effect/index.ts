import { Effect, Either, flow, pipe } from 'effect'
import 'server-only'
import { type MainContext, mainLive } from './main'

export function run<P, Q, A>(
  effect: (arg1: P, arg2: Q) => Effect.Effect<A, never, MainContext>,
) {
  return flow(effect, Effect.provide(mainLive), Effect.runPromise)
}

export const runServerAction =
  (span: string) =>
  <E, A>(effect: Effect.Effect<A, E, MainContext>) => {
    return pipe(
      effect,
      Effect.withSpan(span),
      Effect.either,
      Effect.map(Either.flip),
      Effect.map((_) => _.toJSON() as unknown as typeof _),
      Effect.provide(mainLive),
      Effect.runPromise,
    )
  }
