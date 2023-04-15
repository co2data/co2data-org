import React from 'react'
import SearchBox from '../c/search-box'

export default function Test({
  searchPart,
  children,
}: {
  searchPart: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <>
      <SearchBox />
      {searchPart}

      {children}
    </>
  )
}
