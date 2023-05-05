import ContributorPage from '@/components/contributor-page'
import SearchBox from './search-box'

export default function ContributorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="space-y-12 text-center">
        <h1 className="text-6xl font-bold text-sky-600">
          CO<sub>2</sub> Data
        </h1>
        {/* <Suspense fallback={<SearchBoxFallback />}> */}
        <div>
          <SearchBox />
          {children}
        </div>
        {/* </Suspense> */}
      </div>
      {/* <h1>Contributors</h1>
      <SearchBox /> */}
      <div className="pt-20">
        {/* @ts-ignore */}
        <ContributorPage />
      </div>
    </>
  )
}
