'use client'

import Co2Average from './co2-average'

export default function ContributorList({
  co2Averages,
}: {
  co2Averages: Co2Average[]
}) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,_minmax(14rem,_1fr))] gap-8">
      {co2Averages.map((co2Average) => (
        <Co2Average key={co2Average.slug} co2Average={co2Average} />
      ))}
    </ul>
  )
}
