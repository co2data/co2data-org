'use client'

import filterContributors from '@/app/c/searchAction'
import { Input } from '@/components/ui/input'
import Spinner from '@/components/ui/spinner'
import { Route } from 'next'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useCallback, useTransition } from 'react'

export default function SearchBox({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const [isPending, startTransition] = useTransition()
  const { replace } = useRouter()

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
      replace(('/c?' + createQueryString('search', value)) as Route, {
        scroll: false,
      })
    )
  }

  return (
    <form action={filterContributors} className="px-12">
      <label className="sr-only" htmlFor="search">
        Search
      </label>
      <div className="relative mx-auto max-w-xs">
        <Input
          type="search"
          name="search"
          id="search"
          placeholder="Search"
          onChange={handleInputChange}
          defaultValue={searchParams['search'] ?? ''}
          autoComplete="one-time-code"
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
