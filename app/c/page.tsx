import ContributorList from '@/components/contributor-list'
import SearchBox from '@/components/search-box'
import { Co2Average, repository } from '@/domain/co2'

export default async function ContributorPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const { getAllCo2Averages } = repository()

  const filterByTerm = filter(searchParams['search'])
  const co2Averages = filterByTerm(await getAllCo2Averages())

  return (
    <div className={'space-y-20 sm:space-y-32 '}>
      <div className="space-y-12 text-center sm:space-y-20 ">
        <h1 className="text-6xl font-bold text-foreground">
          CO<sub>2</sub> Data
        </h1>
        <SearchBox />
      </div>
      <main>
        <ContributorList co2Averages={co2Averages} />
      </main>
    </div>
  )
}

const filter =
  (term: string | null | undefined) => (co2Averges: Co2Average[]) =>
    term
      ? co2Averges.filter((item) =>
          item.title.toLowerCase().includes(term.toLowerCase())
        )
      : co2Averges
