import { Effect, pipe } from 'effect'
import 'server-only'
import { type MainContext, mainLive } from './main'

export const runPromise = <E, A>(effect: Effect.Effect<A, E, MainContext>) => {
  return pipe(effect, Effect.provide(mainLive), Effect.runPromise)
}
