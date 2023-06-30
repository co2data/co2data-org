'use client'

import filterContributors from '@/app/c/searchAction'
import { Route } from 'next'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, useCallback, useTransition } from 'react'
import Spinner from './spinner'
import { Input } from './ui/input'

export default function SearchBox() {
  const [isPending, startTransition] = useTransition()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString())
      value ? params.set(name, value) : params.delete(name)

      return params.toString()
    },
    [searchParams]
  )

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    startTransition(() =>
      replace(('/c?' + createQueryString('search', value)) as Route)
    )
  }

  return (
    <form action={filterContributors}>
      <label className="sr-only" htmlFor="search">
        Search
      </label>
      <div className="relative mx-auto max-w-fit">
        <Input
          type="search"
          name="search"
          id="search"
          placeholder="Search"
          onChange={handleInputChange}
          defaultValue={searchParams?.get('search') ?? ''}
        />
        {isPending && (
          <div className="absolute -right-10 bottom-1/2 top-1/2 -my-4">
            <Spinner />
          </div>
        )}
      </div>
    </form>
  )
}
