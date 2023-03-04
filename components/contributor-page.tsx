import Co2Average from '@/components/co2-average'
import { getAllCo2Averages } from '@/domain/co2'
import ContributorList from './contributor-list'

export default async function ContributorPage() {
  const co2Averages = await getAllCo2Averages()

  return (
    <main>
      <ContributorList co2Averages={co2Averages} />
    </main>
  )
}
