'use client'

import { useState } from 'react'
import Co2Average from './co2-average'

export default function ContributorList({
  co2Averages,
}: {
  co2Averages: Co2Average[]
}) {
  const [term, setTerm] = useState('')
  return (
    <div className={term ? 'space-y-4' : 'space-y-20 sm:space-y-32 '}>
      <div className="space-y-12 text-center sm:space-y-20 ">
        <h1 className="text-6xl font-bold text-sky-600">
          CO<sub>2</sub> Data
        </h1>
        <div className="">
          <label className="sr-only" htmlFor="search">
            Search
          </label>
          <input
            className="rounded border-2 border-sky-600 focus:ring-4 focus:ring-sky-100"
            type="search"
            name="search"
            id="search"
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search"
            value={term}
          />
        </div>
      </div>
      <ul
        className={
          term
            ? 'flex flex-wrap justify-center gap-1'
            : 'grid grid-cols-[repeat(auto-fill,_minmax(14rem,_1fr))] gap-8'
        }
      >
        {co2Averages
          .filter((co2) =>
            term ? co2.title.toLowerCase().includes(term.toLowerCase()) : true
          )
          .map((co2Average) => (
            <Co2Average key={co2Average.slug} co2Average={co2Average} />
          ))}
      </ul>
    </div>
  )
}
