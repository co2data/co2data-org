import { Co2Average, Co2Repository, co2RepoLive } from '@/domain/co2'
import { setLogLevelFromSearchParams } from '@/lib/utils'
import { Effect, Layer, flow } from 'effect'
import Link from 'next/link'
import Co2AverageCmp from '@/components/co2-average'
import { NodeSdkLive } from '@/infra/tracing/NodeSdkLive'

export function ContributorListEffect(props: {
  searchParams: {
    [key: string]: string | undefined
  }
}) {
  return Co2Repository.pipe(
    Effect.flatMap((repo) => repo.getAllCo2Averages()),
    Effect.map(filter(props.searchParams['search'])),
    Effect.map(render),
    Effect.withSpan('Render /c/'),
    Effect.catchTag('DbError', handleDbError),
    setLogLevelFromSearchParams(props)
  ) satisfies Effect.Effect<any, never, JSX.Element>
}

function render(co2Averages: Co2Average[]) {
  return (
    <>
      <ul className="grid grid-cols-[repeat(auto-fill,_minmax(14rem,_1fr))] gap-8">
        {co2Averages.map((co2Average) => (
          <Co2AverageCmp key={co2Average.slug} co2Average={co2Average} />
        ))}
      </ul>
      {co2Averages.length === 0 && (
        <div className="mx-auto max-w-xs text-foreground/50">
          <h2 className="mb-2 text-2xl">Nothing found 🙁</h2>
          <p>
            Thank you for searching! Sadly this data is not available yet. Get
            in{' '}
            <Link className="underline" href="/about">
              contact
            </Link>
            , so that we can add more interesting data.
          </p>
        </div>
      )}
    </>
  )
}

function filter(term: string | null | undefined) {
  return (co2Averges: Co2Average[]) =>
    term
      ? co2Averges.filter((item) =>
          item.title.toLowerCase().includes(term.toLowerCase())
        )
      : co2Averges
}

function handleDbError() {
  return Effect.succeed(<main>The database is not reachable...</main>)
}

const ContributorList = flow(
  ContributorListEffect,
  Effect.provide(Layer.merge(co2RepoLive, NodeSdkLive)),
  Effect.runPromise
)
export default ContributorList
