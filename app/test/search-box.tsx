'use client'

import { Route } from 'next'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { debounce } from 'ts-debounce'

export default function SearchBox() {
  const router = useRouter()
  const searchParams = useSearchParams()!

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const getSearchResults = debounce((value) => {
    router.replace(('/c?' + createQueryString('search', value)) as Route)
  }, 500)

  return (
    <>
      <label htmlFor="search" className="sr-only"></label>
      <input
        className="rounded border-2 border-sky-600 bg-blue-50  focus:ring-4 focus:ring-sky-100"
        title="Search"
        placeholder="Search"
        type="search"
        name="search"
        id="search"
        onChange={(e) => {
          getSearchResults(e.target.value)
        }}
        defaultValue={
          new URLSearchParams(searchParams).get('search') ?? undefined
        }
      />
    </>
  )
}
