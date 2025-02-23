import ContributorList from '@/app/c/contributor-list'
import SearchBox from '@/app/c/search-box'
import Spinner from '@/components/ui/spinner'
import { Suspense } from 'react'

export default async function ContributorPage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  return (
    <main className="py-6 md:py-10">
      <div className="min-h-screen space-y-16 md:space-y-20">
        <div className="space-y-12 text-center md:space-y-16">
          <h1 className="font-extrabold text-6xl text-foreground">
            CO<sub>2</sub> Data
          </h1>
          <SearchBox searchParams={await props.searchParams} />
        </div>
        <main>
          <Suspense
            fallback={
              <div className="text-center">
                <Spinner className="inline h-20 w-20" strokeWidth={2.5} />
              </div>
            }
          >
            <ContributorList searchParams={props.searchParams} />
          </Suspense>
        </main>
      </div>
    </main>
  )
}
