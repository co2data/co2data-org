import { Effect, pipe, Result } from 'effect'
import 'server-only'
import { type MainContext, mainLive } from './main'

export type ServerActionSuccess<A> = {
  _id: 'Result'
  _tag: 'Success'
  value: A
}
export type ServerActionFailure<E> = {
  _id: 'Result'
  _tag: 'Failure'
  failure: E
}
export type ServerActionPayload<A, E> =
  | ServerActionSuccess<A>
  | ServerActionFailure<E>

export const runServerAction =
  (span: string) =>
  <A, E>(effect: Effect.Effect<A, E, MainContext>) => {
    return pipe(
      effect,
      Effect.withSpan(span),
      Effect.result,
      Effect.map((result): ServerActionPayload<A, E> => {
        if (Result.isFailure(result)) {
          return {
            _id: 'Result',
            _tag: 'Failure',
            failure: result.failure,
          }
        }
        return {
          _id: 'Result',
          _tag: 'Success',
          value: result.success,
        }
      }),
      Effect.provide(mainLive),
      Effect.runPromise,
    )
  }
