import { Effect, flow, pipe } from 'effect'
import 'server-only'
import { type MainContext, mainLive } from './main'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type SearchParams = any

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type Params = any

type Props = {
  params?: Promise<Params>
  searchParams?: Promise<SearchParams>
  className?: string
}
type SyncProps = {
  params: Params | undefined
  searchParams: SearchParams | undefined
  className: string | undefined
}

function getParams(props: Props) {
  return Effect.promise(async () => ({
    params: await props.params,
    searchParams: await props.searchParams,
    className: props.className,
  }))
}

export function run<A>(
  effect: (arg1: SyncProps) => Effect.Effect<A, never, MainContext>,
) {
  return flow(
    getParams,
    Effect.flatMap(effect),
    Effect.provide(mainLive),
    Effect.runPromise,
  )
}

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
