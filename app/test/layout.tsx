import React, { Suspense } from 'react'
import SearchBox from './search-box'
import SearchBoxFallback from './search-box-fallback'

export default function Test({
  searchPart,
  children,
}: {
  searchPart: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <>
      <div className="space-y-12 text-center sm:space-y-20 ">
        <h1 className="text-6xl font-bold text-sky-600">
          CO<sub>2</sub> Data
        </h1>
        <Suspense fallback={<SearchBoxFallback />}>
          <SearchBox />
        </Suspense>
      </div>
      {searchPart}

      <div className="pt-20">{children}</div>
    </>
  )
}
