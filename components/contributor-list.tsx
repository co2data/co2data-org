import { redirect, useSearchParams } from 'next/navigation'
import Co2Average from './co2-average'
import SearchBox from './search-box'

export default function ContributorList({
  co2Averages,
}: {
  co2Averages: Co2Average[]
}) {
  const layoutDependingOnSearchState = `grid grid-cols-[repeat(auto-fill,_minmax(14rem,_1fr))] gap-8`

  return (
    <>
      <ul className={[layoutDependingOnSearchState].filter(Boolean).join(' ')}>
        {co2Averages.map((co2Average) => (
          <Co2Average key={co2Average.slug} co2Average={co2Average} />
        ))}
      </ul>
    </>
  )
}
