import { Co2Repository, co2RepoLive } from '@/domain/co2'
import { Effect } from 'effect'
import Link from 'next/link'
import Co2Average from '../../components/co2-average'

export default async function ContributorList({
  searchParams,
  deps = { repository: co2RepoLive },
}: {
  searchParams: { [key: string]: string | undefined }
  deps?: { repository: typeof co2RepoLive }
}) {
  const co2Averages = await getCo2Averages(searchParams, deps)

  return (
    <>
      <ul className="grid grid-cols-[repeat(auto-fill,_minmax(14rem,_1fr))] gap-8">
        {co2Averages.map((co2Average) => (
          <Co2Average key={co2Average.slug} co2Average={co2Average} />
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

function getCo2Averages(
  searchParams: { [key: string]: string | undefined },
  deps: { repository: typeof co2RepoLive }
) {
  return Co2Repository.pipe(
    Effect.flatMap((repo) => repo.getAllCo2Averages()),
    Effect.map(filter(searchParams['search'])),
    Effect.provideLayer(deps.repository),
    Effect.runPromise
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
