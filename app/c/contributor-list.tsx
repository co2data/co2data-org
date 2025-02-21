import runtime from '@/adapter/effect/runtime'
import Co2AverageCmp from '@/components/co2-average'
import { type Co2Average, Co2Repository } from '@/domain/co2'
import { setLogLevelFromSearchParams } from '@/lib/utils'
import { Effect } from 'effect'
import type { SearchParams } from 'next/dist/server/request/search-params'
import Link from 'next/link'

import type { JSX } from 'react'

export default async function ContributorList(props: {
  searchParams: Promise<SearchParams>
}) {
  const searchParams = await props.searchParams
  return ContributorListEffect({ searchParams }).pipe(runtime.runPromise)
}

export function ContributorListEffect(props: { searchParams: SearchParams }) {
  return Co2Repository.getAllCo2Averages.pipe(
    Effect.map(filter(props.searchParams.search)),
    Effect.map(render),
    Effect.withSpan('Render /c/'),
    Effect.catchTag('DbError', handleDbError),
    setLogLevelFromSearchParams(props.searchParams),
  ) satisfies Effect.Effect<JSX.Element, never, unknown>
}

function render(co2Averages: Co2Average[]) {
  return (
    <>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-4">
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

function filter(term: string | string[] | null | undefined) {
  return (co2Averges: Co2Average[]) =>
    term && typeof term === 'string'
      ? co2Averges.filter((item) =>
          item.title.toLowerCase().includes(term.toLowerCase()),
        )
      : co2Averges
}

function handleDbError() {
  return Effect.succeed(<main>The database is not reachable...</main>)
}
