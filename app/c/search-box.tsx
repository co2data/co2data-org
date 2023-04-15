'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'

export default function SearchBox() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()!

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  return (
    <>
      <p>Search</p>

      <label htmlFor="search"></label>
      <input
        title="search"
        placeholder="search"
        type="search"
        name="search"
        id="search"
        onChange={(e) => {
          router.push(
            // @ts-ignore
            pathname + '?' + createQueryString('search', e.target.value)
          )
        }}
        defaultValue={
          new URLSearchParams(searchParams).get('search') ?? undefined
        }
      />
    </>
  )
}
