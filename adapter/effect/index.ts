import { Effect, pipe } from 'effect'
import 'server-only'
import { type MainContext, mainLive } from './main'

export const runServerAction =
  (span: string) =>
  <E, A>(effect: Effect.Effect<A, E, MainContext>) => {
    return pipe(
      effect,
      Effect.withSpan(span),
      Effect.either,
      Effect.map((_) => _.toJSON() as unknown as typeof _),
      Effect.provide(mainLive),
      Effect.runPromise,
    )
  }
