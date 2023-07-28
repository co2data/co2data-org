import Link from 'next/link'
import Co2Average from './co2-average'

export default function ContributorList({
  co2Averages,
}: {
  co2Averages: Co2Average[]
}) {
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
