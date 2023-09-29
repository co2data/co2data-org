import { Co2Average, Co2Repository, co2RepoLive } from '@/domain/co2'
import { Effect, flow } from 'effect'
import Link from 'next/link'
import Co2AverageCmp from '../../components/co2-average'

export function ContributorListEffect(props: {
  searchParams: {
    [key: string]: string | undefined
  }
}) {
  return Co2Repository.pipe(
    Effect.flatMap((repo) => repo.getAllCo2Averages()),
    Effect.map(filter(props.searchParams['search'])),
    Effect.map(render),
    Effect.catchAll(() => Effect.succeed(<main>Error</main>))
  )
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

const ContributorList = flow(
  ContributorListEffect,
  Effect.provideLayer(co2RepoLive),
  Effect.runPromise
)
export default ContributorList
