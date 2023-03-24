import { repository } from '@/domain/co2'
import ContributorList from './contributor-list'

export default async function ContributorPage() {
  const { getAllCo2Averages } = repository()

  const co2Averages = await getAllCo2Averages()

  return (
    <main>
      <ContributorList co2Averages={co2Averages} />
    </main>
  )
}
